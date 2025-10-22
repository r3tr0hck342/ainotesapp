# Privacy Policy - AI Notes App

**Last Updated:** December 2024

## Overview

AI Notes is a desktop application that prioritizes your privacy. This document explains how your data is handled.

## Data Collection

**We DO NOT collect, store, or transmit any personal data to our servers.**

### What Data is Stored Locally

- **Your Notes:** All notes are stored locally on your device in:
  - **macOS:** `~/Library/Application Support/ai-notes-app/notes.json`
  - **Linux:** `~/.config/ai-notes-app/notes.json`
- **Application Settings:** Stored in the same directory
- **No Cloud Sync:** Your data never leaves your device (except when using AI features - see below)

### Third-Party Services

#### Google Gemini AI (Optional)

When you use AI features (Summarize, Generate with AI):
- **What is sent:** The content of your note or your prompt
- **Who receives it:** Google's Gemini AI API
- **Why:** To generate summaries or AI content
- **Your control:** You must provide your own API key. AI features don't work without it.
- **Google's Privacy Policy:** https://policies.google.com/privacy

**Important:** 
- Only the specific note content you choose to summarize is sent to Google
- Your API key is stored locally in your `.env` file
- We do not have access to your API key or the content you send to Google

#### Voice Recording (Optional)

When you use voice recording:
- **Technology:** Browser's built-in Web Speech API
- **Processing:** Done locally by your browser (Chrome/Edge)
- **No external servers:** Voice data is not sent to our servers
- **Browser's handling:** May be sent to browser vendor's speech recognition service
- **Your control:** You must grant microphone permission

## Data Security

### Local Storage
- Notes are stored in plain text JSON format
- File permissions are set by your operating system
- No encryption at rest (you can encrypt your disk for additional security)

### API Key Security
- Your Gemini API key is stored in `.env` file
- Never commit `.env` to version control
- Keep your API key private
- Treat it like a password

### Network Security
- HTTPS used for all API communications
- No telemetry or analytics
- No crash reporting to external servers
- No automatic updates that phone home

## Your Rights

You have complete control over your data:
- **Access:** All your data is in plain JSON files you can read
- **Export:** Use the built-in export feature to backup your notes
- **Delete:** Delete the application and its data directory to remove all traces
- **Portability:** Export your notes as JSON and import them elsewhere

## Third-Party Dependencies

This app uses open-source libraries. None of them collect or transmit your data:
- React (UI framework)
- Electron (Desktop framework)
- Tailwind CSS (Styling)
- Lucide React (Icons)

## Changes to This Policy

We may update this privacy policy. Changes will be reflected in the app's documentation.

## Contact

For privacy concerns or questions:
- GitHub Issues: https://github.com/yourusername/ai-notes-app/issues
- Email: r3tr0hac@pm.me

## Summary

✅ Your notes stay on your device  
✅ No tracking or analytics  
✅ No automatic data collection  
✅ You control what is sent to AI services  
✅ Open source - you can verify our claims  

❌ We don't collect your data  
❌ We don't have access to your notes  
❌ We don't track your usage  
❌ We don't sell your data (we don't have it!)
