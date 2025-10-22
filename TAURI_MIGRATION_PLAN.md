# Tauri Migration Plan - AI Notes App

**Created:** October 22, 2025  
**Developer:** Erik Peterson  
**Purpose:** Migrate from Electron to Tauri to resolve runtime crashes and improve performance  
**Estimated Time:** 40-80 hours  
**Difficulty:** High

---

## Why Tauri?

### Advantages Over Electron
1. **Smaller Bundle Size** - ~600KB vs 114MB (Electron)
2. **Better Performance** - Uses system WebView instead of bundling Chromium
3. **Lower Memory Usage** - No Chromium overhead
4. **Likely Fixes `/dev/shm` Issue** - Different architecture avoids Chromium's shared memory requirements
5. **Better Security** - Rust-based backend with strong type safety
6. **Native System Integration** - Better OS integration

### Trade-offs
1. **Requires Rust Knowledge** - Backend written in Rust
2. **Different API** - Cannot directly port Electron IPC code
3. **Smaller Ecosystem** - Fewer plugins than Electron
4. **Learning Curve** - New framework to learn

---

## Migration Phases

### Phase 1: Setup & Prerequisites (4-8 hours)

#### 1.1 Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version
```

#### 1.2 Install Tauri CLI
```bash
cargo install tauri-cli
npm install --save-dev @tauri-apps/cli
```

#### 1.3 Create Tauri Project Structure
```bash
npm install @tauri-apps/api
```

#### 1.4 Initialize Tauri
```bash
npm install --save-dev @tauri-apps/cli
npx tauri init
```

**Configuration Prompts:**
- App name: AI Notes
- Window title: AI Notes
- Web assets location: ../dist
- Dev server URL: http://localhost:5173
- Frontend dev command: npm run dev:react
- Frontend build command: npm run build

---

### Phase 2: Backend Migration (16-24 hours)

#### 2.1 File System Operations (Rust)

**Current Electron Code (electron/main.js):**
```javascript
ipcMain.handle('load-notes', async () => {
  const data = await fs.readFile(notesPath, 'utf-8');
  return JSON.parse(data);
});

ipcMain.handle('save-notes', async (event, notes) => {
  await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
  return { success: true };
});
```

**New Tauri Code (src-tauri/src/main.rs):**
```rust
use tauri::command;
use std::fs;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Note {
    id: String,
    title: String,
    content: String,
    tags: Vec<String>,
    created_at: String,
    updated_at: String,
}

#[command]
fn load_notes(app_handle: tauri::AppHandle) -> Result<Vec<Note>, String> {
    let app_dir = app_handle.path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    let notes_path = app_dir.join("notes.json");
    
    if !notes_path.exists() {
        return Ok(Vec::new());
    }
    
    let data = fs::read_to_string(notes_path)
        .map_err(|e| e.to_string())?;
    
    let notes: Vec<Note> = serde_json::from_str(&data)
        .map_err(|e| e.to_string())?;
    
    Ok(notes)
}

