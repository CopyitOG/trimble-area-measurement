# Plan B: Manual Face Area Calculation (Future Enhancement)

## Overview
This document preserves the detailed approach for **Plan B** - manual face boundary tracing and area calculation. This may be needed if Plan C's bounding box approximation is insufficient for complex geometry.

## When to Use Plan B
- Complex, non-rectangular geometry
- Curved or angled surfaces
- Need exact face area (not approximation)
- Irregular polygonal faces

## Implementation Approach

### Step 1: Face Boundary Detection

```javascript
async function traceFaceBoundary(pickData) {
    const { position, normal, modelId, objectRuntimeId } = pickData;
    
    // Create a plane from the pick point and normal
    const plane = {
        point: position,
        normal: normal
    };
    
    // Cast rays in a circular pattern around the pick point
    const rayCount = 36; // Every 10 degrees
    const maxDistance = 10; // meters
    const boundaryPoints = [];
    
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        
        // Create tangent vectors on the plane
        const tangent1 = getTangentVector(normal);
        const tangent2 = crossProduct(normal, tangent1);
        
        // Ray direction
        const rayDir = {
            x: Math.cos(angle) * tangent1.x + Math.sin(angle) * tangent2.x,
            y: Math.cos(angle) * tangent1.y + Math.sin(angle) * tangent2.y,
            z: Math.cos(angle) * tangent1.z + Math.sin(angle) * tangent2.z
        };
        
        // Find intersection with face edge
        const edgePoint = await findEdgeIntersection(
            position, 
            rayDir, 
            plane, 
            modelId, 
            objectRuntimeId
        );
        
        if (edgePoint) {
            boundaryPoints.push(edgePoint);
        }
    }
    
    return boundaryPoints;
}
```

### Step 2: Edge Detection

```javascript
async function findEdgeIntersection(origin, direction, plane, modelId, objId) {
    // CHALLENGE: Workspace API doesn't have ray casting
    // Would need to:
    // 1. Use multiple viewer.pick() calls in small increments
    // 2. Detect when objectRuntimeId changes (edge detected)
    // 3. Or detect when normal vector changes significantly
    
    const stepSize = 0.01; // 1cm increments
    let currentPoint = { ...origin };
    
    for (let distance = 0; distance < maxDistance; distance += stepSize) {
        currentPoint.x += direction.x * stepSize;
        currentPoint.y += direction.y * stepSize;
        currentPoint.z += direction.z * stepSize;
        
        // Problem: No way to query "what's at this 3D point?" in Workspace API
        // This is where Plan B breaks down without direct Web3D access
    }
    
    return null;
}
```

### Step 3: Area Calculation

```javascript
function calculatePolygonArea(boundaryPoints, normal) {
    // Project points onto 2D plane
    const points2D = projectPointsToPlane(boundaryPoints, normal);
    
    // Triangulate the polygon
    const triangles = triangulate(points2D);
    
    // Sum triangle areas
    let totalArea = 0;
    for (const triangle of triangles) {
        totalArea += calculateTriangleArea(triangle);
    }
    
    return totalArea;
}

function projectPointsToPlane(points3D, normal) {
    // Create 2D coordinate system on the plane
    const tangent1 = getTangentVector(normal);
    const tangent2 = crossProduct(normal, tangent1);
    
    // Project each point to 2D
    return points3D.map(p => ({
        x: dotProduct(p, tangent1),
        y: dotProduct(p, tangent2)
    }));
}

function triangulate(points2D) {
    // Use ear clipping algorithm or Delaunay triangulation
    // Could use library like earcut.js
    return earcut(points2D.flat(), null, 2);
}

function calculateTriangleArea(vertices) {
    // Heron's formula or cross product method
    const [a, b, c] = vertices;
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const ac = { x: c.x - a.x, y: c.y - a.y };
    
    return Math.abs(ab.x * ac.y - ab.y * ac.x) / 2;
}
```

## Critical Blocker

**Workspace API Missing Features:**
- ❌ No ray casting (can't trace face boundaries)
- ❌ No 3D point queries (can't detect edges programmatically)
- ❌ No face/edge geometry access (only bounding boxes)

**Possible Workarounds:**
1. **Access Web3D directly** - Bypass Workspace API wrapper (Approach A)
2. **Use viewer.pick() repeatedly** - Simulate ray casting with many pick queries (very slow)
3. **Request TC team** - Ask for face geometry API in future Workspace API versions

## Dependencies

If implementing Plan B, would need:
```bash
npm install earcut  # For polygon triangulation
```

## Conclusion

**Plan B is technically sound but blocked by API limitations.** 

Current recommendation: 
1. ✅ Use Plan C for now (works for 80% of use cases)
2. 📋 Document Plan B for future reference
3. 🔍 Monitor Workspace API updates for face geometry support
4. 💡 Consider contacting Trimble support about face-level API access

---

*Saved: 2026-01-10*
*Status: On Hold - API limitations*
