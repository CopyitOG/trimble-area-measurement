# Deploying Your Trimble Connect Area Measurement Plugin

## Quick Start Guide

### Option 1: Quick Test (Local Development - DEMO MODE)

The `index.html` file includes a **demo mode** that you can test immediately:

1. **Open the HTML file directly in your browser:**
   ```
   Open: c:\Users\andrius_reciunas\Desktop\Cursor apps\TC Area\public\index.html
   ```

2. This will show you the UI and simulate the hover detection
3. **Note:** This won't connect to real Trimble Connect - it's just for UI testing

### Option 2: Deploy to Trimble Connect (Full Integration)

To use with your actual Trimble Connect project, follow these steps:

## Step 1: Host Your Files

You need to host your extension files on a web server with CORS enabled. Options:

### A. GitHub Pages (Free & Easy)

1. Create a GitHub repository
2. Push your `public/` folder to the repo
3. Enable GitHub Pages in repo settings
4. Your manifest URL will be: `https://YOUR_USERNAME.github.io/YOUR_REPO/manifest.json`

### B. Web Server / Cloud Hosting

Host on any web server that supports:
- HTTPS (required by Trimble Connect)
- CORS enabled
- Static file serving

Popular options:
- Netlify (free)
- Vercel (free)
- Azure Static Web Apps
- AWS S3 + CloudFront

## Step 2: Update manifest.json

Before deploying, edit `public/manifest.json` and replace placeholders:

```json
{
  "title": "Area Measurement Tool",
  "description": "Hover-based surface area measurement for 3D models",
  "url": "https://YOUR_DOMAIN/index.html",  ← Change this!
  "icon": "https://YOUR_DOMAIN/icon.png",    ← Change this!
  "infoUrl": "https://YOUR_DOMAIN/README.html",
  "enabled": true
}
```

## Step 3: Build Your TypeScript (Production)

Currently the HTML uses a demo version. To use the real plugin:

1. **Build TypeScript to JavaScript:**
   ```bash
   npm install
   npm run build
   ```

2. **Update index.html** to import your compiled plugin:

   Replace this section in `public/index.html` (around line 180):

   ```javascript
   // Change from:
   function initializePlugin() {
       console.log('Plugin initialized (simplified mode)');
   }

   // To:
   async function initializePlugin() {
       const { AreaMeasurementPlugin } = await import('./dist/AreaMeasurementPlugin.js');
       plugin = new AreaMeasurementPlugin(viewerAPI, viewerAPI);
   }
   ```

3. **Copy `dist/` folder to `public/`:**
   ```bash
   xcopy /E /I dist public\dist
   ```

## Step 4: Register in Trimble Connect

1. **Go to your Trimble Connect project**
2. Navigate to: **3D Viewer → Settings → Extensions** (or **Project Settings → Extensions**)
3. Click **"Add Extension"** or **"Register Custom Extension"**
4. Enter your manifest URL:
   ```
   https://YOUR_DOMAIN/manifest.json
   ```
5. Click **Save**

## Step 5: Enable and Use

1. The extension should now appear in your Trimble Connect sidebar/toolbar
2. Click to open the extension panel
3. Click **"Activate Tool"**
4. Hover over surfaces in the 3D viewer to see area measurements!

## File Structure for Deployment

Your hosted server should have:

```
your-domain/
├── manifest.json          ← Extension manifest
├── index.html            ← Main UI
├── icon.png              ← Extension icon (create a 64x64 PNG)
├── dist/                 ← Compiled TypeScript
│   ├── index.js
│   ├── AreaMeasurementPlugin.js
│   ├── AreaMeasurementButton.js
│   └── utils/
│       ├── raycaster.js
│       └── areaCalculator.js
└── README.html (optional)
```

## Creating an Icon

Create a simple 64x64 PNG icon. You can use:
- Online icon generators
- Photoshop/GIMP
- Or use this emoji as placeholder: 📏

## Important Notes

### CORS Requirements

Your web server **must** have CORS enabled. Add these headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### HTTPS Required

Trimble Connect requires HTTPS. Most free hosting services provide this automatically.

### SDK Integration

The current `index.html` has placeholder code. You need to:

1. Import actual SDK methods for raycasting
2. Replace demo `simulateHoverDetection()` with real plugin calls
3. Update SDK-specific imports per the integration notes in README.md

## Testing Checklist

Before deploying:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] `manifest.json` URLs point to your hosted domain
- [ ] All files uploaded to web server
- [ ] HTTPS and CORS working
- [ ] Icon file exists at specified URL
- [ ] Manifest URL accessible from browser

After deploying to Trimble Connect:

- [ ] Extension appears in Trimble Connect
- [ ] Extension panel opens correctly
- [ ] UI displays properly
- [ ] Button activates/deactivates
- [ ] Console shows no errors
- [ ] Viewer API connection successful

## Troubleshooting

**Extension doesn't appear:**
- Check manifest.json URL is accessible
- Verify CORS headers
- Check browser console for errors

**"Failed to connect" error:**
- Ensure you're running inside Trimble Connect (not standalone)
- Check Workspace API version compatibility

**Raycasting not working:**
- Review SDK integration points in `src/AreaMeasurementPlugin.ts`
- Replace placeholder raycast code with actual ViewerAPI methods
- Check console for errors

## Next Steps

Once deployed, you can:

1. Test with various model types
2. Adjust debounce timing for performance
3. Customize UI styling
4. Add unit preferences
5. Implement persistent settings

## Support

- Trimble Connect API Docs: https://developers.connect.trimble.com/
- Workspace API Documentation: https://connect.trimble.com/workspace-api
- Your plugin README: `README.md`
