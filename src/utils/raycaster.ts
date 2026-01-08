/**
 * Raycaster utility for detecting surfaces under mouse cursor in 3D viewer
 */

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface RaycastHit {
    /** World position where ray hit the surface */
    position: Vector3;
    /** Surface normal at hit point */
    normal: Vector3;
    /** ID of the hit object */
    objectId: string;
    /** Face/triangle index that was hit */
    faceIndex: number;
    /** Distance from ray origin to hit point */
    distance: number;
    /** UV coordinates at hit point (if available) */
    uv?: { u: number; v: number };
}

export interface Ray {
    origin: Vector3;
    direction: Vector3;
}

/**
 * Converts 2D screen coordinates to a 3D ray in world space
 * @param screenX - X coordinate in pixels (0 = left edge)
 * @param screenY - Y coordinate in pixels (0 = top edge)
 * @param canvasWidth - Width of the canvas in pixels
 * @param canvasHeight - Height of the canvas in pixels
 * @param camera - Camera object from viewer (must have projection and view matrices)
 * @returns Ray in world space
 */
export function screenToRay(
    screenX: number,
    screenY: number,
    canvasWidth: number,
    canvasHeight: number,
    camera: any // Type depends on actual SDK camera interface
): Ray {
    // Convert screen coordinates to normalized device coordinates (NDC)
    // NDC ranges from -1 to 1
    const ndcX = (screenX / canvasWidth) * 2 - 1;
    const ndcY = -(screenY / canvasHeight) * 2 + 1; // Y is inverted in screen space

    // This is a simplified implementation
    // In actual SDK, you would use camera.unproject() or similar method
    // to convert NDC to world space using inverse projection and view matrices

    const rayOrigin: Vector3 = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };

    // Calculate ray direction (simplified - actual implementation depends on SDK)
    const rayDirection: Vector3 = {
        x: ndcX,
        y: ndcY,
        z: -1 // Forward direction
    };

    // Normalize direction vector
    const length = Math.sqrt(
        rayDirection.x ** 2 + rayDirection.y ** 2 + rayDirection.z ** 2
    );

    return {
        origin: rayOrigin,
        direction: {
            x: rayDirection.x / length,
            y: rayDirection.y / length,
            z: rayDirection.z / length
        }
    };
}

/**
 * Performs ray-triangle intersection test
 * @param ray - Ray to test
 * @param v0, v1, v2 - Triangle vertices
 * @returns Intersection distance or null if no hit
 */
export function rayTriangleIntersection(
    ray: Ray,
    v0: Vector3,
    v1: Vector3,
    v2: Vector3
): number | null {
    const EPSILON = 0.0000001;

    // Möller–Trumbore intersection algorithm
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

    // Calculate determinant
    const h = crossProduct(ray.direction, edge2);
    const det = dotProduct(edge1, h);

    if (det > -EPSILON && det < EPSILON) {
        return null; // Ray is parallel to triangle
    }

    const invDet = 1.0 / det;
    const s: Vector3 = {
        x: ray.origin.x - v0.x,
        y: ray.origin.y - v0.y,
        z: ray.origin.z - v0.z
    };

    const u = invDet * dotProduct(s, h);
    if (u < 0.0 || u > 1.0) {
        return null;
    }

    const q = crossProduct(s, edge1);
    const v = invDet * dotProduct(ray.direction, q);
    if (v < 0.0 || u + v > 1.0) {
        return null;
    }

    const t = invDet * dotProduct(edge2, q);
    if (t > EPSILON) {
        return t; // Ray intersection distance
    }

    return null; // Line intersection but not ray
}

/**
 * Cross product of two 3D vectors
 */
function crossProduct(a: Vector3, b: Vector3): Vector3 {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

/**
 * Dot product of two 3D vectors
 */
function dotProduct(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * Performs raycasting against model objects to find surface intersections
 * NOTE: This is a placeholder implementation. In actual usage, you should use
 * the SDK's built-in raycasting methods from ViewerAPI or similar.
 * 
 * @param ray - Ray to cast
 * @param modelObjects - Array of model objects from ViewerAPI
 * @returns Closest hit result or null
 */
export function raycastModelObjects(
    ray: Ray,
    modelObjects: any[] // Type depends on SDK's ModelObject interface
): RaycastHit | null {
    let closestHit: RaycastHit | null = null;
    let closestDistance = Infinity;

    // Iterate through all model objects
    for (const obj of modelObjects) {
        // This is pseudo-code - actual implementation depends on SDK
        // You would typically:
        // 1. Get object's geometry/mesh data
        // 2. Transform geometry to world space
        // 3. Test ray against triangles
        // 4. Track closest hit

        // Example structure (replace with actual SDK methods):
        // const geometry = obj.getGeometry();
        // const triangles = geometry.getTriangles();
        // for (const triangle of triangles) {
        //   const distance = rayTriangleIntersection(ray, triangle.v0, triangle.v1, triangle.v2);
        //   if (distance !== null && distance < closestDistance) {
        //     closestDistance = distance;
        //     closestHit = createHitResult(ray, distance, triangle, obj);
        //   }
        // }
    }

    return closestHit;
}

/**
 * Helper to create a RaycastHit result
 */
function createHitResult(
    ray: Ray,
    distance: number,
    triangle: any,
    object: any
): RaycastHit {
    const position: Vector3 = {
        x: ray.origin.x + ray.direction.x * distance,
        y: ray.origin.y + ray.direction.y * distance,
        z: ray.origin.z + ray.direction.z * distance
    };

    // Calculate surface normal from triangle vertices
    const edge1 = {
        x: triangle.v1.x - triangle.v0.x,
        y: triangle.v1.y - triangle.v0.y,
        z: triangle.v1.z - triangle.v0.z
    };
    const edge2 = {
        x: triangle.v2.x - triangle.v0.x,
        y: triangle.v2.y - triangle.v0.y,
        z: triangle.v2.z - triangle.v0.z
    };
    const normal = crossProduct(edge1, edge2);

    return {
        position,
        normal,
        objectId: object.id,
        faceIndex: triangle.index,
        distance
    };
}
