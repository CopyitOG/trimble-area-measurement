/**
 * Web3D Markup API Type Definitions
 * Extracted from https://web3d.trimble.com/docs/
 * 
 * NOTE: This is NOT available in the Workspace API for Trimble Connect Extensions.
 * This is part of the lower-level Web3D graphics library.
 */

import { Vector3, Color, SnapPick, Plane } from './core';

/**
 * Interface representing the calculated area of a surface/face
 * Contains the raw calculation data for a face area measurement
 */
export interface FaceAreaCalculation {
    /** The calculated area value (in square meters) */
    calculatedArea: number;

    /** The face ID in the model */
    faceId: number;

    /** The entity/object ID */
    entityId: number;

    /** Optional geometry index */
    geometryIndex?: number;

    /** The model ID */
    modelId: string;

    /** The plane definition of the surface */
    plane: Plane;

    /** The boundary points of the calculated area */
    boundary: Vector3[];

    /** Triangle indices for the mesh */
    triangles: number[];

    /** Optional mesh ID */
    meshId?: string;
}

/**
 * Surface Markup - represents a marked surface area in the 3D viewer
 * Provides visual representation of calculated surface area
 */
export declare class SurfaceMarkup {
    /** The calculated area data for this surface */
    faceAreaCalculation: FaceAreaCalculation;

    /** Bounding box of the markup */
    boundingBox: any;

    /** Subject for bounding box updates */
    boundingBoxSubject: any;

    /** Whether the markup is currently being edited */
    isEditing: boolean;

    /** Optional completion callback */
    onComplete?: () => void;

    /** Origin point of the markup */
    origin: Vector3;

    /** The pick data that created this markup */
    pick: SnapPick;

    /** Plane angle tolerance for face selection */
    planeAngleTolerance: number;

    /** Whether this markup is currently selected */
    selected: boolean;

    /** The color of the markup */
    color: Color;

    /**
     * Get the area as a formatted string
     * @returns Formatted area string (e.g. "25.5 m²")
     */
    getAreaString(): string;

    /**
     * Hide labels for this markup
     */
    hideLabels(): void;

    /**
     * Select this markup
     */
    select(): void;

    /**
     * Deselect this markup
     */
    deselect(): void;

    /**
     * Dispose/remove this markup
     */
    dispose(): void;

    /**
     * Initialize the markup
     */
    init(): void;

    /**
     * Insert the markup into the scene
     */
    insert(): void;
}

/**
 * Surface Markup Tool - interactive tool for creating surface area measurements
 * Allows users to click on surfaces to calculate and display their area
 */
export declare class SurfaceMarkupTool {
    /** The name of this tool */
    static readonly Name: string;

    /** Instance name */
    name: string;

    /** Whether to create markups as text markups */
    createAsTextMarkup: boolean;

    /** Allowed snap types for this tool */
    allowedSnapTypes: string[];

    /** Whether the tool is enabled */
    enabled: boolean;

    /** Current snap types */
    snapTypes: string[];

    /**
     * Add a surface markup at the picked location
     * @param pick The snap pick data from the viewer
     * @param color Optional color for the markup
     * @param origin Optional origin point
     * @returns Promise resolving to the created SurfaceMarkup
     */
    add(pick: SnapPick, color?: Color, origin?: any): Promise<SurfaceMarkup>;

    /**
     * Cancel the current markup operation
     */
    cancel(): void;

    /**
     * Get the total calculated area from all surface markups
     * @returns Total area in square meters
     */
    getTotalArea(): number;
}
