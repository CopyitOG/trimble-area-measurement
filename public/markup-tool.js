// Trimble Connect Attribute Markup Tool v2.1
// Uses official Workspace API TextMarkup to display property labels
// Now supports selection API for batch/area selection

class AttributeMarkupTool {
    constructor() {
        this.api = null;
        this.markupIds = []; // Track created text markup IDs
        this.pointMarkupIds = []; // Track created point markup IDs
        this.lineMarkupIds = []; // Track created line markup IDs
        this.measurementMarkupIds = []; // Track created measurement markup IDs
        this.propertyNames = ['Name', 'Type']; // Default properties

        // IFC Schema-Aware Core Attribute Mappings
        // These map to IfcRoot schema attributes (indices 3, 4, 5, 8 in IFC EXPRESS)
        this.ifcCoreAttributes = {
            // Index 3: GlobalId
            'globalid': ['GlobalId', 'GUID', 'G-UID (IFC)', 'GlobalID', 'Guid'],
            'guid': ['GlobalId', 'GUID', 'G-UID (IFC)', 'GlobalID', 'Guid'],

            // Index 4: OwnerHistory (skip - complex object)

            // Index 5: Name
            'name': ['Name', 'ifcName', 'Product Name', 'Element Name', 'ObjectName'],

            // Index 6: Description  
            'description': ['Description', 'ifcDescription', 'Product Description', 'ObjectDescription'],

            // Index 7: ObjectType (for typed objects)
            'objecttype': ['ObjectType', 'ifcObjectType', 'Type', 'ElementType'],

            // Index 8: Tag (common for identification)
            'tag': ['Tag', 'ifcTag', 'Mark', 'Reference', 'Identifier']
        };

        // Extended property aliases for common Trimble Connect UI names
        this.propertyAliases = {
            'product description': ['Description', 'Name', 'ifcDescription', 'ObjectType'],
            'file name': ['FileName', 'File', 'OriginalFileName'],
            'load bearing': ['LoadBearing', 'IsLoadBearing', 'Structural'],
            'element name': ['Name', 'ifcName', 'Product Name'],
            'element type': ['ObjectType', 'Type', 'PredefinedType', 'ifcObjectType']
        };
        this.version = '2.1.3';
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

        // Bounding box buttons
        document.getElementById('z-max-btn').addEventListener('click', () => this.markZMax());
        document.getElementById('z-min-btn').addEventListener('click', () => this.markZMin());
        document.getElementById('dimensions-btn').addEventListener('click', () => this.showDimensions());
        document.getElementById('box-btn').addEventListener('click', () => this.showBoundingBox());

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

        // DEBUG: Log all available properties for this object
        this.logAvailableProperties(objectProps);

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

    logAvailableProperties(objectProps) {
        // Log once per object to avoid spam
        if (this.debuggedObject === objectProps.id) return;
        this.debuggedObject = objectProps.id;

        this.log(`🔍 Properties available for object ${objectProps.id}:`);
        this.log(`  - class: ${objectProps.class}`);
        this.log(`  - product.name: ${objectProps.product?.name}`);

        if (objectProps.properties) {
            objectProps.properties.forEach((pset, idx) => {
                this.log(`  📦 PropertySet[${idx}]: "${pset.name}"`);
                if (pset.properties) {
                    // Handle both object and array property structures
                    const props = this.normalizeProperties(pset.properties);
                    Object.entries(props).forEach(([key, value]) => {
                        this.log(`      - "${key}" = "${value}"`);
                    });
                }
            });
        } else {
            this.log(`  ⚠️ No property sets found`);
        }
    }

    normalizeProperties(properties) {
        // Properties might be an object or an array of property objects
        if (Array.isArray(properties)) {
            // Array format: [{ name: "PropName", value: "PropValue" }, ...]
            const normalized = {};
            properties.forEach(prop => {
                if (prop && typeof prop === 'object') {
                    // Try multiple possible name fields
                    const name = prop.name || prop.Name || prop.key || prop.Key || prop.propertyName;
                    // Try multiple possible value fields
                    const value = prop.value !== undefined ? prop.value :
                        prop.Value !== undefined ? prop.Value :
                            prop.val !== undefined ? prop.val :
                                prop.nominalValue !== undefined ? prop.nominalValue :
                                    prop.NominalValue !== undefined ? prop.NominalValue : null;

                    if (name && value !== null && value !== undefined) {
                        normalized[name] = value;
                    }
                }
            });
            return normalized;
        } else if (typeof properties === 'object') {
            // Object format: might have nested objects
            const normalized = {};
            for (const [key, val] of Object.entries(properties)) {
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    // Nested object, try to extract value from common property structures
                    let value = val.value || val.Value || val.val ||
                        val.nominalValue || val.NominalValue;

                    // If still no value, try to stringify the object intelligently
                    if (value === undefined || value === null) {
                        // Check if it has a type and value field (common IFC structure)
                        if (val.type && val.value !== undefined) {
                            value = val.value;
                        } else {
                            // Last resort: JSON stringify
                            value = JSON.stringify(val);
                        }
                    }

                    normalized[key] = value;
                } else {
                    normalized[key] = val;
                }
            }
            return normalized;
        }
        return properties;
    }

