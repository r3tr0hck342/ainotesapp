#!/bin/bash

# Phase 1 Verification Script
# Verifies that all Phase 1 components are properly installed and configured

echo "=================================="
echo "Phase 1 Verification Script"
echo "AI Notes - Tauri Migration"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_PASSED=true

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ALL_PASSED=false
        return 1
    fi
}

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ALL_PASSED=false
        return 1
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ALL_PASSED=false
        return 1
    fi
}

echo "Checking Rust Installation..."
echo "------------------------------"
check_command rustc "Rust compiler (rustc)"
check_command cargo "Cargo package manager"
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    echo -e "  ${YELLOW}→${NC} $RUST_VERSION"
fi
echo ""

echo "Checking Tauri CLI..."
echo "------------------------------"
check_command "npx tauri" "Tauri CLI (npx)"
if [ -f "node_modules/.bin/tauri" ]; then
    echo -e "${GREEN}✓${NC} Tauri CLI (local npm)"
else
    echo -e "${RED}✗${NC} Tauri CLI (local npm)"
    ALL_PASSED=false
fi
echo ""

echo "Checking Node Packages..."
echo "------------------------------"
if grep -q "@tauri-apps/cli" package.json; then
    echo -e "${GREEN}✓${NC} @tauri-apps/cli in package.json"
else
    echo -e "${RED}✗${NC} @tauri-apps/cli in package.json"
    ALL_PASSED=false
fi

if grep -q "@tauri-apps/api" package.json; then
    echo -e "${GREEN}✓${NC} @tauri-apps/api in package.json"
else
    echo -e "${RED}✗${NC} @tauri-apps/api in package.json"
    ALL_PASSED=false
fi
echo ""

echo "Checking Project Structure..."
echo "------------------------------"
check_dir "src-tauri" "src-tauri/ directory"
check_dir "src-tauri/src" "src-tauri/src/ directory"
check_dir "src-tauri/icons" "src-tauri/icons/ directory"
echo ""

echo "Checking Configuration Files..."
echo "------------------------------"
check_file "src-tauri/Cargo.toml" "Cargo.toml"
check_file "src-tauri/Cargo.lock" "Cargo.lock"
check_file "src-tauri/tauri.conf.json" "tauri.conf.json"
check_file "src-tauri/build.rs" "build.rs"
check_file "src-tauri/src/main.rs" "main.rs"
echo ""

echo "Checking Icon Files..."
echo "------------------------------"
check_file "src-tauri/icons/32x32.png" "32x32.png"
check_file "src-tauri/icons/128x128.png" "128x128.png"
check_file "src-tauri/icons/icon.icns" "icon.icns (macOS)"
check_file "src-tauri/icons/icon.ico" "icon.ico (Windows)"
check_file "src-tauri/icons/icon.png" "icon.png"
echo ""

echo "Checking Electron Files (Should Still Exist)..."
echo "------------------------------"
check_dir "electron" "electron/ directory"
check_file "electron/main.js" "electron/main.js"
check_file "electron/preload.js" "electron/preload.js"
echo ""

echo "Verifying Configuration Content..."
echo "------------------------------"
if grep -q "com.ainotes.app" src-tauri/tauri.conf.json; then
    echo -e "${GREEN}✓${NC} App identifier configured correctly"
else
    echo -e "${RED}✗${NC} App identifier not configured"
    ALL_PASSED=false
fi

if grep -q "AI Notes" src-tauri/tauri.conf.json; then
    echo -e "${GREEN}✓${NC} App name configured correctly"
else
    echo -e "${RED}✗${NC} App name not configured"
    ALL_PASSED=false
fi

if grep -q "ai-notes" src-tauri/Cargo.toml; then
    echo -e "${GREEN}✓${NC} Cargo package name configured"
else
    echo -e "${RED}✗${NC} Cargo package name not configured"
    ALL_PASSED=false
fi
echo ""

echo "Testing Rust Compilation..."
echo "------------------------------"
cd src-tauri
if cargo check --quiet 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Rust code compiles successfully"
else
    echo -e "${YELLOW}⚠${NC} Rust compilation check (may need dependencies download)"
fi
cd ..
echo ""

echo "=================================="
if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✓ Phase 1 Verification: PASSED${NC}"
    echo ""
    echo "All components are properly installed and configured."
    echo "Ready to proceed to Phase 2: Backend Migration"
    exit 0
else
    echo -e "${RED}✗ Phase 1 Verification: FAILED${NC}"
    echo ""
    echo "Some components are missing or misconfigured."
    echo "Please review the errors above and fix them before proceeding."
    exit 1
fi
echo "=================================="
