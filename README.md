# AI Notes - Electron Desktop App

A powerful AI-powered note-taking application built with React, Electron, and Gemini AI. Features include smart summarization, AI content generation, voice-to-text recording, and more.

## Features

✨ **AI-Powered Features**
- Smart note summarization using Gemini AI
- AI content generation from prompts
- Customizable system prompts

🎤 **Voice Recording**
- Voice-to-text transcription
- Browser-based speech recognition

📝 **Note Management**
- Create, edit, and delete notes
- Tag-based organization
- Search functionality
- Filter by tags

💾 **Data Persistence**
- Auto-save functionality
- Export/import notes (JSON format)
- Electron file storage with localStorage fallback

🎨 **Modern UI**
- Clean, responsive interface
- Dark mode support (via Tailwind CSS)
- Intuitive navigation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- macOS or Linux (Ubuntu)

## Installation

1. **Clone or navigate to the AIAPP directory**
   ```bash
   cd AIAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   Get a free API key from: https://makersuite.google.com/app/apikey

## Development

Run the app in development mode:

```bash
npm run dev
```

This will:
- Start the Vite development server on http://localhost:5173
- Launch the Electron app
- Enable hot-reload for quick development

## Building for Production

### Build for macOS

```bash
npm run build:mac
```

This creates:
- `dist-electron/AI Notes.dmg` - Disk image installer
- `dist-electron/AI Notes.app.zip` - Zipped application

#### macOS Installation & Gatekeeper

**Important:** This app is not code-signed with an Apple Developer certificate. When you first open it, macOS Gatekeeper will block it.

**To install on macOS:**

1. **Download and open the .dmg file**
2. **Drag AI Notes to Applications folder**
3. **First launch - you'll see a security warning:**
   - macOS will say "AI Notes cannot be opened because it is from an unidentified developer"
   - Click "OK"

4. **Bypass Gatekeeper:**
   - Open **System Preferences** → **Security & Privacy** → **General** tab
   - You'll see a message: "AI Notes was blocked from use because it is not from an identified developer"
   - Click **"Open Anyway"**
   - Confirm by clicking **"Open"** in the dialog

5. **Alternative method (if above doesn't work):**
   ```bash
   # Remove quarantine attribute
   xattr -cr "/Applications/AI Notes.app"
   ```

6. **The app will now open normally** - you only need to do this once!

**Why is this necessary?**
- Code signing requires a paid Apple Developer account ($99/year)
- This is a free, open-source app
- The app is safe - you can review the source code
- This is standard for unsigned macOS apps

**For developers:** If you want to code-sign the app, get an Apple Developer certificate and add to `package.json`:
```json
"mac": {
  "identity": "Your Developer ID",
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "entitlements": "build/entitlements.mac.plist",
  "entitlementsInherit": "build/entitlements.mac.plist"
}
```

### Build for Linux

```bash
npm run build:linux
```

This creates:
- `dist-electron/AI Notes-x.x.x.AppImage` - Universal Linux package
- `dist-electron/ai-notes-app_x.x.x_amd64.deb` - Debian package

### Build for Both Platforms

```bash
npm run build:all
```

## Project Structure

```
AIAPP/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Preload script for IPC
├── src/
│   ├── components/
│   │   ├── AINotesApp.jsx   # Main app component
│   │   └── ui/              # UI components (Button, Input, etc.)
│   ├── App.jsx              # Root component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (API keys)
├── .env.example             # Example environment file
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## Usage

### Creating Notes
1. Click "New Note" button in the sidebar
2. Enter a title and start writing
3. Notes auto-save as you type

### AI Features
1. **Summarize**: Select a note with content, click "Summarize" to generate a summary
2. **Generate**: Click "Generate with AI" and enter a prompt to create AI-generated content
3. **System Prompt**: Customize AI behavior by clicking the "System Prompt" button

### Voice Recording
1. Click "Voice Note" button
2. Allow microphone access when prompted
3. Speak your note
4. Click "Stop Recording" when done

### Tags
1. Add tags to organize notes
2. Click tags in the filter section to filter notes
3. Remove tags by clicking the X on a tag

### Export/Import
- **Export**: Click the download icon to save all notes as JSON
- **Import**: Click the upload icon to import notes from a JSON file

## Troubleshooting

### API Key Issues
- Ensure your `.env` file contains a valid `VITE_GEMINI_API_KEY`
- Restart the app after changing the `.env` file
- Check the console for API-related errors

### Voice Recording Not Working
- Grant microphone permissions when prompted
- Voice recording uses browser's SpeechRecognition API (Chrome/Edge recommended)
- Check browser compatibility

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist dist-electron`
- Ensure you have the latest Node.js version

### Linux-Specific Issues
- Install required dependencies:
  ```bash
  sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
  ```

## Security Notes

⚠️ **Important**: Never commit your `.env` file with real API keys to version control. The `.gitignore` file is configured to exclude it.

## Technologies Used

- **React** - UI framework
- **Electron** - Desktop app framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Gemini AI** - AI features
- **Lucide React** - Icons
- **Web Speech API** - Voice recognition

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs for errors
3. Ensure all dependencies are installed correctly

## Author

**Erik Peterson**

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style
- All features are tested
- Documentation is updated

---

**Enjoy taking smart notes with AI! 📝✨**
