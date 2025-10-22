#!/bin/bash

# AI Notes App - Automated Build and Save Script
# This script builds the app and saves output files to your Downloads folder

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOWNLOADS_DIR="$HOME/Downloads"
PROJECT_DIR="/home/r3tr0/Documents/Tools/AIAPP"
BUILD_DIR="$PROJECT_DIR/dist-electron"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="$DOWNLOADS_DIR/AI-Notes-Build-$TIMESTAMP"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  AI Notes App - Build & Save Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check if we're in the right directory
echo -e "${YELLOW}[1/6] Checking project directory...${NC}"
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo -e "${RED}Error: package.json not found in $PROJECT_DIR${NC}"
    exit 1
fi
cd "$PROJECT_DIR"
echo -e "${GREEN}✓ Project directory confirmed${NC}"
echo ""

# Step 2: Check Node.js and npm
echo -e "${YELLOW}[2/6] Checking Node.js and npm...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✓ npm version: $(npm --version)${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}[3/6] Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages (this may take a few minutes)..."
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Step 4: Check for .env file
echo -e "${YELLOW}[4/6] Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Warning: .env file not found${NC}"
    echo "The app will work, but AI features require a Gemini API key."
    echo "You can add it later in the app settings or create .env file now."
    echo ""
    read -p "Do you want to create .env file now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo "Created .env file from .env.example"
            echo "Please edit .env and add your Gemini API key:"
            echo "  nano .env"
            echo "  or"
            echo "  gedit .env"
            echo ""
            read -p "Press Enter to continue after editing .env (or skip)..."
        else
            echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
            echo "Created .env file. Please edit it and add your API key."
        fi
    fi
else
    echo -e "${GREEN}✓ .env file found${NC}"
fi
echo ""

# Step 5: Build the application
echo -e "${YELLOW}[5/6] Building the application...${NC}"
echo "This may take a few minutes..."
echo ""

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    echo "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
fi

# Run the build
npm run build:linux

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully!${NC}"
else
    echo -e "${RED}✗ Build failed. Check the error messages above.${NC}"
    exit 1
fi
echo ""

# Step 6: Copy files to Downloads
echo -e "${YELLOW}[6/6] Copying files to Downloads folder...${NC}"

# Create timestamped directory in Downloads
mkdir -p "$OUTPUT_DIR"

# Copy all build artifacts
if [ -d "$BUILD_DIR" ]; then
    cp -r "$BUILD_DIR"/* "$OUTPUT_DIR/"
    echo -e "${GREEN}✓ Files copied to: $OUTPUT_DIR${NC}"
    echo ""
    
    # List the files
    echo -e "${BLUE}Built files:${NC}"
    ls -lh "$OUTPUT_DIR"/*.AppImage 2>/dev/null || true
    ls -lh "$OUTPUT_DIR"/*.deb 2>/dev/null || true
    echo ""
    
    # Make AppImage executable
    if ls "$OUTPUT_DIR"/*.AppImage 1> /dev/null 2>&1; then
        chmod +x "$OUTPUT_DIR"/*.AppImage
        echo -e "${GREEN}✓ AppImage made executable${NC}"
    fi
    
    # Create a direct link in Downloads root
    if ls "$OUTPUT_DIR"/*.AppImage 1> /dev/null 2>&1; then
        APPIMAGE_FILE=$(ls "$OUTPUT_DIR"/*.AppImage | head -n 1)
        APPIMAGE_NAME=$(basename "$APPIMAGE_FILE")
        cp "$APPIMAGE_FILE" "$DOWNLOADS_DIR/$APPIMAGE_NAME"
        chmod +x "$DOWNLOADS_DIR/$APPIMAGE_NAME"
        echo -e "${GREEN}✓ AppImage also copied to: $DOWNLOADS_DIR/$APPIMAGE_NAME${NC}"
    fi
    
    if ls "$OUTPUT_DIR"/*.deb 1> /dev/null 2>&1; then
        DEB_FILE=$(ls "$OUTPUT_DIR"/*.deb | head -n 1)
        DEB_NAME=$(basename "$DEB_FILE")
        cp "$DEB_FILE" "$DOWNLOADS_DIR/$DEB_NAME"
        echo -e "${GREEN}✓ DEB package also copied to: $DOWNLOADS_DIR/$DEB_NAME${NC}"
    fi
else
    echo -e "${RED}✗ Build directory not found${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Build and save completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}Installation Options:${NC}"
echo ""
echo -e "${YELLOW}Option 1: Run AppImage (No installation required)${NC}"
if ls "$DOWNLOADS_DIR"/*.AppImage 1> /dev/null 2>&1; then
    APPIMAGE_PATH=$(ls "$DOWNLOADS_DIR"/AI\ Notes*.AppImage | head -n 1)
    echo "  $APPIMAGE_PATH"
fi
echo ""
echo -e "${YELLOW}Option 2: Install DEB package (Debian/Ubuntu)${NC}"
if ls "$DOWNLOADS_DIR"/*.deb 1> /dev/null 2>&1; then
    DEB_PATH=$(ls "$DOWNLOADS_DIR"/ai-notes-app*.deb | head -n 1)
    echo "  sudo dpkg -i \"$DEB_PATH\""
    echo "  sudo apt-get install -f  # If there are dependency issues"
fi
echo ""
echo -e "${BLUE}All build files are also saved in:${NC}"
echo "  $OUTPUT_DIR"
echo ""
echo -e "${GREEN}Enjoy your AI Notes app! 📝✨${NC}"