    findPropertyValue(objectProps, propertyName) {
        const nameLower = propertyName.toLowerCase();
        const nameNoSpaces = propertyName.replace(/\s+/g, '').toLowerCase();

        // STEP 1: Check if this is a core IFC attribute (schema-aware)
        if (this.ifcCoreAttributes[nameLower] || this.ifcCoreAttributes[nameNoSpaces]) {
            const coreAttrResult = this.findCoreIfcAttribute(objectProps, propertyName);
            if (coreAttrResult !== null) {
                return coreAttrResult;
            }
        }

        // STEP 2: Check Product object for direct attributes
        const productResult = this.findInProductObject(objectProps, propertyName);
        if (productResult !== null) {
            return productResult;
        }

        // STEP 3: Build search list with aliases
        const searchNames = [propertyName];
        if (this.propertyAliases && this.propertyAliases[nameLower]) {
            searchNames.push(...this.propertyAliases[nameLower]);
            this.log(`🔄 Using aliases for "${propertyName}": ${this.propertyAliases[nameLower].join(', ')}`);
        }

        // Search for each possible name (original + aliases)
        for (const searchName of searchNames) {
            const result = this.searchInPropertySets(objectProps, searchName);
            if (result !== null) {
                return result;
            }
        }

        this.log(`✗ Property "${propertyName}" not found in any property set`);
        return null;
    }

