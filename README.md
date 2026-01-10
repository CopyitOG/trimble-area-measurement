# Trimble Connect Attribute Markup Extension

A Trimble Connect extension that displays customizable property labels on selected 3D elements.

## ✨ Features

- **Element Selection** - Click on elements in the 3D viewer to select them
- **Customizable Properties** - Choose which attributes to display:
  - 📌 Element Name
  - 🏗️ Element Type (Class)
  - 🎨 Material
  - 📏 Dimensions (Width × Height × Length)
- **Label Customization** - Adjust font size, background color, and text color
- **3D Floating Labels** - Labels positioned at the top of elements, following camera movement
- **Multi-element Support** - Apply labels to multiple selected elements simultaneously

## 🚀 How to Use

1. **Load the Extension** in Trimble Connect:
   - Go to Extensions → Load Extension
   - Enter: `https://copyitog.github.io/trimble-area-measurement/`

2. **Select Elements**:
   - Click on 3D elements in the viewer
   - Selected elements will appear in the list

3. **Configure Labels**:
   - Check which properties you want to display
   - Customize font size and colors

4. **Apply**:
   - Click "Apply to Selected" to create labels
   - Labels will appear above your selected elements

5. **Clear**:
   - Click "Clear All Labels" to remove all labels and selections

## 🛠️ Development

### Project Structure
```
trimble-attribute-markup/
├── public/
│   ├── index.html      # Main UI
│   ├── styles.css      # Styling
│   └── markup-tool.js  # Core logic
├── manifest.json       # Extension manifest
└── README.md
```

### Local Testing
1. Open `public/index.html` in Trimble Connect extension loader
2. Load a model with BIM properties
3. Test element selection and label display

## 📚 API Documentation

This repository includes comprehensive API documentation:
- `API RULES/` - Trimble Connect Workspace API
- `WEB3D_API/` - Web3D Graphics Library types
- `Web3D API Reference.html` - Full Web3D documentation

## 📝 Version History

### Version 1.0.0 (Current)
- ✅ Element selection via click
- ✅ Property extraction from IFC/BIM data
- ✅ Customizable 3D floating labels
- ✅ Camera tracking and label positioning
- ✅ Multiple property display options

### Previous: Face Area Measurement Tool
- Archived to `TC-Area-Measurement-ARCHIVED.zip`
- Used bounding box method for face area estimation

## 🔗 Links

- **Live Extension**: https://copyitog.github.io/trimble-area-measurement/
- **GitHub Repository**: https://github.com/CopyitOG/trimble-area-measurement

## 📄 License

MIT
