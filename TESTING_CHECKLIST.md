# Testing Checklist - AI Notes Electron App

Use this checklist to thoroughly test the application before distribution.

## 📋 Pre-Testing Setup

### Environment Check
- [ ] Node.js installed (v16+)
- [ ] npm or yarn available
- [ ] Terminal/command line access
- [ ] Microphone available (for voice testing)
- [ ] Internet connection (for AI features)

### Initial Setup
```bash
cd AIAPP
./setup.sh
# Or manually:
# npm install
# cp .env.example .env
```

- [ ] Dependencies installed successfully
- [ ] No installation errors
- [ ] `.env` file created
- [ ] API key added to `.env` file

---

## 🧪 Testing Phases

## Phase 1: Development Mode Testing

### 1.1 Launch Application
```bash
npm run dev
```

**Expected Results:**
- [ ] Vite dev server starts on http://localhost:5173
- [ ] Electron window opens automatically
- [ ] No console errors in terminal
- [ ] App UI loads completely
- [ ] Window is responsive and resizable

**Common Issues:**
- Port 5173 already in use → Kill the process or change port in vite.config.js
- Electron doesn't launch → Check electron installation
- Blank screen → Check browser console (F12) for errors

### 1.2 Hot Reload Test
- [ ] Make a small change to `src/components/AINotesApp.jsx`
- [ ] Save the file
- [ ] App updates automatically without full restart
- [ ] No errors after hot reload

---

## Phase 2: Core Functionality Testing

### 2.1 Note Creation & Management

**Create Note:**
- [ ] Click "New Note" button
- [ ] New note appears in sidebar
- [ ] Note has default title "Untitled Note"
- [ ] Note is automatically selected
- [ ] Empty editor appears on right side

**Edit Note:**
- [ ] Click on note title field
- [ ] Change title to "Test Note 1"
- [ ] Title updates in sidebar immediately
- [ ] Click in content area
- [ ] Type some text (e.g., "This is a test note with some content.")
- [ ] Content saves automatically
- [ ] "Last saved" timestamp updates

**Multiple Notes:**
- [ ] Create 3-5 notes with different titles
- [ ] Each note appears in sidebar
- [ ] Click different notes to switch between them
- [ ] Content persists when switching notes
- [ ] Most recently updated note appears at top

**Delete Note:**
- [ ] Click trash icon on a note
- [ ] Note is removed from sidebar
- [ ] Next note is automatically selected
- [ ] Deleted note's content is gone

### 2.2 Search Functionality

**Search by Title:**
- [ ] Create notes with titles: "Meeting Notes", "Project Ideas", "Shopping List"
- [ ] Type "meeting" in search box
- [ ] Only "Meeting Notes" appears
- [ ] Clear search
- [ ] All notes reappear

**Search by Content:**
- [ ] Add content to notes with specific keywords
- [ ] Search for a keyword that appears in content
- [ ] Correct notes are filtered
- [ ] Search is case-insensitive

**Empty Search:**
- [ ] Clear search box
- [ ] All notes are visible again

### 2.3 Tag Management

**Add Tags:**
- [ ] Select a note
- [ ] Type "work" in tag input field
- [ ] Press Enter or click + button
- [ ] Tag appears on the note
- [ ] Tag appears in filter section
- [ ] Add multiple tags: "urgent", "personal"
- [ ] All tags display correctly

**Remove Tags:**
- [ ] Click X on a tag
- [ ] Tag is removed from note
- [ ] If no other notes have that tag, it disappears from filter

**Filter by Tags:**
- [ ] Create notes with different tags
- [ ] Click a tag in filter section
- [ ] Only notes with that tag are shown
- [ ] Tag filter button is highlighted
- [ ] Click tag again to deselect
- [ ] All notes reappear

**Multiple Tag Filters:**
- [ ] Select multiple tags
- [ ] Notes with ANY of the selected tags appear (OR logic)
- [ ] Clear all tag filters
- [ ] All notes visible

---

## Phase 3: AI Features Testing

### 3.1 API Key Validation

**Check API Key:**
- [ ] Open `.env` file
- [ ] Verify `VITE_GEMINI_API_KEY` is set
- [ ] Key should start with "AIza"
- [ ] No extra spaces or quotes