    /**
     * Find core IFC attributes (Name, Description, Tag, ObjectType)
     * These are from IfcRoot schema and may be stored differently
     */
    findCoreIfcAttribute(objectProps, propertyName) {
        const nameLower = propertyName.toLowerCase();
        const nameNoSpaces = propertyName.replace(/\s+/g, '').toLowerCase();

        // Get all possible attribute names
        const attributeVariations = this.ifcCoreAttributes[nameLower] || this.ifcCoreAttributes[nameNoSpaces] || [];

        this.log(`🏛️ Checking core IFC attributes for "${propertyName}": ${attributeVariations.join(', ')}`);

        // Check in Product object first
        if (objectProps.product) {
            for (const attrName of attributeVariations) {
                const attrLower = attrName.toLowerCase();
                const value = objectProps.product[attrName] || objectProps.product[attrLower];
                if (value) {
                    this.log(`✓ Found in Product object: "${attrName}" = "${value}"`);
                    return this.formatValue(value);
                }
            }
        }

        // Check in properties with null/empty pset (core IFC attributes often have no pset)
        if (objectProps.properties) {
            for (const pset of objectProps.properties) {
                if (!pset.name || pset.name === '' || pset.name === 'Product' || pset.name === 'System') {
                    const props = this.normalizeProperties(pset.properties);

                    for (const attrName of attributeVariations) {
                        const value = props[attrName];
                        if (value) {
                            this.log(`✓ Found core attribute in "${pset.name || 'null pset'}": "${attrName}" = "${value}"`);
                            return this.formatValue(value);
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Search in the Product object for direct properties
     */
    findInProductObject(objectProps, propertyName) {
        if (!objectProps.product) return null;

        const nameLower = propertyName.toLowerCase();
        const product = objectProps.product;

        // Try direct property access
        const directValue = product[propertyName] || product[nameLower];
        if (directValue) {
            this.log(`✓ Found in Product.${propertyName}: "${directValue}"`);
            return this.formatValue(directValue);
        }

        // Try common product properties
        const productProps = {
            'name': product.name,
            'description': product.description,
            'objecttype': product.objectType || product.ObjectType,
            'type': product.type || product.Type
        };

        if (productProps[nameLower]) {
            this.log(`✓ Found in Product.${nameLower}: "${productProps[nameLower]}"`);
            return this.formatValue(productProps[nameLower]);
        }

        return null;
    }

    searchInPropertySets(objectProps, propertyName) {
        const nameLower = propertyName.toLowerCase();
        const nameNoSpaces = propertyName.replace(/\s+/g, '').toLowerCase();

        // Search in ALL property sets
        if (objectProps.properties) {
            for (const pset of objectProps.properties) {
                if (!pset.properties) continue;

                // Normalize the properties structure
                const props = this.normalizeProperties(pset.properties);

                // Try exact match first (case-insensitive)
                for (const [key, value] of Object.entries(props)) {
                    if (key.toLowerCase() === nameLower) {
                        this.log(`✓ Found exact match in "${pset.name}": "${key}" = "${value}"`);
                        return this.formatValue(value);
                    }
                }

                // Try exact match without spaces
                for (const [key, value] of Object.entries(props)) {
                    const keyNoSpaces = key.replace(/\s+/g, '').toLowerCase();
                    if (keyNoSpaces === nameNoSpaces) {
                        this.log(`✓ Found exact match (ignoring spaces) in "${pset.name}": "${key}" = "${value}"`);
                        return this.formatValue(value);
                    }
                }

                // Try partial match - ONLY if property name contains search term
                // (not if search term contains property name - that was the bug!)
                for (const [key, value] of Object.entries(props)) {
                    const keyLower = key.toLowerCase();
                    const keyNoSpaces = key.replace(/\s+/g, '').toLowerCase();

                    // Property name must contain the search term
                    if (keyLower.includes(nameLower) || keyNoSpaces.includes(nameNoSpaces)) {
                        this.log(`✓ Found partial match in "${pset.name}": "${key}" = "${value}"`);
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
                this.log(`🗑️ Removed ${this.markupIds.length} text markups`);
                this.markupIds = [];
                document.getElementById('labels-count').textContent = '0';
            } catch (error) {
                this.log(`Error removing text markups: ${error.message}`);
            }
        }

        // Also clear point markups
        if (this.pointMarkupIds.length > 0) {
            try {
                await this.api.markup.removeMarkups(this.pointMarkupIds);
                this.log(`🗑️ Removed ${this.pointMarkupIds.length} point markups`);
                this.pointMarkupIds = [];
            } catch (error) {
                this.log(`Error removing point markups: ${error.message}`);
            }
        }

        // Clear line markups (bounding boxes)
        if (this.lineMarkupIds.length > 0) {
            try {
                await this.api.markup.removeMarkups(this.lineMarkupIds);
                this.log(`🗑️ Removed ${this.lineMarkupIds.length} line markups`);
                this.lineMarkupIds = [];
            } catch (error) {
                this.log(`Error removing line markups: ${error.message}`);
            }
        }

        // Clear measurement markups (dimensions)
        if (this.measurementMarkupIds.length > 0) {
            try {
                await this.api.markup.removeMarkups(this.measurementMarkupIds);
                this.log(`🗑️ Removed ${this.measurementMarkupIds.length} dimension markups`);
                this.measurementMarkupIds = [];
            } catch (error) {
                this.log(`Error removing dimension markups: ${error.message}`);
            }
        }
    }

    async clearAllLabels() {
        await this.clearMarkupsOnly();
        this.log('All markups cleared');
        this.updateStatus('All markups cleared', 'info');
    }

    async markZMax() {
        try {
            this.log('📍 Creating top point mark...');
            const selection = await this.api.viewer.getSelection();

            if (!selection || selection.length === 0) {
                this.updateStatus('⚠️ No elements selected', 'warning');
                return;
            }

            const pointMarkups = [];

            for (const modelSelection of selection) {
                const modelId = modelSelection.modelId;
                const objectIds = modelSelection.objectRuntimeIds;

                const bboxes = await this.api.viewer.getObjectBoundingBoxes(modelId, objectIds);

                for (const bboxData of bboxes) {
                    const bbox = bboxData.boundingBox;
                    // Top point = highest Z coordinate
                    const topPoint = {
                        positionX: (bbox.min.x + bbox.max.x) / 2 * 1000, // Convert to mm
                        positionY: (bbox.min.y + bbox.max.y) / 2 * 1000,
                        positionZ: bbox.max.z * 1000, // Highest Z
                        modelId: modelId,
                        objectId: bboxData.objectRuntimeId
                    };

                    pointMarkups.push({ start: topPoint });
                }
            }

            const result = await this.api.markup.addSinglePointMarkups(pointMarkups);
            this.pointMarkupIds.push(...result.map(m => m.id));

            this.log(`✅ Created ${result.length} top point mark(s)`);
            this.updateStatus(`✅ ${result.length} top mark(s) created`, 'success');

        } catch (error) {
            this.log(`❌ Error creating top mark: ${error.message}`);
            this.updateStatus(`Error: ${error.message}`, 'warning');
        }
    }

    async markZMin() {
        try {
            this.log('📍 Creating bottom point mark...');
            const selection = await this.api.viewer.getSelection();

            if (!selection || selection.length === 0) {
                this.updateStatus('⚠️ No elements selected', 'warning');
                return;
            }

            const pointMarkups = [];

            for (const modelSelection of selection) {
                const modelId = modelSelection.modelId;
                const objectIds = modelSelection.objectRuntimeIds;

                const bboxes = await this.api.viewer.getObjectBoundingBoxes(modelId, objectIds);

                for (const bboxData of bboxes) {
                    const bbox = bboxData.boundingBox;
                    // Bottom point = lowest Z coordinate
                    const bottomPoint = {
                        positionX: (bbox.min.x + bbox.max.x) / 2 * 1000, // Convert to mm
                        positionY: (bbox.min.y + bbox.max.y) / 2 * 1000,
                        positionZ: bbox.min.z * 1000, // Lowest Z
                        modelId: modelId,
                        objectId: bboxData.objectRuntimeId
                    };

                    pointMarkups.push({ start: bottomPoint });
                }
            }

            const result = await this.api.markup.addSinglePointMarkups(pointMarkups);
            this.pointMarkupIds.push(...result.map(m => m.id));

            this.log(`✅ Created ${result.length} bottom point mark(s)`);
            this.updateStatus(`✅ ${result.length} bottom mark(s) created`, 'success');

        } catch (error) {
            this.log(`❌ Error creating bottom mark: ${error.message}`);
            this.updateStatus(`Error: ${error.message}`, 'warning');
        }
    }

    async showDimensions() {
        try {
            this.log('📏 Creating bounding box dimensions...');
            const selection = await this.api.viewer.getSelection();

            if (!selection || selection.length === 0) {
                this.updateStatus('⚠️ No elements selected', 'warning');
                return;
            }

            const measurements = [];

            for (const modelSelection of selection) {
                const modelId = modelSelection.modelId;
                const objectIds = modelSelection.objectRuntimeIds;

                const bboxes = await this.api.viewer.getObjectBoundingBoxes(modelId, objectIds);

                for (const bboxData of bboxes) {
                    const bbox = bboxData.boundingBox;
                    const objectId = bboxData.objectRuntimeId;

                    // Calculate center points for dimension lines
                    const centerX = (bbox.min.x + bbox.max.x) / 2 * 1000;
                    const centerY = (bbox.min.y + bbox.max.y) / 2 * 1000;
                    const centerZ = (bbox.min.z + bbox.max.z) / 2 * 1000;

                    // Dimension 1: Length (X-axis) - along bottom front edge
                    measurements.push({
                        start: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        end: {
                            positionX: bbox.max.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        mainLineStart: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        mainLineEnd: {
                            positionX: bbox.max.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        color: { r: 0, g: 99, b: 163, a: 1 } // Trimble blue
                    });

                    // Dimension 2: Width (Y-axis) - along bottom left edge
                    measurements.push({
                        start: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        end: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.max.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        mainLineStart: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        mainLineEnd: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.max.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        color: { r: 0, g: 99, b: 163, a: 1 } // Trimble blue
                    });

                    // Dimension 3: Height (Z-axis) - along front left edge
                    measurements.push({
                        start: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        end: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.max.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        mainLineStart: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.min.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        mainLineEnd: {
                            positionX: bbox.min.x * 1000,
                            positionY: bbox.min.y * 1000,
                            positionZ: bbox.max.z * 1000,
                            modelId: modelId,
                            objectId: objectId
                        },
                        color: { r: 0, g: 99, b: 163, a: 1 } // Trimble blue
                    });
                }
            }

            const result = await this.api.markup.addMeasurementMarkups(measurements);
            this.measurementMarkupIds.push(...result.map(m => m.id));

            const elementsCount = measurements.length / 3;
            this.log(`✅ Created 3 dimension measurements for ${elementsCount} element(s)`);
            this.updateStatus(`✅ Dimensions displayed for ${elementsCount} element(s)`, 'success');

        } catch (error) {
            this.log(`❌ Error creating dimensions: ${error.message}`);
            this.updateStatus(`Error: ${error.message}`, 'warning');
        }
    }

    async showBoundingBox() {
        try {
            this.log('📦 Creating bounding box wireframe...');
            const selection = await this.api.viewer.getSelection();

            if (!selection || selection.length === 0) {
                this.updateStatus('⚠️ No elements selected', 'warning');
                return;
            }

            const lineMarkups = [];

            for (const modelSelection of selection) {
                const modelId = modelSelection.modelId;
                const objectIds = modelSelection.objectRuntimeIds;

                const bboxes = await this.api.viewer.getObjectBoundingBoxes(modelId, objectIds);

                for (const bboxData of bboxes) {
                    const bbox = bboxData.boundingBox;
                    const objectId = bboxData.objectRuntimeId;

                    // Define 8 vertices of the bounding box (in mm)
                    const vertices = [
                        { x: bbox.min.x * 1000, y: bbox.min.y * 1000, z: bbox.min.z * 1000 }, // 0: bottom-front-left
                        { x: bbox.max.x * 1000, y: bbox.min.y * 1000, z: bbox.min.z * 1000 }, // 1: bottom-front-right
                        { x: bbox.max.x * 1000, y: bbox.max.y * 1000, z: bbox.min.z * 1000 }, // 2: bottom-back-right
                        { x: bbox.min.x * 1000, y: bbox.max.y * 1000, z: bbox.min.z * 1000 }, // 3: bottom-back-left
                        { x: bbox.min.x * 1000, y: bbox.min.y * 1000, z: bbox.max.z * 1000 }, // 4: top-front-left
                        { x: bbox.max.x * 1000, y: bbox.min.y * 1000, z: bbox.max.z * 1000 }, // 5: top-front-right
                        { x: bbox.max.x * 1000, y: bbox.max.y * 1000, z: bbox.max.z * 1000 }, // 6: top-back-right
                        { x: bbox.min.x * 1000, y: bbox.max.y * 1000, z: bbox.max.z * 1000 }, // 7: top-back-left
                    ];

                    // Define 12 edges of the bounding box
                    const edges = [
                        // Bottom face (4 edges)
                        [0, 1], [1, 2], [2, 3], [3, 0],
                        // Top face (4 edges)
                        [4, 5], [5, 6], [6, 7], [7, 4],
                        // Vertical edges (4 edges)
                        [0, 4], [1, 5], [2, 6], [3, 7]
                    ];

                    // Create line markup for each edge
                    for (const [startIdx, endIdx] of edges) {
                        const start = vertices[startIdx];
                        const end = vertices[endIdx];

                        lineMarkups.push({
                            start: {
                                positionX: start.x,
                                positionY: start.y,
                                positionZ: start.z,
                                modelId: modelId,
                                objectId: objectId
                            },
                            end: {
                                positionX: end.x,
                                positionY: end.y,
                                positionZ: end.z,
                                modelId: modelId,
                                objectId: objectId
                            },
                            color: { r: 0, g: 99, b: 163, a: 1 } // Trimble blue
                        });
                    }
                }
            }

            const result = await this.api.markup.addLineMarkups(lineMarkups);
            this.lineMarkupIds.push(...result.map(m => m.id));

            const boxCount = lineMarkups.length / 12;
            this.log(`✅ Created ${boxCount} bounding box(es) with ${lineMarkups.length} lines`);
            this.updateStatus(`✅ ${boxCount} bounding box(es) displayed`, 'success');

        } catch (error) {
            this.log(`❌ Error creating bounding box: ${error.message}`);
            this.updateStatus(`Error: ${error.message}`, 'warning');
        }
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
