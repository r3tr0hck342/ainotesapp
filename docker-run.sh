#!/bin/bash
# Docker Run Script - Run AI Notes App in Docker with GUI support
# This script runs the Tauri application inside Docker with X11 forwarding

set -e

echo "======================================"
echo "AI Notes App - Docker Run"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Docker image exists
if ! docker image inspect ai-notes-builder:latest &> /dev/null; then
    echo -e "${RED}Error: Docker image not found${NC}"
    echo "Please run ./docker-build.sh first"
    exit 1
fi

echo -e "${GREEN}✓ Docker image found${NC}"
echo ""

# Allow X11 connections from Docker
echo -e "${YELLOW}Setting up X11 forwarding...${NC}"
xhost +local:docker > /dev/null 2>&1 || {
    echo -e "${RED}Warning: Could not configure xhost${NC}"
    echo "GUI may not work properly"
}

echo -e "${GREEN}✓ X11 configured${NC}"
echo ""

# Start Vite dev server in background
echo -e "${YELLOW}Starting Vite dev server...${NC}"
npm run dev:react &
VITE_PID=$!

# Wait for Vite to be ready
sleep 3

echo -e "${GREEN}✓ Vite server started${NC}"
echo ""

# Run the application in Docker
echo -e "${YELLOW}Starting AI Notes App in Docker...${NC}"
echo ""

docker run --rm -it \
    --name ai-notes-app \
    -e DISPLAY=$DISPLAY \
    -v /tmp/.X11-unix:/tmp/.X11-unix:rw \
    -v $(pwd)/docker-output:/output \
    --network host \
    ai-notes-builder:latest \
    /app/src-tauri/target/release/ai-notes

# Cleanup
echo ""
echo -e "${YELLOW}Cleaning up...${NC}"
kill $VITE_PID 2>/dev/null || true
xhost -local:docker > /dev/null 2>&1 || true

echo -e "${GREEN}✓ Done${NC}"
