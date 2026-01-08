# GitHub Upload Guide - Trimble Connect Area Measurement Plugin

## Prerequisites

1. **GitHub Account**: Create one at https://github.com if you don't have one
2. **Git Installed**: Check by running `git --version` in terminal

## Step 1: Prepare Your Repository

Open PowerShell/Terminal in your project folder:

```powershell
cd "c:\Users\andrius_reciunas\Desktop\Cursor apps\TC Area"
```

## Step 2: Initialize Git Repository

```powershell
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Trimble Connect Area Measurement Plugin"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `trimble-area-measurement` (or your choice)
3. **Description**: "Hover-based area measurement plugin for Trimble Connect Web 3D Viewer"
4. **Public** or **Private**: Choose Public (required for free GitHub Pages)
5. **DON'T** check "Initialize with README" (we already have files)
6. Click **"Create repository"**

## Step 4: Connect and Push to GitHub

GitHub will show you commands. Use these (replace YOUR_USERNAME and YOUR_REPO):

```powershell
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Create token at: https://github.com/settings/tokens
  - Select "Generate new token (classic)"
  - Check "repo" scope
  - Copy the token and use as password

## Step 5: Enable GitHub Pages

1. In your GitHub repository, click **Settings** tab
2. Click **Pages** in left sidebar
3. Under "Source":
   - Branch: Select **main**
   - Folder: Select **/ (root)** or **/public** if available
4. Click **Save**
5. Wait 1-2 minutes for deployment

Your site will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Step 6: Update manifest.json

Now that you know your GitHub Pages URL, update the manifest:

**Edit:** `c:\Users\andrius_reciunas\Desktop\Cursor apps\TC Area\public\manifest.json`

Replace:
```json
{
  "title": "Area Measurement Tool",
  "description": "Hover-based surface area measurement for 3D models",
  "url": "https://YOUR_USERNAME.github.io/YOUR_REPO/public/index.html",
  "icon": "https://YOUR_USERNAME.github.io/YOUR_REPO/public/icon.png",
  "infoUrl": "https://YOUR_USERNAME.github.io/YOUR_REPO/public/test.html",
  "enabled": true
}
```

## Step 7: Push Updated Manifest

```powershell
git add public/manifest.json
git commit -m "Update manifest URLs"
git push
```

## Step 8: Register in Trimble Connect

1. Copy your manifest URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/public/manifest.json`
2. In Trimble Connect:
   - Open your project
   - **3D Viewer** → **Settings** ⚙️ → **Extensions**
   - Click **Add Extension**
   - Paste your manifest URL
   - Click **Save**

## Troubleshooting

### "Permission denied" when pushing
- Create Personal Access Token at https://github.com/settings/tokens
- Use token as password

### 404 on GitHub Pages URL
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages shows "Your site is published at..."
- Verify branch is set to "main" and folder to root

### CORS errors in Trimble Connect
- Ensure repository is **Public**
- GitHub Pages automatically has CORS enabled

### Extension doesn't load
- Test manifest.json URL directly in browser
- Should download/show the JSON file
- Check all URLs in manifest are correct

## Quick Commands Summary

```powershell
# Initial setup (one time)
cd "c:\Users\andrius_reciunas\Desktop\Cursor apps\TC Area"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# Future updates
git add .
git commit -m "Your update message"
git push
```

## Next Steps After Upload

1. ✅ Repository created
2. ✅ GitHub Pages enabled
3. ✅ Manifest URLs updated
4. ✅ Extension registered in Trimble Connect
5. 🎯 Test the tool in your 3D viewer!
