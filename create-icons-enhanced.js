#!/usr/bin/env node

/**
 * Enhanced Icon Generator for AI Notes App
 * Creates production-ready icons in all required formats
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

console.log('Creating production-ready application icons...\n');

// Create SVG icon (vector format - best quality)
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E0E7FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#bgGradient)"/>
  <text x="256" y="340" font-family="Arial, sans-serif" font-size="280" font-weight="bold" 
        text-anchor="middle" fill="url(#textGradient)">AI</text>
  <circle cx="380" cy="140" r="20" fill="#FBBF24" opacity="0.9"/>
  <circle cx="380" cy="140" r="12" fill="#FEF3C7"/>
  <rect x="100" y="420" width="120" height="8" rx="4" fill="#FFFFFF" opacity="0.3"/>
  <rect x="100" y="445" width="180" height="8" rx="4" fill="#FFFFFF" opacity="0.3"/>
  <rect x="100" y="470" width="150" height="8" rx="4" fill="#FFFFFF" opacity="0.3"/>
</svg>`;

fs.writeFileSync(path.join(buildDir, 'icon.svg'), svgContent);
console.log('✓ Created icon.svg (vector format)');

// Try to use sharp for PNG conversion
let sharp;
try {
  sharp = require('sharp');
  console.log('✓ Using sharp for high-quality PNG generation\n');
  createPNGsWithSharp();
} catch (err) {
  console.log('⚠ sharp not available, using SVG as fallback\n');
  createFallbackIcons();
}

async function createPNGsWithSharp() {
  try {
    const svgBuffer = Buffer.from(svgContent);
    
    // Create 1024x1024 PNG
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(buildDir, 'icon-1024.png'));
    console.log('✓ Created icon-1024.png (1024x1024)');

    // Create 512x512 PNG
    await sharp(svgBuffer)
      .resize(512, 512)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(buildDir, 'icon.png'));
    console.log('✓ Created icon.png (512x512)');

    // Create 256x256 PNG
    await sharp(svgBuffer)
      .resize(256, 256)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(buildDir, 'icon-256.png'));
    console.log('✓ Created icon-256.png (256x256)');

    // Create macOS iconset
    await createMacOSIconset(svgBuffer);
    
    console.log('\n✓ All icons created successfully!');
    console.log('\nCreated files:');
    console.log('  - build/icon.svg (vector)');
    console.log('  - build/icon.png (512x512)');
    console.log('  - build/icon-256.png (256x256)');
    console.log('  - build/icon-1024.png (1024x1024)');
    console.log('  - build/icon.icns (macOS)');
    console.log('  - build/icon.iconset/ (macOS iconset directory)');
  } catch (err) {
    console.error('✗ Error creating PNGs:', err.message);
    createFallbackIcons();
  }
}

async function createMacOSIconset(svgBuffer) {
  const iconsetDir = path.join(buildDir, 'icon.iconset');
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir, { recursive: true });
  }

  const sizes = [16, 32, 64, 128, 256, 512, 1024];

  console.log('\nCreating macOS iconset...');
  
  for (const size of sizes) {
    // Standard resolution
    await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(path.join(iconsetDir, `icon_${size}x${size}.png`));
    
    // Retina resolution (2x)
    if (size < 1024) {
      const retinaSize = size * 2;
      await sharp(svgBuffer)
        .resize(retinaSize, retinaSize)
        .png({ quality: 100 })
        .toFile(path.join(iconsetDir, `icon_${size}x${size}@2x.png`));
    }
  }

  console.log('✓ macOS iconset created');

  // Try to create .icns file using iconutil (macOS only)
  const { execSync } = require('child_process');
  try {
    execSync(`iconutil -c icns "${iconsetDir}" -o "${path.join(buildDir, 'icon.icns')}"`, {
      stdio: 'pipe'
    });
    console.log('✓ Created icon.icns (macOS native format)');
  } catch (err) {
    // Not on macOS, use PNG fallback
    fs.copyFileSync(
      path.join(buildDir, 'icon.png'),
      path.join(buildDir, 'icon.icns')
    );
    console.log('✓ Created icon.icns (PNG fallback for non-macOS)');
  }
}

function createFallbackIcons() {
  // Copy SVG as PNG fallback
  fs.copyFileSync(
    path.join(buildDir, 'icon.svg'),
    path.join(buildDir, 'icon.png')
  );
  console.log('✓ Created icon.png (SVG fallback)');
  
  fs.copyFileSync(
    path.join(buildDir, 'icon.svg'),
    path.join(buildDir, 'icon.icns')
  );
  console.log('✓ Created icon.icns (SVG fallback)');
  
  console.log('\n⚠ Note: For best results, install sharp:');
  console.log('  npm install --save-dev sharp');
}
