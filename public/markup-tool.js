// Trimble Connect Attribute Markup Tool
// Displays customizable property labels on selected 3D elements

class AttributeMarkupTool {
    constructor() {
        this.api = null;
        this.selectedElements = new Map(); // objectId -> elementData
        this.labels = new Map(); // objectId -> labelElement
        this.settings = {
            fontSize: 16,
            bgColor: '#667eea',
            textColor: '#ffffff',
            properties: ['name'] // Which properties to display
        };

        this.init();
    }

    init() {
        this.log('Initializing Attribute Markup Tool');
        this.setupUI();
        this.connectToWorkspace();
    }

    setupUI() {
        // Property checkboxes
        document.querySelectorAll('.property-list input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectedProperties());
        });

        // Font size slider
        const fontSizeInput = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        fontSizeInput.addEventListener('input', (e) => {
            this.settings.fontSize = parseInt(e.target.value);
            fontSizeValue.textContent = `${this.settings.fontSize}px`;
        });

        // Color inputs
        document.getElementById('bg-color').addEventListener('change', (e) => {
            this.settings.bgColor = e.target.value;
        });
        document.getElementById('text-color').addEventListener('change', (e) => {
            this.settings.textColor = e.target.value;
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
        this.log(`Event: ${event}`);

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
        this.log('Applying labels to selected elements...');

        // Clear existing labels first
        this.clearLabelsOnly();

        // Create labels for each selected element
        for (const [id, data] of this.selectedElements) {
            await this.createLabelForElement(data);
        }

        // Start updating label positions
        this.startCameraTracking();

        this.updateStatus(`Labels applied to ${this.selectedElements.size} element(s)`, 'success');
        this.log(`✓ Created ${this.labels.size} labels`);
    }

    async createLabelForElement(elementData) {
        const { id, modelId, properties, pickData } = elementData;

        // Get element position (use pick position or bounding box center)
        let position = pickData.position;

        try {
            // Try to get bounding box for better positioning
            const bboxes = await this.api.viewer.getObjectBoundingBoxes(modelId, [id]);
            if (bboxes && bboxes.length > 0) {
                const bbox = bboxes[0].boundingBox;
                // Use top-center of bounding box
                position = {
                    x: (bbox.min.x + bbox.max.x) / 2,
                    y: (bbox.min.y + bbox.max.y) / 2,
                    z: bbox.max.z // Top of the object
                };
            }
        } catch (error) {
            this.log(`Using pick position for object ${id}`);
        }

        // Format label content based on selected properties
        const labelText = this.formatLabelText(properties);

        // Create label HTML element
        const label = this.createLabelElement(labelText);

        // Store label data
        this.labels.set(id, {
            element: label,
            position: position,
            elementData: elementData
        });

        this.log(`Label created for object ${id}`);
    }

    formatLabelText(properties) {
        const lines = [];

        this.settings.properties.forEach(prop => {
            let value = null;

            switch (prop) {
                case 'name':
                    value = properties.product?.name || properties.class || 'Unnamed';
                    if (value) lines.push(`📌 ${value}`);
                    break;

                case 'class':
                    value = properties.class;
                    if (value) lines.push(`🏗️ ${value}`);
                    break;

                case 'material':
                    // Look for material in property sets
                    if (properties.properties) {
                        for (const pset of properties.properties) {
                            if (pset.properties?.Material) {
                                lines.push(`🎨 Material: ${pset.properties.Material}`);
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
                                lines.push(`📏 ${dims.join(' × ')}`);
                                break;
                            }
                        }
                    }
                    break;
            }
        });

        return lines.length > 0 ? lines.join('\n') : 'No data';
    }

    formatDimension(value) {
        // Convert to number and format
        const num = typeof value === 'number' ? value : parseFloat(value);
        if (isNaN(num)) return value;

        // Assume meters, format to 2 decimal places
        return `${num.toFixed(2)}m`;
    }

    createLabelElement(text) {
        const label = document.createElement('div');
        label.className = 'label-3d';
        label.textContent = text;
        label.style.fontSize = `${this.settings.fontSize}px`;
        label.style.backgroundColor = this.settings.bgColor;
        label.style.color = this.settings.textColor;

        document.body.appendChild(label);

        return label;
    }

    startCameraTracking() {
        if (this.cameraUpdateInterval) {
            clearInterval(this.cameraUpdateInterval);
        }

        // Update label positions every 50ms
        this.cameraUpdateInterval = setInterval(() => {
            this.updateLabelPositions();
        }, 50);

        this.log('Camera tracking started');
    }

    async updateLabelPositions() {
        if (!this.api || this.labels.size === 0) return;

        try {
            // Get current camera state
            const camera = await this.api.viewer.getCamera();

            this.labels.forEach((labelData, id) => {
                const screenPos = this.worldToScreen(labelData.position, camera);

                if (screenPos && screenPos.visible) {
                    labelData.element.style.left = `${screenPos.x}px`;
                    labelData.element.style.top = `${screenPos.y}px`;
                    labelData.element.style.display = 'block';
                } else {
                    // Hide if behind camera or out of view
                    labelData.element.style.display = 'none';
                }
            });
        } catch (error) {
            // Silently fail - camera might not be ready yet
        }
    }

    worldToScreen(worldPos, camera) {
        // This is a simplified projection - in production you'd use proper matrix math
        // For now, use a basic perspective projection

        // Get viewer dimensions (approximate)
        const viewerWidth = window.parent.innerWidth || 1920;
        const viewerHeight = window.parent.innerHeight || 1080;

        // Simple perspective projection
        // This is placeholder - the actual implementation depends on camera parameters
        const screenX = viewerWidth / 2 + worldPos.x * 10;
        const screenY = viewerHeight / 2 - worldPos.y * 10;

        return {
            x: screenX,
            y: screenY,
            visible: true // For now, always show
        };
    }

    clearLabelsOnly() {
        // Remove label HTML elements but keep selected elements
        this.labels.forEach((labelData) => {
            if (labelData.element && labelData.element.parentNode) {
                labelData.element.parentNode.removeChild(labelData.element);
            }
        });
        this.labels.clear();

        if (this.cameraUpdateInterval) {
            clearInterval(this.cameraUpdateInterval);
            this.cameraUpdateInterval = null;
        }
    }

    clearAllLabels() {
        this.clearLabelsOnly();
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
