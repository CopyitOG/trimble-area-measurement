// Trimble Connect Attribute Markup Tool v2.0
// Uses official Workspace API TextMarkup to display property labels

class AttributeMarkupTool {
    constructor() {
        this.api = null;
        this.selectedElements = new Map(); // objectId -> elementData
        this.markupIds = []; // Track created markup IDs
        this.settings = {
            properties: ['name'] // Which properties to display
        };

        this.version = '2.0.0';
        this.init();
    }

    init() {
        this.log(`🚀 Initializing Attribute Markup Tool v${this.version}`);
        this.setupUI();
        this.connectToWorkspace();
    }

    setupUI() {
        // Property checkboxes
        document.querySelectorAll('.property-list input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectedProperties());
        });

        // Action buttons
        document.getElementById('apply-btn').addEventListener('click', () => this.applyLabels());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAllLabels());

        this.log('UI event listeners attached');
    }

    async connectToWorkspace() {
        try {
            this.log('Connecting to Trimble Connect Workspace API...');
            this.api = await TrimbleConnectWorkspace.connect(
                window.parent,
                (event, data) => this.handleEvent(event, data)
            );

            this.log('✓ Connected successfully!');
            this.updateStatus('Connected! Click on elements in the 3D view to select them.', 'success');

        } catch (error) {
            this.log(`ERROR: ${error.message}`);
            this.updateStatus('Connection failed. Make sure to load this in Trimble Connect.', 'warning');
        }
    }

    handleEvent(event, data) {
        const eventData = data && data.data ? data.data : data;

        if (event === 'viewer.onPicked' && eventData && eventData.objectRuntimeId) {
            this.handleElementPicked(eventData);
        }
    }

    async handleElementPicked(pickData) {
        const { objectRuntimeId, modelId } = pickData;

        this.log(`Element picked: Object ${objectRuntimeId}, Model ${modelId}`);

        try {
            // Get object properties
            const properties = await this.api.viewer.getObjectProperties(modelId, [objectRuntimeId]);

            if (properties && properties.length > 0) {
                const elementData = {
                    id: objectRuntimeId,
                    modelId: modelId,
                    properties: properties[0],
                    pickData: pickData
                };

                this.selectedElements.set(objectRuntimeId, elementData);
                this.updateSelectedList();
                this.enableApplyButton();

                this.log(`✓ Properties retrieved for object ${objectRuntimeId}`);
            }

        } catch (error) {
            this.log(`ERROR getting properties: ${error.message}`);
        }
    }

    updateSelectedProperties() {
        const checkboxes = document.querySelectorAll('.property-list input[type="checkbox"]:checked');
        this.settings.properties = Array.from(checkboxes).map(cb => cb.value);
        this.log(`Selected properties: ${this.settings.properties.join(', ')}`);
    }

    updateSelectedList() {
        const listDiv = document.getElementById('selected-list');
        const countSpan = document.getElementById('selected-count');

        countSpan.textContent = this.selectedElements.size;

        if (this.selectedElements.size === 0) {
            listDiv.innerHTML = '<p class="placeholder">Click on elements in the 3D view to select them</p>';
            return;
        }

        listDiv.innerHTML = '';
        this.selectedElements.forEach((data, id) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'selected-item';

            const name = data.properties.product?.name || data.properties.class || 'Unknown';
            const type = data.properties.class || 'N/A';

            itemDiv.innerHTML = `
                <div>
                    <div class="name">${name}</div>
                    <div class="type">${type}</div>
                </div>
                <span class="remove" onclick="markupTool.removeElement(${id})">✕</span>
            `;

            listDiv.appendChild(itemDiv);
        });
    }

    removeElement(objectId) {
        this.selectedElements.delete(objectId);
        this.updateSelectedList();

        if (this.selectedElements.size === 0) {
            this.disableApplyButton();
        }
    }

    async applyLabels() {
        this.log('📝 Creating text markups using Workspace API...');

        // Clear existing markups first
        await this.clearMarkupsOnly();

        const textMarkups = [];

        // Create text markup for each selected element
        for (const [id, data] of this.selectedElements) {
            const markup = await this.createTextMarkup(data);
            if (markup) {
                textMarkups.push(markup);
            }
        }

        if (textMarkups.length === 0) {
            this.updateStatus('No markups created', 'warning');
            return;
        }

        try {
            // Add all text markups to the viewer
            const result = await this.api.markup.addTextMarkup(textMarkups);
            this.markupIds = result.map(m => m.id);

            this.log(`✅ Created ${result.length} text markups in 3D viewer!`);
            this.updateStatus(`${result.length} label(s) displayed in 3D view`, 'success');

        } catch (error) {
            this.log(`❌ Error creating markups: ${error.message}`);
            this.updateStatus('Failed to create markups', 'warning');
        }
    }

    async createTextMarkup(elementData) {
        const { id, modelId, properties, pickData } = elementData;

        // Get element position
        let position = pickData.position;

        try {
            // Try to get bounding box for better positioning (top of object)
            const bboxes = await this.api.viewer.getObjectBoundingBoxes(modelId, [id]);
            if (bboxes && bboxes.length > 0) {
                const bbox = bboxes[0].boundingBox;
                position = {
                    x: (bbox.min.x + bbox.max.x) / 2,
                    y: (bbox.min.y + bbox.max.y) / 2,
                    z: bbox.max.z // Top of the object
                };
            }
        } catch (error) {
            this.log(`Using pick position for object ${id}`);
        }

        // Format label text based on selected properties
        const labelText = this.formatLabelText(properties);

        // Create TextMarkup object
        // TextMarkup extends LineMarkup, so it needs start and end points
        // For a simple label, we'll make start and end very close together
        const textMarkup = {
            start: {
                positionX: position.x * 1000, // Convert m to mm
                positionY: position.y * 1000,
                positionZ: position.z * 1000,
                modelId: modelId,
                objectId: id
            },
            end: {
                positionX: position.x * 1000 + 100, // Small offset for leader line
                positionY: position.y * 1000,
                positionZ: position.z * 1000,
                modelId: modelId,
                objectId: id
            },
            text: labelText,
            color: { r: 102, g: 126, b: 234, a: 1 } // Purple color
        };

        this.log(`Text markup prepared for object ${id}: "${labelText}"`);
        return textMarkup;
    }

    formatLabelText(properties) {
        const lines = [];

        this.settings.properties.forEach(prop => {
            let value = null;

            switch (prop) {
                case 'name':
                    value = properties.product?.name || properties.class || 'Unnamed';
                    if (value) lines.push(value);
                    break;

                case 'class':
                    value = properties.class;
                    if (value) lines.push(`Type: ${value}`);
                    break;

                case 'material':
                    // Look for material in property sets
                    if (properties.properties) {
                        for (const pset of properties.properties) {
                            if (pset.properties?.Material) {
                                lines.push(`Material: ${pset.properties.Material}`);
                                break;
                            }
                        }
                    }
                    break;

                case 'dimensions':
                    // Look for dimensions in property sets
                    if (properties.properties) {
                        for (const pset of properties.properties) {
                            const props = pset.properties || {};
                            const width = props.Width || props.OverallWidth;
                            const height = props.Height || props.OverallHeight;
                            const length = props.Length || props.OverallLength;

                            if (width || height || length) {
                                const dims = [];
                                if (width) dims.push(`W:${this.formatDimension(width)}`);
                                if (height) dims.push(`H:${this.formatDimension(height)}`);
                                if (length) dims.push(`L:${this.formatDimension(length)}`);
                                lines.push(dims.join(' × '));
                                break;
                            }
                        }
                    }
                    break;
            }
        });

        return lines.length > 0 ? lines.join('\\n') : 'No data';
    }

    formatDimension(value) {
        const num = typeof value === 'number' ? value : parseFloat(value);
        if (isNaN(num)) return value;
        return `${num.toFixed(2)}m`;
    }

    async clearMarkupsOnly() {
        if (this.markupIds.length > 0) {
            try {
                await this.api.markup.removeMarkups(this.markupIds);
                this.log(`🗑️ Removed ${this.markupIds.length} markups`);
                this.markupIds = [];
            } catch (error) {
                this.log(`Error removing markups: ${error.message}`);
            }
        }
    }

    async clearAllLabels() {
        await this.clearMarkupsOnly();
        this.selectedElements.clear();
        this.updateSelectedList();
        this.disableApplyButton();
        this.log('All labels and selections cleared');
    }

    enableApplyButton() {
        document.getElementById('apply-btn').disabled = false;
    }

    disableApplyButton() {
        document.getElementById('apply-btn').disabled = true;
    }

    updateStatus(message, type = 'info') {
        const statusDiv = document.getElementById('status');
        statusDiv.className = `status ${type}`;
        statusDiv.textContent = message;
    }

    log(message) {
        console.log(message);
        const logDiv = document.getElementById('log');
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
        logDiv.insertBefore(entry, logDiv.firstChild);
    }
}

// Initialize when DOM is ready
let markupTool;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        markupTool = new AttributeMarkupTool();
    });
} else {
    markupTool = new AttributeMarkupTool();
}
