/**
 * Area calculation utilities for surface measurement
 */

import { Vector3 } from './raycaster';

export interface Triangle {
    v0: Vector3;
    v1: Vector3;
    v2: Vector3;
}

/**
 * Calculates the area of a single triangle using the cross product method
 * @param triangle - Triangle with three vertices
 * @returns Area in square units (same units as input coordinates)
 */
export function calculateTriangleArea(triangle: Triangle): number {
    const { v0, v1, v2 } = triangle;

    // Calculate edge vectors
    const edge1: Vector3 = {
        x: v1.x - v0.x,
        y: v1.y - v0.y,
        z: v1.z - v0.z
    };

    const edge2: Vector3 = {
        x: v2.x - v0.x,
        y: v2.y - v0.y,
        z: v2.z - v0.z
    };

    // Cross product gives a vector with magnitude = 2 * triangle area
    const cross: Vector3 = {
        x: edge1.y * edge2.z - edge1.z * edge2.y,
        y: edge1.z * edge2.x - edge1.x * edge2.z,
        z: edge1.x * edge2.y - edge1.y * edge2.x
    };

    // Magnitude of cross product
    const magnitude = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2);

    // Area is half the magnitude
    return magnitude / 2;
}

/**
 * Calculates the total area of a surface composed of multiple triangles
 * @param triangles - Array of triangles forming the surface
 * @returns Total surface area
 */
export function calculateSurfaceArea(triangles: Triangle[]): number {
    let totalArea = 0;

    for (const triangle of triangles) {
        // Validate triangle (check for degenerate triangles)
        if (isValidTriangle(triangle)) {
            totalArea += calculateTriangleArea(triangle);
        }
    }

    return totalArea;
}

/**
 * Validates that a triangle is not degenerate (has non-zero area)
 * @param triangle - Triangle to validate
 * @returns True if triangle is valid
 */
function isValidTriangle(triangle: Triangle): boolean {
    const { v0, v1, v2 } = triangle;

    // Check if all vertices are unique
    const EPSILON = 0.0001;

    const d01 = distance(v0, v1);
    const d12 = distance(v1, v2);
    const d20 = distance(v2, v0);

    // All edges must have length > epsilon
    return d01 > EPSILON && d12 > EPSILON && d20 > EPSILON;
}

/**
 * Calculates distance between two points
 */
function distance(a: Vector3, b: Vector3): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dz = b.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Converts area from one unit to another
 * @param area - Area value
 * @param fromUnit - Source unit (e.g., 'mm', 'cm', 'm', 'in', 'ft')
 * @param toUnit - Target unit
 * @returns Converted area
 */
export function convertAreaUnits(
    area: number,
    fromUnit: string,
    toUnit: string
): number {
    // Conversion factors to square meters
    const toSquareMeters: { [key: string]: number } = {
        'mm': 0.000001,
        'cm': 0.0001,
        'm': 1,
        'in': 0.00064516,
        'ft': 0.09290304
    };

    if (!toSquareMeters[fromUnit] || !toSquareMeters[toUnit]) {
        console.warn(`Unknown unit: ${fromUnit} or ${toUnit}. Returning original value.`);
        return area;
    }

    // Convert to square meters, then to target unit
    const areaInSquareMeters = area * toSquareMeters[fromUnit];
    return areaInSquareMeters / toSquareMeters[toUnit];
}

/**
 * Formats area value with appropriate unit suffix
 * @param area - Area in square meters
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "15.43 m²"
 */
export function formatArea(area: number, decimals: number = 2): string {
    // Choose appropriate unit based on magnitude
    if (area < 0.01) {
        // Use mm² for very small areas
        const areaMm2 = convertAreaUnits(area, 'm', 'mm');
        return `${areaMm2.toFixed(decimals)} mm²`;
    } else if (area < 1) {
        // Use cm² for small areas
        const areaCm2 = convertAreaUnits(area, 'm', 'cm');
        return `${areaCm2.toFixed(decimals)} cm²`;
    } else {
        // Use m² for normal areas
        return `${area.toFixed(decimals)} m²`;
    }
}

/**
 * Extracts triangles from a face/surface mesh
 * NOTE: This is a placeholder. Actual implementation depends on SDK's mesh structure.
 * 
 * @param face - Face object from detected surface
 * @returns Array of triangles
 */
export function extractTrianglesFromFace(face: any): Triangle[] {
    const triangles: Triangle[] = [];

    // This is pseudo-code - replace with actual SDK mesh access
    // Example structure might be:
    // const vertices = face.getVertices();
    // const indices = face.getIndices();
    // 
    // for (let i = 0; i < indices.length; i += 3) {
    //   triangles.push({
    //     v0: vertices[indices[i]],
    //     v1: vertices[indices[i + 1]],
    //     v2: vertices[indices[i + 2]]
    //   });
    // }

    return triangles;
}
