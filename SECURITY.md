# Security Policy

## Overview

AI Notes takes security seriously. This document outlines our security practices, how to report vulnerabilities, and what users can expect.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Features

### Application Security

✅ **Context Isolation Enabled**
- Renderer process is isolated from Node.js
- Prevents malicious code from accessing system resources
- IPC communication through secure preload script

✅ **Node Integration Disabled**
- Renderer process cannot directly access Node.js APIs
- Reduces attack surface
- Follows Electron security best practices

✅ **Content Security Policy**
- Restricts resource loading
- Prevents XSS attacks
- Enforces secure content sources

✅ **Secure IPC Communication**
- All Electron IPC uses `contextBridge`
- Exposed APIs are explicitly whitelisted
- No direct access to main process

### Data Security

✅ **Local-First Storage**
- All notes stored locally on your device
- No cloud sync (unless you explicitly export)
- You control your data

✅ **No Telemetry**
- No usage tracking
- No crash reporting to external servers
- No analytics collection

✅ **API Key Protection**
- API keys stored in `.env` file (not in code)
- `.env` excluded from version control
- Keys never transmitted except to intended API

### Network Security

✅ **HTTPS Only**
- All external API calls use HTTPS
- No unencrypted data transmission
- Certificate validation enabled

✅ **Minimal External Dependencies**
- Only essential third-party libraries
- Regular dependency audits
- Known vulnerabilities patched promptly

## Known Security Considerations

### ⚠️ Unsigned Application (macOS)

**Issue:** The macOS app is not code-signed with an Apple Developer certificate.

**Impact:** 
- macOS Gatekeeper will block the app on first launch
- Users must manually approve the app

**Mitigation:**
- Users can verify the source code (open source)
- Follow installation instructions in README.md
- Use `xattr -cr` to remove quarantine attribute

**Why:** Code signing requires a paid Apple Developer account ($99/year). This is a free, open-source project.

**Future:** We may implement code signing if funding becomes available.

### ⚠️ API Key Storage

**Issue:** Gemini API key stored in plain text `.env` file.

**Impact:**
- Anyone with file system access can read your API key
- Compromised key could lead to unauthorized API usage

**Mitigation:**
- Keep your `.env` file secure
- Don't share your API key
- Use API key restrictions in Google Cloud Console
- Rotate keys if compromised
- Consider disk encryption for additional security

**Best Practices:**
```bash
# Set restrictive permissions on .env file
chmod 600 .env

# Never commit .env to version control
# (already in .gitignore)
```

### ⚠️ Third-Party AI Service

**Issue:** AI features send note content to Google's Gemini API.

**Impact:**
- Google processes your note content
- Subject to Google's privacy policy
- Requires internet connection

**Mitigation:**
- Only use AI features on non-sensitive notes
- Review Google's privacy policy
- AI features are optional (app works without them)
- You control what content is sent

**Alternative:** Future versions may support local AI models.

### ⚠️ Voice Recording

**Issue:** Voice recording uses browser's Web Speech API.

**Impact:**
- Audio may be sent to browser vendor's servers
- Requires microphone permission
- Privacy depends on browser implementation

**Mitigation:**
- Voice recording is optional
- Review your browser's privacy policy
- Use offline speech recognition if available
- Deny microphone permission if concerned

## Security Best Practices for Users

### 1. Protect Your API Key
```bash
# Good: Restrict API key in Google Cloud Console
- Set application restrictions
- Set API restrictions (only Gemini API)
- Set quota limits

# Bad: Share your API key
- Don't commit to GitHub
- Don't share in screenshots
- Don't post in public forums
```

### 2. Secure Your Device
```bash
# Enable disk encryption
- macOS: FileVault
- Linux: LUKS

# Use strong passwords
# Keep OS updated
# Use firewall
```

### 3. Regular Backups
```bash
# Export your notes regularly
- Use built-in export feature
- Store backups securely
- Test restore process
```

### 4. Verify Downloads
```bash
# Check file integrity (when available)
sha256sum AI-Notes-1.0.0.dmg

# Download from official sources only
- GitHub Releases
- Official website
```

## Reporting a Vulnerability

### How to Report

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. **Email:** r3tr0hac@pm.me (or create a private security advisory on GitHub)
3. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 1 week
- **Status Updates:** Every week until resolved
- **Fix Timeline:** Depends on severity
  - Critical: 1-7 days
  - High: 1-4 weeks
  - Medium: 1-3 months
  - Low: Next release

### Disclosure Policy

- We follow coordinated disclosure
- Security fixes released ASAP
- Public disclosure after fix is available
- Credit given to reporter (if desired)

## Security Checklist for Developers

If you're contributing to AI Notes:

- [ ] Run `npm audit` before committing
- [ ] Never commit `.env` files
- [ ] Use `contextBridge` for IPC
- [ ] Validate all user inputs
- [ ] Sanitize data before rendering
- [ ] Use HTTPS for all external requests
- [ ] Follow Electron security guidelines
- [ ] Test with Content Security Policy
- [ ] Review dependencies for vulnerabilities
- [ ] Document security implications of changes

## Security Audits

### Self-Audits
- Regular dependency updates
- Code reviews for security issues
- Testing with security tools

### External Audits
- Not yet conducted (open source project)
- Community contributions welcome
- Professional audit planned for v2.0

## Compliance

### Data Protection
- **GDPR:** Compliant (no personal data collected)
- **CCPA:** Compliant (no personal data sold)
- **COPPA:** Compliant (no data from children)

### Open Source
- **License:** MIT (permissive)
- **Source Code:** Publicly available
- **Transparency:** All code can be audited

## Security Resources

### For Users
- [Electron Security Guide](https://www.electronjs.org/docs/latest/tutorial/security)
- [Google Gemini Privacy](https://policies.google.com/privacy)
- [Web Speech API Privacy](https://wicg.github.io/speech-api/)

### For Developers
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Contact

- **Security Issues:** r3tr0hac@pm.me
- **General Issues:** https://github.com/yourusername/ai-notes-app/issues
- **Discussions:** https://github.com/yourusername/ai-notes-app/discussions

---

**Last Updated:** December 2024

**Note:** This is a living document and will be updated as the project evolves.
