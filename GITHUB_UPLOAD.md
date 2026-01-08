# Fix 403 Error - Create GitHub Personal Access Token

## Step-by-Step Instructions

### 1. Create Token (Browser should now be open)

On the GitHub token page:

1. **Note:** Type "Trimble Plugin Upload"
2. **Expiration:** Select "90 days" 
3. **Select scopes:** Check ✓ **repo** (this gives full control of private repositories)
4. Scroll to bottom and click **"Generate token"**
5. **CRITICAL:** Copy the token immediately (you won't see it again!)
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Push with Token

Now run this command in your terminal:

```powershell
git push -u origin main
```

When prompted:
- **Username:** `Andriusrec`
- **Password:** Paste your token (Ctrl+V) - it won't show as you paste

### 3. Done!

After successful push, the token will be saved in Windows Credential Manager for future pushes.

---

## Alternative: GitHub CLI (Easier)

If the token method is confusing, try GitHub CLI:

```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate (opens browser)
gh auth login

# Push
git push -u origin main
```

---

**Once pushed successfully, we'll:**
1. ✅ Enable GitHub Pages
2. ✅ Update manifest.json with correct URLs
3. ✅ Register in Trimble Connect
