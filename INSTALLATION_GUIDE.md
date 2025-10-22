# AI Notes App - Installation & Build Guide

## Quick Start: Install and Save to Downloads

### Step 1: Install Dependencies

```bash
# Navigate to the project directory (if not already there)
cd /home/r3tr0/Documents/Tools/AIAPP

# Install all required dependencies
npm install
```

### Step 2: Set Up API Key (Optional but Recommended)

```bash
# Create environment file
cp .env.example .env

# Edit the .env file and add your Gemini API key
# Get a free key from: https://makersuite.google.com/app/apikey
nano .env
# or
gedit .env
```

Add this line to `.env`:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3: Build the Application

For Linux (your current system):

```bash
# Build the application for Linux
npm run build:linux
```

This will create:
- `dist-electron/AI Notes-1.0.0.AppImage` - Universal Linux package (recommended)
- `dist-electron/ai-notes-app_1.0.0_amd64.deb` - Debian package

### Step 4: Copy Built Files to Downloads

```bash
# Copy all built files to your Downloads folder
cp -r dist-electron/* ~/Downloads/

# Or copy specific files:
# Copy AppImage
cp dist-electron/*.AppImage ~/Downloads/

# Copy DEB package
cp dist-electron/*.deb ~/Downloads/
```

---

## Automated Build Script

I've created a script that automates the entire process. See `build-and-save.sh` below.

---

## Installation Options

### Option 1: AppImage (Recommended - No Installation Required)

```bash
# Make the AppImage executable
chmod +x ~/Downloads/AI\ Notes-*.AppImage

# Run the application
~/Downloads/AI\ Notes-*.AppImage
```

**Advantages:**
- No installation required
- Works on any Linux distribution
- Portable - can run from USB drive
- Self-contained with all dependencies

### Option 2: DEB Package (For Debian/Ubuntu)

```bash
# Install the DEB package
sudo dpkg -i ~/Downloads/ai-notes-app_*.deb

# If there are dependency issues, fix them:
sudo apt-get install -f

# Run the application
ai-notes
# or find it in your applications menu
```

---

## Development Mode (Testing Before Building)

To test the app before building:

```bash
# Run in development mode
npm run dev
```

This will:
- Start the Vite dev server on http://localhost:5173
- Launch the Electron app
- Enable hot-reload for quick testing

Press `Ctrl+C` to stop the development server.

---

## Build Output Details

After running `npm run build:linux`, you'll find these files in `dist-electron/`:

```
dist-electron/
├── AI Notes-1.0.0.AppImage          # ~100-150 MB - Universal Linux app
├── ai-notes-app_1.0.0_amd64.deb     # ~100-150 MB - Debian package
├── linux-unpacked/                   # Unpacked application files
├── builder-debug.yml                 # Build debug info
└── builder-effective-config.yaml    # Build configuration
```

---

## Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Build fails with icon errors

**Solution:**
```bash
# Generate icons first
node create-icons-enhanced.js

# Then build
npm run build:linux
```

### Issue: Permission denied when running AppImage

**Solution:**
```bash
chmod +x ~/Downloads/AI\ Notes-*.AppImage
```

### Issue: Missing dependencies on Linux

**Solution:**
```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
```

---

## File Sizes

Expected file sizes:
- **AppImage**: ~100-150 MB
- **DEB package**: ~100-150 MB
- **Total build output**: ~200-300 MB

---

## Next Steps After Installation

1. **Launch the app** using one of the methods above
2. **Configure your Gemini API key** in the app settings (if not done during build)
3. **Start creating notes** with AI assistance!

---

## Uninstallation

### For AppImage:
```bash
# Simply delete the file
rm ~/Downloads/AI\ Notes-*.AppImage
```

### For DEB package:
```bash
# Uninstall the package
sudo apt-get remove ai-notes-app
```

---

## Additional Resources

- **README.md** - Full project documentation
- **QUICKSTART.md** - Quick start guide
- **SECURITY.md** - Security information
- **CHANGELOG.md** - Version history

---

**Need help?** Check the troubleshooting section or review the console logs for errors.