**Without API Key:**
- [ ] Remove or comment out API key in `.env`
- [ ] Restart app (`npm run dev`)
- [ ] Try to summarize a note
- [ ] Should show error: "API key not configured"
- [ ] Restore API key for remaining tests

### 3.2 Note Summarization

**Basic Summarization:**
- [ ] Create a note with substantial content (200+ words)
- [ ] Click "Summarize" button
- [ ] Button shows "Summarizing..." state
- [ ] Wait for response (5-10 seconds)
- [ ] New note created with title "Summary: [original title]"
- [ ] Summary note contains condensed version
- [ ] Summary note has "ai-summary" tag
- [ ] Original note is unchanged

**Edge Cases:**
- [ ] Try to summarize empty note → Button should be disabled
- [ ] Try to summarize very short note (1 sentence) → Should still work
- [ ] Summarize note with special characters → Should handle correctly

**Error Handling:**
- [ ] Disconnect internet
- [ ] Try to summarize
- [ ] Should show error message
- [ ] Reconnect and try again → Should work

### 3.3 AI Content Generation

**Generate Content:**
- [ ] Click "Generate with AI" button
- [ ] Prompt appears: "What would you like AI to help you write about?"
- [ ] Enter prompt: "Write a short poem about coding"
- [ ] Click OK
- [ ] Button shows "Summarizing..." state
- [ ] Wait for response
- [ ] New note created with prompt as title (truncated if long)
- [ ] Note contains AI-generated content
- [ ] Note has "ai-generated" tag

**Different Prompts:**
- [ ] Try: "Explain quantum computing in simple terms"
- [ ] Try: "Create a shopping list for a picnic"
- [ ] Try: "Write a professional email template"
- [ ] All should generate appropriate content

**Cancel Generation:**
- [ ] Click "Generate with AI"
- [ ] Click Cancel in prompt
- [ ] No new note created
- [ ] No errors

### 3.4 System Prompt Customization

**View System Prompt:**
- [ ] Click "System Prompt" button (chevron icon)
- [ ] Textarea expands showing current system prompt
- [ ] Default prompt is visible

**Modify System Prompt:**
- [ ] Change prompt to: "You are a creative writer. Be poetic and descriptive."
- [ ] Click "System Prompt" to collapse
- [ ] Generate new content or summarize
- [ ] Output should reflect new style
- [ ] Restore default prompt after testing

---

## Phase 4: Voice Recording Testing

### 4.1 Voice Note Creation

**First Time Setup:**
- [ ] Click "Voice Note" button
- [ ] Browser requests microphone permission
- [ ] Grant permission
- [ ] Button changes to "Stop Recording" (red)
- [ ] Microphone icon changes to MicOff

**Record New Note:**
- [ ] Click "Voice Note"
- [ ] Speak clearly: "This is a test voice note"
- [ ] Click "Stop Recording"
- [ ] New note created with title "Voice Note"
- [ ] Content contains transcribed text
- [ ] Note has "voice-note" tag
- [ ] Transcription is reasonably accurate

**Append to Existing Note:**
- [ ] Select an existing note
- [ ] Click "Voice Note"
- [ ] Speak: "Adding more content via voice"
- [ ] Click "Stop Recording"
- [ ] Text is appended to existing note (with line breaks)
- [ ] Original content is preserved

**Error Cases:**
- [ ] Deny microphone permission → Should show error message
- [ ] Speak very quietly → May not transcribe well (expected)
- [ ] Background noise → May affect accuracy (expected)

### 4.2 Browser Compatibility

**Chrome/Edge (Best Support):**
- [ ] Voice recording works smoothly
- [ ] Good transcription accuracy
- [ ] No console errors

**Firefox:**
- [ ] May not support SpeechRecognition
- [ ] Should show "not supported" message

**Safari:**
- [ ] Limited support
- [ ] May require webkit prefix

---

## Phase 5: Data Persistence Testing

### 5.1 Auto-Save Verification

**During Session:**
- [ ] Create a note
- [ ] Type content
- [ ] Observe "Last saved" timestamp updates
- [ ] No manual save button needed
- [ ] Changes persist immediately

**After Restart:**
- [ ] Create several notes with content
- [ ] Note the "Last saved" time
- [ ] Close the app (Cmd/Ctrl+Q or close window)
- [ ] Reopen app (`npm run dev`)
- [ ] All notes are present
- [ ] All content is intact
- [ ] Tags are preserved
- [ ] Note order is maintained

