#!/bin/bash

# System Dependencies Installation Script for Tauri
# AI Notes App - Tauri Migration
# Run this script with: sudo ./INSTALL_SYSTEM_DEPENDENCIES.sh

echo "=================================="
echo "Installing Tauri System Dependencies"
echo "=================================="
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Error: This script must be run with sudo"
    echo "Usage: sudo ./INSTALL_SYSTEM_DEPENDENCIES.sh"
    exit 1
fi

echo "Updating package lists..."
apt-get update

echo ""
echo "Installing required packages..."
echo "- pkg-config"
echo "- libwebkit2gtk-4.1-dev"
echo "- libssl-dev"
echo "- libgtk-3-dev"
echo "- libayatana-appindicator3-dev"
echo "- librsvg2-dev"
echo ""

apt-get install -y \
    pkg-config \
    libwebkit2gtk-4.1-dev \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================="
    echo "✅ Installation Complete!"
    echo "=================================="
    echo ""
    echo "Verifying installation..."
    echo ""
    
    # Verify pkg-config
    if command -v pkg-config &> /dev/null; then
        echo "✅ pkg-config: $(pkg-config --version)"
    else
        echo "⚠️  pkg-config: Not found in PATH"
    fi
    
    # Verify webkit2gtk
    if pkg-config --exists webkit2gtk-4.1; then
        echo "✅ webkit2gtk-4.1: $(pkg-config --modversion webkit2gtk-4.1)"
    else
        echo "⚠️  webkit2gtk-4.1: Not found"
    fi
    
    # Verify gtk-3
    if pkg-config --exists gtk+-3.0; then
        echo "✅ gtk+-3.0: $(pkg-config --modversion gtk+-3.0)"
    else
        echo "⚠️  gtk+-3.0: Not found"
    fi
    
    echo ""
    echo "=================================="
    echo "Next Steps:"
    echo "=================================="
    echo "1. Test Rust compilation:"
    echo "   cd src-tauri && cargo check"
    echo ""
    echo "2. Build the project:"
    echo "   cd src-tauri && cargo build"
    echo ""
    echo "3. If successful, Phase 2 can be marked complete!"
    echo "=================================="
else
    echo ""
    echo "=================================="
    echo "❌ Installation Failed"
    echo "=================================="
    echo "Please check the error messages above and try again."
    exit 1
fi
