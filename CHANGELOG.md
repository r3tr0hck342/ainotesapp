# Changelog

All notable changes to AI Notes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-19

### Initial Release

#### Added
- ✨ Create, edit, and delete notes with auto-save
- 🏷️ Tag-based organization system with filtering
- 🔍 Search functionality (searches both title and content)
- 🤖 AI-powered note summarization using Google Gemini
- ✍️ AI content generation from custom prompts
- 🎤 Voice-to-text recording using Web Speech API
- 💾 Auto-save functionality with local file storage
- 📤 Export notes to JSON format
- 📥 Import notes from JSON files
- 🎨 Modern, responsive UI with Tailwind CSS
- 🌓 Dark mode support (system-based)
- 💻 Cross-platform support (macOS, Linux)
- 🔒 Local-first data storage (no cloud sync)
- ⚙️ Customizable AI system prompts
- 🔐 Secure IPC communication with context isolation

#### Technical Features
- Electron-based desktop application
- React 18 frontend with Vite build system
- Secure preload script for IPC
- Context isolation enabled for security
- File-based note storage in user data directory
- Browser fallback for localStorage when not in Electron

#### Platforms
- macOS (.dmg installer, .zip archive)
  - Universal build (Intel & Apple Silicon)
- Linux (AppImage, .deb package)
  - x64 architecture

### Known Issues
- Voice recording requires Chrome/Edge browser engine (uses Web Speech API)
- macOS app is not code-signed (see README for installation instructions)
- No auto-update mechanism (manual updates required)
- English language only (internationalization planned for future)

### Requirements
- **macOS:** 10.13 (High Sierra) or later
- **Linux:** Ubuntu 18.04+, Debian 10+, or equivalent
- **Internet connection:** Required for AI features
- **API Key:** Free Google Gemini API key (for AI features)
- **Microphone:** Optional, for voice recording features

### Security & Privacy
- All notes stored locally on device
- No telemetry or analytics
- No crash reporting to external servers
- API key stored securely in local .env file
- Only user-selected content sent to Gemini API
- Open source - code can be audited

---

## [Unreleased]

### Planned Features
- Windows support (.exe installer)
- Cloud sync (optional, user-controlled)
- Mobile apps (iOS, Android)
- Markdown support with live preview
- Note templates
- Collaborative editing
- Additional AI models (OpenAI, Claude, etc.)
- Internationalization (i18n) - multiple languages
- Note encryption
- Advanced search with filters
- Note linking and backlinks
- Attachments support (images, files)
- Custom themes
- Keyboard shortcuts customization
- Note versioning/history

### Potential Improvements
- Code signing for macOS (requires Apple Developer account)
- Auto-update mechanism
- Crash reporting (opt-in)
- Performance optimizations for large note collections
- Offline AI features (local models)
- Browser extension for web clipping

---

## Version History

- **1.0.0** (2024-12-19) - Initial public release

---

**Note:** This is the first public release. Please report issues on GitHub!

For detailed upgrade instructions and migration guides, see the [README.md](README.md).
