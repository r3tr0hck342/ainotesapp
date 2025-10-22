# Quick Build Guide - AI Notes App

## 🚀 Fastest Way to Build and Save to Downloads

### One-Command Build (Recommended)

```bash
./build-and-save.sh
```

This automated script will:
1. ✅ Check your system requirements
2. ✅ Install all dependencies
3. ✅ Build the application for Linux
4. ✅ Copy all files to your Downloads folder
5. ✅ Make the AppImage executable
6. ✅ Show you how to run the app

---

## 📋 Manual Step-by-Step (If you prefer)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the App
```bash
npm run build:linux
```

### Step 3: Copy to Downloads
```bash
# Copy all build files
cp -r dist-electron/* ~/Downloads/

# Or copy specific files
cp dist-electron/*.AppImage ~/Downloads/
cp dist-electron/*.deb ~/Downloads/

# Make AppImage executable
chmod +x ~/Downloads/AI\ Notes-*.AppImage
```

---

## 🎯 Running the Built App

### Option 1: AppImage (Easiest - No Installation)
```bash
# Navigate to Downloads
cd ~/Downloads

# Run the AppImage
./AI\ Notes-*.AppImage
```

### Option 2: Install DEB Package
```bash
# Install
sudo dpkg -i ~/Downloads/ai-notes-app_*.deb

# Fix dependencies if needed
sudo apt-get install -f

# Run from terminal
ai-notes

# Or find "AI Notes" in your applications menu
```

---

## 📁 Where Are My Files?

After building, you'll find:

**In Downloads folder:**
- `AI Notes-1.0.0.AppImage` - Ready to run
- `ai-notes-app_1.0.0_amd64.deb` - Ready to install
- `AI-Notes-Build-[timestamp]/` - Full build folder with all files

**Original build location:**
- `dist-electron/` - In your project directory

---

## ⚡ Quick Commands Reference

```bash
# Build and save (automated)
./build-and-save.sh

# Just build (manual)
npm run build:linux

# Run in development mode (for testing)
npm run dev

# Clean and rebuild
rm -rf dist-electron node_modules
npm install
npm run build:linux

# Copy to Downloads
cp dist-electron/*.AppImage ~/Downloads/
chmod +x ~/Downloads/AI\ Notes-*.AppImage
```

---

## 🔧 Troubleshooting

### Script won't run?
```bash
chmod +x build-and-save.sh
./build-and-save.sh
```

### Build fails?
```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json dist-electron
npm install
npm run build:linux
```

### AppImage won't run?
```bash
chmod +x ~/Downloads/AI\ Notes-*.AppImage
```

### Missing dependencies?
```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils
```

---

## 📊 Expected Results

**Build time:** 2-5 minutes (depending on your system)

**File sizes:**
- AppImage: ~100-150 MB
- DEB package: ~100-150 MB

**Output location:** `~/Downloads/`

---

## 🎉 Success Indicators

You'll know it worked when you see:
- ✅ "Build completed successfully!"
- ✅ Files in your Downloads folder
- ✅ AppImage is executable (green in file manager)
- ✅ App launches when you double-click the AppImage

---

## 📚 More Information

- **Full guide:** See `INSTALLATION_GUIDE.md`
- **Project docs:** See `README.md`
- **Quick start:** See `QUICKSTART.md`

---

**Need help?** Check `INSTALLATION_GUIDE.md` for detailed troubleshooting.