### 5.2 File Storage Location

**Electron Storage:**
```bash
# macOS
~/Library/Application Support/ai-notes-app/notes.json

# Linux
~/.config/ai-notes-app/notes.json
```

- [ ] Navigate to storage location
- [ ] `notes.json` file exists
- [ ] File contains JSON array of notes
- [ ] File updates when notes change
- [ ] File is human-readable

**Browser Fallback:**
- [ ] Open app in browser (http://localhost:5173)
- [ ] Create notes
- [ ] Open browser DevTools → Application → Local Storage
- [ ] "ai-notes" key exists with JSON data

---

## Phase 6: Import/Export Testing

### 6.1 Export Notes

**Export Functionality:**
- [ ] Create 3-5 notes with various content
- [ ] Click download icon (Export button)
- [ ] File download starts
- [ ] File name format: `notes-[timestamp].json`
- [ ] Open downloaded file
- [ ] Valid JSON format
- [ ] All notes present with complete data
- [ ] Includes: id, title, content, tags, timestamps

### 6.2 Import Notes

**Import Valid File:**
- [ ] Click upload icon (Import button)
- [ ] Select previously exported JSON file
- [ ] File uploads successfully
- [ ] Alert: "Notes imported successfully!"
- [ ] Imported notes appear in sidebar
- [ ] Existing notes are preserved (not replaced)
- [ ] No duplicate IDs cause issues

**Import Invalid File:**
- [ ] Try to import a text file (.txt)
- [ ] Should show error: "Invalid file format"
- [ ] Try to import malformed JSON
- [ ] Should show error message
- [ ] App remains stable

**Import Empty File:**
- [ ] Create empty JSON array: `[]`
- [ ] Import it
- [ ] Should handle gracefully
- [ ] No errors

---

## Phase 7: UI/UX Testing

### 7.1 Responsive Design

**Window Resizing:**
- [ ] Resize window to minimum size
- [ ] Sidebar remains visible
- [ ] Editor area adjusts
- [ ] No content overflow
- [ ] Scrollbars appear when needed

**Large Window:**
- [ ] Maximize window
- [ ] Layout scales appropriately
- [ ] No awkward spacing
- [ ] Content remains readable

### 7.2 Visual Elements

**Sidebar:**
- [ ] Notes list scrolls smoothly
- [ ] Selected note is highlighted
- [ ] Hover effects work on notes
- [ ] Delete button appears on hover
- [ ] Tags display correctly

**Editor:**
- [ ] Title input is prominent
- [ ] Content area is spacious
- [ ] Buttons are clearly labeled
- [ ] Icons are recognizable
- [ ] Colors are consistent

**Empty States:**
- [ ] With no notes: Shows "No note selected" message
- [ ] Message is centered and clear
- [ ] "Create New Note" button is prominent

### 7.3 Interactions

**Keyboard Navigation:**
- [ ] Tab through interactive elements
- [ ] Focus indicators are visible
- [ ] Enter key works in tag input
- [ ] Keyboard shortcuts work (if any)

**Mouse Interactions:**
- [ ] All buttons respond to clicks
- [ ] Hover states are visible
- [ ] Cursor changes appropriately
- [ ] No double-click issues

---

## Phase 8: Build & Distribution Testing

### 8.1 Production Build

**Build for macOS:**
```bash
npm run build:mac
```

- [ ] Build completes without errors
- [ ] Output directory: `dist-electron/`
- [ ] `.dmg` file created
- [ ] `.app.zip` file created
- [ ] File sizes are reasonable (50-150 MB)

**Build for Linux:**
```bash
npm run build:linux
```

- [ ] Build completes without errors
- [ ] `.AppImage` file created
- [ ] `.deb` file created
- [ ] Files are in `dist-electron/`

### 8.2 Built App Testing

**macOS (.dmg):**
- [ ] Open .dmg file
- [ ] Drag app to Applications
- [ ] Launch app from Applications
- [ ] App opens without errors
- [ ] All features work as in dev mode
- [ ] No console errors (check with Console.app)

**Linux (.AppImage):**
```bash
chmod +x "AI Notes-*.AppImage"
./"AI Notes-*.AppImage"
```

- [ ] AppImage runs without installation
- [ ] App launches successfully
- [ ] All features functional
- [ ] Notes persist between sessions

**Linux (.deb):**
```bash
sudo dpkg -i ai-notes-app_*.deb
```

- [ ] Package installs successfully
- [ ] App appears in application menu
- [ ] Launch from menu works
- [ ] Desktop integration works

### 8.3 Standalone Verification

**No Node.js Required:**
- [ ] Test on machine without Node.js
- [ ] Built app runs independently
- [ ] All features work
- [ ] No dependency errors

**Fresh Install:**
- [ ] Install on clean system
- [ ] First launch works
- [ ] Creates data directory
- [ ] No configuration needed

---

## Phase 9: Error Handling & Edge Cases

### 9.1 Network Issues

**Offline Mode:**
- [ ] Disconnect internet
- [ ] App still launches
- [ ] Can create/edit notes
- [ ] AI features show appropriate errors
- [ ] Voice recording may still work (browser-dependent)

**Slow Connection:**
- [ ] Throttle network speed
- [ ] AI requests take longer
- [ ] Loading states are visible
- [ ] No timeout errors (or handled gracefully)

### 9.2 Data Corruption

**Invalid JSON:**
- [ ] Manually corrupt `notes.json` file
- [ ] Restart app
- [ ] Should handle gracefully
- [ ] May reset to empty state
- [ ] No crash

**Missing File:**
- [ ] Delete `notes.json`
- [ ] Restart app
- [ ] Creates new empty file
- [ ] Starts with no notes
- [ ] No errors

### 9.3 Resource Limits

**Many Notes:**
- [ ] Create 50+ notes
- [ ] App remains responsive
- [ ] Search still works
- [ ] Scrolling is smooth
- [ ] No memory leaks

**Large Content:**
- [ ] Create note with 10,000+ words
- [ ] Editor handles it
- [ ] Save works
- [ ] No performance issues

**Many Tags:**
- [ ] Add 20+ tags to a note
- [ ] UI handles overflow
- [ ] Filter section scrolls
- [ ] No layout breaks

---

## Phase 10: Security & Privacy

### 10.1 API Key Security

**Environment Variables:**
- [ ] API key not visible in built app
- [ ] `.env` file not included in distribution
- [ ] Key loaded securely via Electron IPC
- [ ] No key in browser DevTools

**Git Security:**
- [ ] `.env` in `.gitignore`
- [ ] `.env` not in version control
- [ ] `.env.example` has placeholder only

### 10.2 Data Privacy

**Local Storage:**
- [ ] Notes stored locally only
- [ ] No cloud sync (unless implemented)
- [ ] User data not transmitted (except to Gemini API)
- [ ] File permissions are appropriate

---

## 📊 Test Results Summary

### Pass/Fail Criteria

**Critical (Must Pass):**
- [ ] App launches successfully
- [ ] Notes can be created and edited
- [ ] Data persists between sessions
- [ ] Built app runs standalone
- [ ] No data loss

**Important (Should Pass):**
- [ ] AI features work with valid API key
- [ ] Search and filter work correctly
- [ ] Import/export functions properly
- [ ] UI is responsive and intuitive

**Nice to Have:**
- [ ] Voice recording works
- [ ] All edge cases handled
- [ ] Performance is optimal
- [ ] No console warnings

### Issues Found

Document any issues discovered:

| Issue | Severity | Steps to Reproduce | Status |
|-------|----------|-------------------|--------|
| Example: Button not clickable | High | 1. Click X, 2. ... | Fixed |
|       |          |                   |        |

---

## ✅ Final Checklist Before Distribution

- [ ] All critical tests passed
- [ ] No data loss scenarios
- [ ] API key is secure
- [ ] Documentation is complete
- [ ] README.md is accurate
- [ ] QUICKSTART.md is tested
- [ ] Build process is documented
- [ ] Known issues are documented
- [ ] Version number is set
- [ ] License is included

---

## 🎯 Quick Test (5 Minutes)

If time is limited, run this minimal test:

1. [ ] `cd AIAPP && npm install`
2. [ ] `npm run dev`
3. [ ] Create a note, add content
4. [ ] Restart app, verify note persists
5. [ ] Try AI summarization (with API key)
6. [ ] `npm run build:mac` or `build:linux`
7. [ ] Run built app, verify it works

If all pass, app is ready for basic use!

---

**Testing completed by:** _______________  
**Date:** _______________  
**Platform tested:** macOS / Linux / Both  
**Overall result:** Pass / Fail / Needs Work
