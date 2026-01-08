# Trimble Connect Area Measurement Plugin

A TypeScript plugin for Trimble Connect Web 3D Viewer that enables **hover-based surface area measurement**. Simply hover your mouse over any surface in the 3D model to automatically calculate and display its area.

## Features

- ✨ **Hover-based detection** - No need to manually select points
- 📏 **Automatic area calculation** - Uses mesh triangle geometry for accurate measurements
- 🎯 **Real-time raycasting** - Instantly detects surfaces under the cursor
- 📊 **Smart unit formatting** - Automatically displays in mm², cm², or m² based on magnitude
- 🧹 **Proper cleanup** - All event listeners are removed on deactivation
- ⚡ **Performance optimized** - Debounced hover detection prevents excessive calculations

## Installation

```bash
npm install trimble-connect-workspace-api
npm install
npm run build
```

## Project Structure

```
TC Area/
├── src/
│   ├── AreaMeasurementPlugin.ts    # Main plugin class
│   ├── AreaMeasurementButton.ts    # UI button component
│   ├── index.ts                     # Public exports
│   └── utils/
│       ├── raycaster.ts            # Raycasting utilities
│       └── areaCalculator.ts       # Area calculation functions
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### Basic Integration

```typescript
import { AreaMeasurementPlugin, AreaMeasurementButton } from './src/index';

// Get your Trimble Connect Viewer and ViewerAPI instances
const viewer = ...; // Your viewer instance
const viewerAPI = ...; // Your ViewerAPI instance

// Create the plugin
const areaMeasurementPlugin = new AreaMeasurementPlugin(viewer, viewerAPI);

// Create the toolbar button
const toolbar = document.getElementById('viewer-toolbar');
const measureButton = new AreaMeasurementButton(areaMeasurementPlugin, toolbar);

// Plugin is now ready! Click the button to activate/deactivate
```

### Manual Control

```typescript
// Activate the plugin programmatically
areaMeasurementPlugin.activate();

// Check if active
if (areaMeasurementPlugin.isPluginActive()) {
  console.log('Plugin is measuring areas on hover');
}

// Deactivate
areaMeasurementPlugin.deactivate();

// Toggle
areaMeasurementPlugin.toggle();
```

### Custom Button Placement

```typescript
// Create button without auto-adding to toolbar
const measureButton = new AreaMeasurementButton(areaMeasurementPlugin);

// Get button element for manual placement
const buttonElement = measureButton.getButtonElement();
document.getElementById('custom-toolbar').appendChild(buttonElement);

// Clean up when done
measureButton.destroy();
```

## How It Works

1. **Activation**: When the plugin is activated, it registers a `mousemove` event listener on the viewer canvas
2. **Raycasting**: As the mouse moves, the plugin converts screen coordinates to a 3D ray
3. **Surface Detection**: The ray is tested against all model objects to find surface intersections
4. **Area Calculation**: When a surface is hit, the plugin extracts triangle geometry and calculates total area
5. **Display**: A `SurfaceMarkup` label appears showing the formatted area measurement
6. **Cleanup**: On deactivation, all event listeners are removed and markups are cleared

## SDK Integration Notes

This boilerplate includes placeholder implementations for SDK-specific functionality. You'll need to replace these with actual SDK methods:

### Required SDK Adaptations

1. **Viewer Canvas Access** (`AreaMeasurementPlugin.ts` line ~60):
   ```typescript
   this.viewerCanvas = this.viewer.getCanvas();
   ```

2. **Camera Access** (line ~145):
   ```typescript
   const camera = this.viewer.getCamera();
   ```

3. **Model Objects** (line ~157):
   ```typescript
   const modelObjects = this.viewerAPI.getModelObjects();
   ```

4. **Raycasting** (line ~151):
   ```typescript
   // Preferred: Use built-in SDK raycasting
   const hit = this.viewerAPI.raycast(mouseX, mouseY);
   ```

5. **SurfaceMarkup Creation** (line ~231):
   ```typescript
   import { SurfaceMarkup } from 'web3d-plugin-markup_src';
   
   this.currentMarkup = new SurfaceMarkup({
     position: position,
     text: areaText
   });
   this.viewer.addMarkup(this.currentMarkup);
   ```

6. **Face Geometry Access** (line ~202):
   ```typescript
   const object = this.viewerAPI.getObjectById(hit.objectId);
   const geometry = object.getGeometry();
   const face = geometry.getFace(hit.faceIndex);
   ```

## API Reference

### AreaMeasurementPlugin

**Constructor**
- `constructor(viewer: any, viewerAPI: any)`

**Methods**
- `activate(): void` - Activates the measurement tool
- `deactivate(): void` - Deactivates and cleans up
- `toggle(): void` - Toggles between active/inactive
- `isPluginActive(): boolean` - Returns current state

### AreaMeasurementButton

**Constructor**
- `constructor(plugin: AreaMeasurementPlugin, toolbar?: HTMLElement)`

**Methods**
- `activate(): void` - Activates plugin and updates button state
- `deactivate(): void` - Deactivates plugin and updates button state
- `togglePlugin(): void` - Toggles plugin state
- `getButtonElement(): HTMLButtonElement` - Returns button DOM element
- `destroy(): void` - Removes button and cleans up

## Building

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run watch

# Clean build output
npm run clean
```

## Configuration

The plugin has several configurable parameters in `AreaMeasurementPlugin.ts`:

- `DEBOUNCE_DELAY` (default: 100ms) - Controls how often raycasting is performed during mouse movement

In `areaCalculator.ts`:

- Measurement precision (default: 2 decimal places)
- Unit conversion factors for mm, cm, m, in, ft

## Browser Compatibility

- Modern browsers supporting ES2020
- WebGL-capable browsers (required for Trimble Connect 3D Viewer)

## Development Notes

- The raycasting implementation uses the **Möller-Trumbore algorithm** for ray-triangle intersection
- Area calculation uses the **cross product method** for triangle area
- All event listeners are properly cleaned up to prevent memory leaks
- Mouse events are debounced to optimize performance

## License

MIT

## Support

For issues related to:
- **This plugin**: Check the code comments and SDK adaptation notes above
- **Trimble Connect SDK**: Refer to official Trimble Connect documentation
- **Integration help**: Review the usage examples in this README