#[command]
fn save_notes(app_handle: tauri::AppHandle, notes: Vec<Note>) -> Result<(), String> {
    let app_dir = app_handle.path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    fs::create_dir_all(&app_dir)
        .map_err(|e| e.to_string())?;
    
    let notes_path = app_dir.join("notes.json");
    let json = serde_json::to_string_pretty(&notes)
        .map_err(|e| e.to_string())?;
    
    fs::write(notes_path, json)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_notes, save_notes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### 2.2 Environment Variables (Rust)

**Current Electron Code:**
```javascript
ipcMain.handle('get-env', async (event, key) => {
  return process.env[key] || null;
});
```

**New Tauri Code:**
```rust
#[command]
fn get_env(key: String) -> Option<String> {
    std::env::var(key).ok()
}

// Add to invoke_handler:
.invoke_handler(tauri::generate_handler![
    load_notes, 
    save_notes, 
    get_env
])
```

---

### Phase 3: Frontend Migration (12-20 hours)

#### 3.1 Update IPC Calls

**Current Electron API (src/components/AINotesApp.jsx):**
```javascript
// Load notes
if (window.electronAPI) {
  const loadedNotes = await window.electronAPI.loadNotes();
  setNotes(loadedNotes);
}

// Save notes
if (window.electronAPI) {
  await window.electronAPI.saveNotes(notes);
}

// Get environment variable
const key = await window.electronAPI.getEnv('VITE_GEMINI_API_KEY');
```

**New Tauri API:**
```javascript
import { invoke } from '@tauri-apps/api/tauri';

// Load notes
const loadedNotes = await invoke('load_notes');
setNotes(loadedNotes);

// Save notes
await invoke('save_notes', { notes });

// Get environment variable
const key = await invoke('get_env', { key: 'VITE_GEMINI_API_KEY' });
```

#### 3.2 Remove Electron-Specific Code

**Files to Update:**
1. `src/components/AINotesApp.jsx` - Replace all `window.electronAPI` calls
2. `electron/preload.js` - DELETE (not needed in Tauri)
3. `electron/main.js` - DELETE (replaced by Rust code)

#### 3.3 Update Fallback Logic

**Before:**
```javascript
if (window.electronAPI) {
  // Electron code
} else {
  // Browser fallback
}
```

**After:**
```javascript
import { invoke } from '@tauri-apps/api/tauri';

try {
  // Tauri code
  const notes = await invoke('load_notes');
} catch (error) {
  // Browser fallback
  const savedNotes = localStorage.getItem("ai-notes");
}
```

---

### Phase 4: Configuration Updates (4-6 hours)

#### 4.1 Update package.json

**Remove:**
```json
{
  "main": "electron/main.js",
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1",
    "concurrently": "^8.2.2",
    "wait-on": "^7.2.0"
  }
}
```

**Add:**
```json
{
  "devDependencies": {
    "@tauri-apps/cli": "^1.5.0"
  },
  "dependencies": {
    "@tauri-apps/api": "^1.5.0"
  },
  "scripts": {
    "dev": "tauri dev",
    "build": "tauri build",
    "build:mac": "tauri build --target universal-apple-darwin",
    "build:linux": "tauri build --target x86_64-unknown-linux-gnu"
  }
}
```

#### 4.2 Create tauri.conf.json

```json
{
  "build": {
    "beforeDevCommand": "npm run dev:react",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "AI Notes",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "createDir": true,
        "scope": ["$APPDATA/*"]
      },
      "path": {
        "all": true
      }
    },
    "bundle": {
      "active": true,
      "category": "Productivity",
      "copyright": "",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.ainotes.app",
      "longDescription": "",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 900,
        "resizable": true,
        "title": "AI Notes",
        "width": 1400,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

#### 4.3 Create Cargo.toml (src-tauri/)

```toml
[package]
name = "ai-notes"
version = "1.0.0"
description = "AI-powered note-taking application"
authors = ["Erik Peterson"]
license = "MIT"
repository = ""
edition = "2021"

[build-dependencies]
tauri-build = { version = "1.5", features = [] }

[dependencies]
tauri = { version = "1.5", features = ["shell-open"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
```

---

### Phase 5: Icon Generation (2-3 hours)

#### 5.1 Create Icons

Tauri requires multiple icon sizes:
- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.icns (macOS)
- icon.ico (Windows)

**Use existing create-icons.js or:**
```bash
npm install --save-dev @tauri-apps/cli
npx tauri icon path/to/source-icon.png
```

---

### Phase 6: Testing (8-12 hours)

#### 6.1 Development Testing
```bash
npm run dev
```

**Test:**
- [ ] Application launches
- [ ] UI renders correctly
- [ ] Notes can be created
- [ ] Notes can be edited
- [ ] Notes can be deleted
- [ ] Notes persist after restart
- [ ] AI features work
- [ ] Voice recording works
- [ ] Import/export works

#### 6.2 Build Testing
```bash
npm run build
```

**Test:**
- [ ] Build completes successfully
- [ ] Bundle size is reasonable
- [ ] Application runs from built package
- [ ] All features work in production build

#### 6.3 Platform Testing
- [ ] Test on Linux (multiple distributions)
- [ ] Test on macOS
- [ ] Test on Windows (if targeting)

---

### Phase 7: Documentation Updates (2-4 hours)

#### 7.1 Update README.md

**Changes:**
- Replace Electron references with Tauri
- Update installation instructions
- Update build commands
- Update system requirements
- Add Rust installation steps

#### 7.2 Update Other Documentation

- INSTALLATION_GUIDE.md
- QUICKSTART.md
- BUILD_PROCESS_TEST_RESULTS.md
- Any other Electron-specific docs

---

## File Structure After Migration

```
AIAPP/
├── src/                          # React frontend (unchanged)
│   ├── components/
│   │   ├── AINotesApp.jsx       # Updated IPC calls
│   │   └── ui/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── src-tauri/                    # NEW: Tauri backend
│   ├── src/
│   │   └── main.rs              # Rust backend code
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri configuration
│   ├── build.rs                 # Build script
│   └── icons/                   # App icons
├── dist/                         # Vite build output
├── package.json                  # Updated scripts
├── vite.config.js               # Unchanged
├── tailwind.config.js           # Unchanged
└── README.md                     # Updated documentation
```

**Deleted:**
- electron/ directory
- electron-builder configuration

---

## Step-by-Step Migration Checklist

### Preparation
- [ ] Backup entire project
- [ ] Create new git branch: `git checkout -b tauri-migration`
- [ ] Install Rust
- [ ] Install Tauri CLI

### Backend
- [ ] Initialize Tauri project
- [ ] Create Rust backend (main.rs)
- [ ] Implement load_notes command
- [ ] Implement save_notes command
- [ ] Implement get_env command
- [ ] Test Rust code compiles

### Frontend
- [ ] Install @tauri-apps/api
- [ ] Update AINotesApp.jsx IPC calls
- [ ] Remove Electron-specific code
- [ ] Update error handling
- [ ] Test in development mode

### Configuration
- [ ] Update package.json
- [ ] Create tauri.conf.json
- [ ] Create Cargo.toml
- [ ] Generate icons
- [ ] Configure build settings

### Testing
- [ ] Test development mode
- [ ] Test all features
- [ ] Build for Linux
- [ ] Test Linux build
- [ ] Build for macOS (if available)
- [ ] Test macOS build

### Documentation
- [ ] Update README.md
- [ ] Update INSTALLATION_GUIDE.md
- [ ] Update build documentation
- [ ] Create migration notes
- [ ] Update system requirements

### Deployment
- [ ] Test final builds
- [ ] Create release notes
- [ ] Update version numbers
- [ ] Tag release in git
- [ ] Distribute packages

---

## Expected Results

### Bundle Sizes
- **Before (Electron):** 114 MB AppImage
- **After (Tauri):** ~5-10 MB (estimated)

### Performance
- **Startup Time:** Faster (no Chromium initialization)
- **Memory Usage:** Lower (uses system WebView)
- **CPU Usage:** Lower (more efficient)

### Compatibility
- **Linux:** Should work on more distributions (no `/dev/shm` issue)
- **macOS:** Native WebView integration
- **Windows:** Native WebView integration

---

## Risks & Mitigation

### Risk 1: Rust Learning Curve
**Mitigation:** Start with simple file operations, use provided code examples

### Risk 2: API Differences
**Mitigation:** Thorough testing, maintain feature parity checklist

### Risk 3: Platform-Specific Issues
**Mitigation:** Test on multiple platforms early, have fallback plans

### Risk 4: Time Overrun
**Mitigation:** Break into phases, test incrementally, prioritize core features

---

## Resources

### Official Documentation
- Tauri Docs: https://tauri.app/
- Tauri API: https://tauri.app/v1/api/js/
- Rust Book: https://doc.rust-lang.org/book/

### Migration Guides
- Electron to Tauri: https://tauri.app/v1/guides/migration/from-electron
- Tauri Examples: https://github.com/tauri-apps/tauri/tree/dev/examples

### Community
- Tauri Discord: https://discord.com/invite/tauri
- GitHub Discussions: https://github.com/tauri-apps/tauri/discussions

---

## Timeline Estimate

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Setup & Prerequisites | 4-8 |
| 2 | Backend Migration | 16-24 |
| 3 | Frontend Migration | 12-20 |
| 4 | Configuration | 4-6 |
| 5 | Icon Generation | 2-3 |
| 6 | Testing | 8-12 |
| 7 | Documentation | 2-4 |
| **Total** | | **48-77 hours** |

**Recommended Schedule:**
- Week 1: Phases 1-2 (Setup + Backend)
- Week 2: Phases 3-4 (Frontend + Config)
- Week 3: Phases 5-7 (Icons + Testing + Docs)

---

## Success Criteria

✅ Application launches without crashes  
✅ All features work as before  
✅ Bundle size reduced significantly  
✅ Performance improved  
✅ Works on multiple Linux distributions  
✅ Documentation updated  
✅ Tests passing  

---

## Next Steps

1. **Review this plan** and adjust timeline/scope as needed
2. **Set up development environment** (install Rust, Tauri CLI)
3. **Create backup** of current Electron version
4. **Start Phase 1** when ready to begin migration

---

**Note:** This is a significant undertaking. Consider whether the benefits outweigh the development time, or if documenting system requirements (Option 1) might be more practical for your use case.
