// Trimble Connect Area Measurement Tool
// Production implementation with hover-based surface detection

class AreaMeasurementTool {
    constructor() {
        this.isActive = false;
        this.toggleBtn = document.getElementById('toggle-btn');
        this.btnText = document.getElementById('btn-text');
        this.statusDiv = document.getElementById('status');
        this.measurementDiv = document.getElementById('measurement');
        this.areaValue = document.getElementById('area-value');

        this.hoverListener = null;
        this.clickListener = null;

        this.init();
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        console.log('[Area Tool] Initialized');
    }

    toggle() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    activate() {
        this.isActive = true;
        this.toggleBtn.classList.add('active');
        this.btnText.textContent = 'Tool Active ✓';
        this.measurementDiv.classList.add('visible');
        this.updateStatus('Hover over surfaces to measure area', 'success');

        console.log('[Area Tool] Activated');

        // Try to integrate with Trimble Connect viewer
        this.connectToViewer();
    }

    deactivate() {
        this.isActive = false;
        this.toggleBtn.classList.remove('active');
        this.btnText.textContent = 'Activate Tool';
        this.measurementDiv.classList.remove('visible');
        this.updateStatus('Tool deactivated', 'info');

        this.disconnectFromViewer();
        console.log('[Area Tool] Deactivated');
    }

    connectToViewer() {
        // Try to access Trimble Connect's viewer through window.parent
        try {
            if (window.parent && window.parent !== window) {
                console.log('[Area Tool] Detected parent window - attempting to connect to viewer');

                // Post message to parent to request viewer access
                window.parent.postMessage({
                    type: 'extension-ready',
                    extensionId: 'area-measurement'
                }, '*');

                // Listen for messages from parent
                this.setupMessageListener();
            } else {
                console.log('[Area Tool] Running standalone - using demo mode');
                this.startDemoMode();
            }
        } catch (error) {
            console.warn('[Area Tool] Could not access parent:', error);
            this.startDemoMode();
        }
    }

    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (!this.isActive) return;

            console.log('[Area Tool] Received message:', event.data);

            if (event.data && event.data.type === 'viewer-hover') {
                this.handleHoverData(event.data);
            } else if (event.data && event.data.type === 'viewer-click') {
                this.handleClickData(event.data);
            }
        });

        console.log('[Area Tool] Message listener setup complete');
    }

    handleHoverData(data) {
        if (data.surface && data.surface.area) {
            this.displayArea(data.surface.area);
        }
    }

    handleClickData(data) {
        console.log('[Area Tool] Surface clicked:', data);

        if (data.surface) {
            // Calculate area from surface geometry if available
            if (data.surface.area) {
                this.displayArea(data.surface.area);
            } else if (data.surface.triangles) {
                const area = this.calculateAreaFromTriangles(data.surface.triangles);
                this.displayArea(area);
            } else {
                this.updateStatus('Could not calculate area for this surface', 'warning');
            }
        }
    }

    calculateAreaFromTriangles(triangles) {
        let totalArea = 0;

        for (const tri of triangles) {
            // Calculate triangle area using cross product
            const v0 = tri.vertices[0];
            const v1 = tri.vertices[1];
            const v2 = tri.vertices[2];

            const edge1 = {
                x: v1.x - v0.x,
                y: v1.y - v0.y,
                z: v1.z - v0.z
            };

            const edge2 = {
                x: v2.x - v0.x,
                y: v2.y - v0.y,
                z: v2.z - v0.z
            };

            const cross = {
                x: edge1.y * edge2.z - edge1.z * edge2.y,
                y: edge1.z * edge2.x - edge1.x * edge2.z,
                z: edge1.x * edge2.y - edge1.y * edge2.x
            };

            const magnitude = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2);
            totalArea += magnitude / 2;
        }

        return totalArea;
    }

    displayArea(area) {
        let formatted;

        if (area < 0.01) {
            formatted = `${(area * 1000000).toFixed(2)} mm²`;
        } else if (area < 1) {
            formatted = `${(area * 10000).toFixed(2)} cm²`;
        } else {
            formatted = `${area.toFixed(2)} m²`;
        }

        this.areaValue.textContent = formatted;
        console.log('[Area Tool] Displayed area:', formatted);
    }

    disconnectFromViewer() {
        // Cleanup listeners
        if (this.hoverListener) {
            window.removeEventListener('message', this.hoverListener);
        }
    }

    startDemoMode() {
        console.log('[Area Tool] Starting demo mode');
        this.updateStatus('Demo mode: Showing sample measurements. Hover/click on model surfaces.', 'warning');

        // Simulate periodic area updates
        const demoInterval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(demoInterval);
                return;
            }

            const randomArea = Math.random() * 50 + 10;
            this.displayArea(randomArea);
        }, 3000);
    }

    updateStatus(message, type = 'info') {
        this.statusDiv.className = `status ${type}`;
        this.statusDiv.textContent = message;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AreaMeasurementTool();
    });
} else {
    new AreaMeasurementTool();
}
