# Quick Start Guide - AI Notes App

Get up and running with AI Notes in 5 minutes!

## 🚀 Quick Setup (macOS & Linux)

### Option 1: Automated Setup (Recommended)

```bash
cd AIAPP
./setup.sh
```

The setup script will:
- ✅ Check Node.js installation
- ✅ Install all dependencies
- ✅ Create .env file from template
- ✅ Guide you through API key setup

### Option 2: Manual Setup

```bash
cd AIAPP
npm install
cp .env.example .env
# Edit .env and add your API key
```

## 🔑 Get Your API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in your `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```

## 🎯 Run the App

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Build for Production

**macOS:**
```bash
npm run build:mac
```
Output: `dist-electron/AI Notes.dmg`

**Linux:**
```bash
npm run build:linux
```
Output: `dist-electron/AI Notes-x.x.x.AppImage`

**Both:**
```bash
npm run build:all
```

## 📱 First Steps in the App

1. **Create Your First Note**
   - Click "New Note" button
   - Give it a title
   - Start writing!

2. **Try AI Features**
   - Write some content
   - Click "Summarize" to get an AI summary
   - Click "Generate with AI" to create content from a prompt

3. **Use Voice Recording**
   - Click "Voice Note"
   - Allow microphone access
   - Speak your note
   - Click "Stop Recording"

4. **Organize with Tags**
   - Add tags to your notes
   - Filter notes by clicking tags
   - Search across all notes

## 🐛 Common Issues

### "API key not configured"
- Make sure you edited `.env` file
- Restart the app after changing `.env`
- Check that the key starts with `AIza`

### Voice recording not working
- Grant microphone permissions
- Use Chrome or Edge browser (best compatibility)
- Check browser console for errors

### Build fails on Linux
Install required dependencies:
```bash
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
```

## 📚 Learn More

- Full documentation: See `README.md`
- Project structure: Check `README.md` → Project Structure
- Troubleshooting: See `README.md` → Troubleshooting

## 💡 Tips

- Notes auto-save as you type
- Use Ctrl/Cmd + F to search
- Export your notes regularly (download icon)
- Customize AI behavior with System Prompt
- Tags are case-insensitive

## 🎉 You're Ready!

Start taking smart notes with AI assistance!

Need help? Check the full README.md for detailed information.
