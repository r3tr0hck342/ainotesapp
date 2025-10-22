const fs = require('fs');
const { execSync } = require('child_process');

// Create build directory
if (!fs.existsSync('build')) {
  fs.mkdirSync('build', { recursive: true });
}

console.log('Creating application icons...');

// Create a simple SVG icon
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="180" fill="url(#grad)"/>
  <text x="512" y="700" font-family="Arial, sans-serif" font-size="500" font-weight="bold" fill="white" text-anchor="middle">AI</text>
</svg>`;

fs.writeFileSync('build/icon.svg', svgIcon);
console.log('✓ Created icon.svg');

// Try to convert SVG to PNG using available tools
try {
  // Try ImageMagick
  try {
    execSync('convert build/icon.svg -resize 1024x1024 build/icon-1024.png', { stdio: 'ignore' });
    execSync('convert build/icon-1024.png -resize 512x512 build/icon.png', { stdio: 'ignore' });
    console.log('✓ Created PNG icons using ImageMagick');
  } catch (e) {
    // Try Inkscape
    try {
      execSync('inkscape build/icon.svg -w 1024 -h 1024 -o build/icon-1024.png', { stdio: 'ignore' });
      execSync('inkscape build/icon.svg -w 512 -h 512 -o build/icon.png', { stdio: 'ignore' });
      console.log('✓ Created PNG icons using Inkscape');
    } catch (e2) {
      console.log('⚠ Could not convert SVG to PNG. Please install ImageMagick or Inkscape.');
      console.log('  For now, using SVG as fallback.');
      // Copy SVG as fallback
      fs.copyFileSync('build/icon.svg', 'build/icon.png');
    }
  }

  // Try to create macOS icns
  if (fs.existsSync('build/icon-1024.png')) {
    try {
      // Create iconset directory
      if (!fs.existsSync('build/icon.iconset')) {
        fs.mkdirSync('build/icon.iconset', { recursive: true });
      }

      // Generate all required sizes
      const sizes = [
        { size: 16, name: 'icon_16x16.png' },
        { size: 32, name: 'icon_16x16@2x.png' },
        { size: 32, name: 'icon_32x32.png' },
        { size: 64, name: 'icon_32x32@2x.png' },
        { size: 128, name: 'icon_128x128.png' },
        { size: 256, name: 'icon_128x128@2x.png' },
        { size: 256, name: 'icon_256x256.png' },
        { size: 512, name: 'icon_256x256@2x.png' },
        { size: 512, name: 'icon_512x512.png' },
        { size: 1024, name: 'icon_512x512@2x.png' }
      ];

      sizes.forEach(({ size, name }) => {
        try {
          execSync(`convert build/icon-1024.png -resize ${size}x${size} build/icon.iconset/${name}`, { stdio: 'ignore' });
        } catch (e) {
          // Ignore individual conversion errors
        }
      });

      // Try to create icns file
      try {
        execSync('iconutil -c icns build/icon.iconset -o build/icon.icns', { stdio: 'ignore' });
        console.log('✓ Created icon.icns for macOS');
      } catch (e) {
        try {
          execSync('png2icns build/icon.icns build/icon.iconset/*.png', { stdio: 'ignore' });
          console.log('✓ Created icon.icns using png2icns');
        } catch (e2) {
          console.log('⚠ Could not create .icns file. Using PNG fallback for macOS.');
          if (fs.existsSync('build/icon-1024.png')) {
            fs.copyFileSync('build/icon-1024.png', 'build/icon.icns');
          }
        }
      }
    } catch (e) {
      console.log('⚠ Error creating iconset:', e.message);
    }
  }

  console.log('\n✓ Icon creation complete!');
  console.log('\nCreated files:');
  const files = fs.readdirSync('build').filter(f => f.match(/\.(svg|png|icns)$/));
  files.forEach(f => console.log(`  - build/${f}`));

} catch (error) {
  console.error('Error creating icons:', error.message);
  console.log('\nPlease create icons manually or install ImageMagick:');
  console.log('  Ubuntu/Debian: sudo apt-get install imagemagick');
  console.log('  macOS: brew install imagemagick');
}
