/**
 * Area Measurement Plugin for Trimble Connect Web 3D Viewer
 * 
 * This plugin enables hover-based surface area measurement.
 * When activated, it detects surfaces under the mouse cursor and displays their area.
 */

import {
    screenToRay,
    raycastModelObjects,
    RaycastHit,
    Vector3
} from './utils/raycaster';
import {
    calculateSurfaceArea,
    extractTrianglesFromFace,
    formatArea
} from './utils/areaCalculator';

/**
 * Main plugin class extending Trimble Connect Plugin base
 * NOTE: Replace with actual SDK base class - e.g., TrimbleConnectPlugin or similar
 */
export class AreaMeasurementPlugin {
    private isActive: boolean = false;
    private viewerCanvas: HTMLCanvasElement | null = null;
    private viewer: any; // Replace with actual Trimble Connect Viewer type
    private viewerAPI: any; // Replace with actual ViewerAPI type
    private currentMarkup: any = null; // SurfaceMarkup instance
    private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
    private debounceTimer: number | null = null;
    private readonly DEBOUNCE_DELAY = 100; // milliseconds

    /**
     * @param viewer - Trimble Connect 3D Viewer instance
     * @param viewerAPI - ViewerAPI for accessing model objects
     */
    constructor(viewer: any, viewerAPI: any) {
        this.viewer = viewer;
        this.viewerAPI = viewerAPI;
    }

    /**
     * Activates the area measurement tool
     * Registers mouse event listeners for hover detection
     */
    public activate(): void {
        if (this.isActive) {
            console.warn('AreaMeasurementPlugin is already active');
            return;
        }

        console.log('AreaMeasurementPlugin: Activating...');
        this.isActive = true;

        // Get viewer canvas element
        // NOTE: Replace with actual SDK method to get canvas
        this.viewerCanvas = this.viewer.getCanvas?.() || document.querySelector('canvas');

        if (!this.viewerCanvas) {
            console.error('Could not find viewer canvas');
            this.isActive = false;
            return;
        }

        // Create and register mouse move handler
        this.mouseMoveHandler = this.onMouseMove.bind(this);
        this.viewerCanvas.addEventListener('mousemove', this.mouseMoveHandler);

        // Change cursor to indicate measurement mode
        this.viewerCanvas.style.cursor = 'crosshair';

        console.log('AreaMeasurementPlugin: Activated');
    }

    /**
     * Deactivates the area measurement tool
     * Removes all event listeners and cleans up resources
     */
    public deactivate(): void {
        if (!this.isActive) {
            return;
        }

        console.log('AreaMeasurementPlugin: Deactivating...');
        this.isActive = false;

        // Remove event listeners
        if (this.viewerCanvas && this.mouseMoveHandler) {
            this.viewerCanvas.removeEventListener('mousemove', this.mouseMoveHandler);
            this.viewerCanvas.style.cursor = 'default';
        }

        // Clear debounce timer
        if (this.debounceTimer !== null) {
            window.clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }

        // Remove current markup
        this.clearCurrentMarkup();

        this.mouseMoveHandler = null;
        this.viewerCanvas = null;

        console.log('AreaMeasurementPlugin: Deactivated');
    }

    /**
     * Mouse move event handler - performs raycasting to detect surfaces
     */
    private onMouseMove(event: MouseEvent): void {
        if (!this.isActive || !this.viewerCanvas) {
            return;
        }

        // Debounce to prevent excessive raycasting
        if (this.debounceTimer !== null) {
            window.clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = window.setTimeout(() => {
            this.performRaycast(event);
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Performs raycasting and measures surface area
     */
    private performRaycast(event: MouseEvent): void {
        if (!this.viewerCanvas) {
            return;
        }

        // Get mouse position relative to canvas
        const rect = this.viewerCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        try {
            // Option 1: Use SDK's built-in raycasting (PREFERRED)
            // If the SDK provides a raycast method, use it:
            // const hit = this.viewerAPI.raycast(mouseX, mouseY);

            // Option 2: Manual raycasting (fallback)
            const camera = this.viewer.getCamera?.();
            if (!camera) {
                console.warn('Could not get camera from viewer');
                return;
            }

            const ray = screenToRay(
                mouseX,
                mouseY,
                this.viewerCanvas.width,
                this.viewerCanvas.height,
                camera
            );

            // Get model objects from ViewerAPI
            const modelObjects = this.viewerAPI.getModelObjects?.() || [];
            const hit = raycastModelObjects(ray, modelObjects);

            if (hit) {
                this.handleSurfaceHit(hit);
            } else {
                this.clearCurrentMarkup();
            }
        } catch (error) {
            console.error('Error during raycasting:', error);
        }
    }

    /**
     * Handles a successful surface hit - calculates and displays area
     */
    private handleSurfaceHit(hit: RaycastHit): void {
        try {
            // Get the face/surface geometry from the hit
            // NOTE: This depends on your SDK's structure
            const face = this.getFaceFromHit(hit);

            if (!face) {
                console.warn('Could not extract face geometry from hit');
                return;
            }

            // Extract triangles from the face
            const triangles = extractTrianglesFromFace(face);

            if (triangles.length === 0) {
                console.warn('No triangles found in face');
                return;
            }

            // Calculate total surface area
            const area = calculateSurfaceArea(triangles);
            const formattedArea = formatArea(area);

            // Create or update surface markup
            this.displayAreaMarkup(hit.position, formattedArea);

            console.log(`Surface area: ${formattedArea}`);
        } catch (error) {
            console.error('Error calculating surface area:', error);
        }
    }

    /**
     * Extracts face geometry from raycast hit
     * NOTE: This is a placeholder - implement based on your SDK
     */
    private getFaceFromHit(hit: RaycastHit): any {
        // This depends entirely on your SDK's structure
        // Example pseudo-code:
        // const object = this.viewerAPI.getObjectById(hit.objectId);
        // const geometry = object.getGeometry();
        // const face = geometry.getFace(hit.faceIndex);
        // return face;

        return null; // Replace with actual implementation
    }

    /**
     * Creates or updates a SurfaceMarkup to display the area measurement
     */
    private displayAreaMarkup(position: Vector3, areaText: string): void {
        // Clear previous markup
        this.clearCurrentMarkup();

        // NOTE: Replace with actual SDK SurfaceMarkup creation
        // Example pseudo-code:
        // this.currentMarkup = new SurfaceMarkup({
        //   position: position,
        //   text: areaText,
        //   style: {
        //     fontSize: 14,
        //     color: '#FFFFFF',
        //     backgroundColor: 'rgba(0, 120, 215, 0.8)',
        //     padding: 8
        //   }
        // });
        // 
        // this.viewer.addMarkup(this.currentMarkup);

        console.log(`Displaying markup at position (${position.x}, ${position.y}, ${position.z}): ${areaText}`);
    }

    /**
     * Removes the current area markup from the viewer
     */
    private clearCurrentMarkup(): void {
        if (this.currentMarkup) {
            // NOTE: Replace with actual SDK markup removal
            // this.viewer.removeMarkup(this.currentMarkup);
            this.currentMarkup = null;
        }
    }

    /**
     * Checks if the plugin is currently active
     */
    public isPluginActive(): boolean {
        return this.isActive;
    }

    /**
     * Toggles the plugin on/off
     */
    public toggle(): void {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }
}
