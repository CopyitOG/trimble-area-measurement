// Trimble Connect Attribute Markup Tool v2.1
// Uses official Workspace API TextMarkup to display property labels
// Now supports selection API for batch/area selection

class AttributeMarkupTool {
    constructor() {
        this.api = null;
        this.markupIds = []; // Track created markup IDs
        this.propertyNames = ['Name', 'Type']; // Default properties

        this.version = '2.1.0';
        this.init();
    }

    init() {
        this.log(`🚀 Initializing Attribute Markup Tool v${this.version}`);
        this.setupUI();
        this.connectToWorkspace();
    }

    setupUI() {
        // Property names textarea
        const textarea = document.getElementById('property-names');
        textarea.addEventListener('change', () => {
            const text = textarea.value.trim();
            this.propertyNames = text.split(',').map(p => p.trim()).filter(p => p);
            this.log(`Properties to extract: ${this.propertyNames.join(', ')}`);
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
            this.updateStatus('✅ Connected! Select elements in 3D view, then click "Create Labels"', 'success');

        } catch (error) {
            this.log(`ERROR: ${error.message}`);
            this.updateStatus('Connection failed. Make sure to load this in Trimble Connect.', 'warning');
        }
    }

    handleEvent(event, data) {
        // Listen for selection changes
        if (event === 'viewer.onSelectionChanged') {
            this.updateSelectionCount();
        }
    }

    async updateSelectionCount() {
        try {
            const selection = await this.api.viewer.getSelection();
            const totalCount = selection.reduce((sum, model) => sum + model.objectRuntimeIds.length, 0);
            document.getElementById('selected-count').textContent = totalCount;

            if (totalCount > 0) {
                this.log(`📌 Selection updated: ${totalCount} element(s) selected`);
            }
        } catch (error) {
            this.log(`Error getting selection: ${error.message}`);
        }
    }

    async applyLabels() {
        try {
            this.log('📝 Getting selected elements from viewer...');

            // Get current selection from viewer
            const selection = await this.api.viewer.getSelection();

            if (!selection || selection.length === 0) {
                this.updateStatus('⚠️ No elements selected. Select elements in the 3D view first.', 'warning');
                this.log('No selection found');
                return;
            }

            // Clear existing markups first
            await this.clearMarkupsOnly();

            const textMarkups = [];

            // Process each model's selected objects
            for (const modelSelection of selection) {
                const modelId = modelSelection.modelId;
                const objectIds = modelSelection.objectRuntimeIds;

                this.log(`Processing ${objectIds.length} objects from model ${modelId}`);

                // Get properties for all selected objects in this model
                const properties = await this.api.viewer.getObjectProperties(modelId, objectIds);

                // Create markup for each object
                for (let i = 0; i < objectIds.length; i++) {
                    const objectId = objectIds[i];
                    const objectProps = properties[i];

                    const markup = await this.createTextMarkup(modelId, objectId, objectProps);
                    if (markup) {
                        textMarkups.push(markup);
                    }
                }
            }

            if (textMarkups.length === 0) {
                this.updateStatus('⚠️ No markups created. Check debug log.', 'warning');
                return;
            }

            // Add all text markups to the viewer
            const result = await this.api.markup.addTextMarkup(textMarkups);
            this.markupIds = result.map(m => m.id);

            document.getElementById('labels-count').textContent = result.length;

            this.log(`✅ Created ${result.length} text markups in 3D viewer!`);
            this.updateStatus(`✅ ${result.length} label(s) displayed in 3D view`, 'success');

        } catch (error) {
            this.log(`❌ Error: ${error.message}`);
            this.updateStatus(`Error: ${error.message}`, 'warning');
        }
    }

    async createTextMarkup(modelId, objectId, properties) {
        try {
            // Get element position from bounding box
            const bboxes = await this.api.viewer.getObjectBoundingBoxes(modelId, [objectId]);

            if (!bboxes || bboxes.length === 0) {
                this.log(`No bounding box for object ${objectId}`);
                return null;
            }

            const bbox = bboxes[0].boundingBox;
            const position = {
                x: (bbox.min.x + bbox.max.x) / 2,
                y: (bbox.min.y + bbox.max.y) / 2,
                z: bbox.max.z // Top of the object
            };

            // Format label text based on properties
            const labelText = this.extractProperties(properties);

            if (!labelText || labelText === 'No data') {
                this.log(`No displayable properties for object ${objectId}`);
                return null;
            }

            // Create TextMarkup object
            const textMarkup = {
                start: {
                    positionX: position.x * 1000, // Convert m to mm
                    positionY: position.y * 1000,
                    positionZ: position.z * 1000,
                    modelId: modelId,
                    objectId: objectId
                },
                end: {
                    positionX: position.x * 1000 + 200, // Leader line offset
                    positionY: position.y * 1000,
                    positionZ: position.z * 1000 + 100,
                    modelId: modelId,
                    objectId: objectId
                },
                text: labelText,
                color: { r: 102, g: 126, b: 234, a: 1 } // Purple color
            };

            this.log(`Markup prepared for object ${objectId}: "${labelText.substring(0, 50)}..."`);
            return textMarkup;

        } catch (error) {
            this.log(`Error creating markup for object ${objectId}: ${error.message}`);
            return null;
        }
    }

    extractProperties(objectProps) {
        const lines = [];

        // Try to extract each requested property
        for (const propName of this.propertyNames) {
            const value = this.findPropertyValue(objectProps, propName);
            if (value !== null && value !== undefined) {
                // Format: "PropertyName: value" or just "value" if it's a single line
                if (this.propertyNames.length === 1) {
                    lines.push(String(value));
                } else {
                    lines.push(`${propName}: ${value}`);
                }
            }
        }

        return lines.length > 0 ? lines.join('\\n') : 'No data';
    }

    findPropertyValue(objectProps, propertyName) {
        const nameLower = propertyName.toLowerCase();

        // Check direct properties first
        if (nameLower === 'name') {
            return objectProps.product?.name || objectProps.class;
        }
        if (nameLower === 'type' || nameLower === 'class') {
            return objectProps.class;
        }

        // Search in property sets
        if (objectProps.properties) {
            for (const pset of objectProps.properties) {
                if (!pset.properties) continue;

                // Try exact match first
                for (const [key, value] of Object.entries(pset.properties)) {
                    if (key.toLowerCase() === nameLower) {
                        return this.formatValue(value);
                    }
                }

                // Try partial match (e.g., "Assembly" matches "AssemblyCode")
                for (const [key, value] of Object.entries(pset.properties)) {
                    if (key.toLowerCase().includes(nameLower) || nameLower.includes(key.toLowerCase())) {
                        return this.formatValue(value);
                    }
                }
            }
        }

        return null;
    }

    formatValue(value) {
        if (typeof value === 'number') {
            return value.toFixed(2);
        }
        return String(value);
    }

    async clearMarkupsOnly() {
        if (this.markupIds.length > 0) {
            try {
                await this.api.markup.removeMarkups(this.markupIds);
                this.log(`🗑️ Removed ${this.markupIds.length} markups`);
                this.markupIds = [];
                document.getElementById('labels-count').textContent = '0';
            } catch (error) {
                this.log(`Error removing markups: ${error.message}`);
            }
        }
    }

    async clearAllLabels() {
        await this.clearMarkupsOnly();
        this.log('All labels cleared');
        this.updateStatus('Labels cleared', 'info');
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
