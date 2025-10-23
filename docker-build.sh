#!/bin/bash
# Docker Build Script for AI Notes App
# This script builds the Tauri application in a clean Docker environment

set -e  # Exit on error

echo "======================================"
echo "AI Notes App - Docker Build"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo ""

# Build the Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
echo "This may take 10-15 minutes on first build (downloads dependencies)"
echo ""

docker build -t ai-notes-builder:latest . || {
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

# Create output directory
mkdir -p docker-output

# Run the container and copy the built binary
echo -e "${YELLOW}Extracting built binary...${NC}"

# Create a temporary container
CONTAINER_ID=$(docker create ai-notes-builder:latest)

# Copy the release binary
docker cp "$CONTAINER_ID:/app/src-tauri/target/release/ai-notes" ./docker-output/ || {
    echo -e "${RED}Error: Failed to copy binary${NC}"
    docker rm "$CONTAINER_ID"
    exit 1
}

# Copy the debug binary as well (for testing)
docker cp "$CONTAINER_ID:/app/src-tauri/target/release/ai-notes" ./docker-output/ai-notes-release || true

# Clean up container
docker rm "$CONTAINER_ID" > /dev/null

echo -e "${GREEN}✓ Binary extracted to docker-output/ai-notes${NC}"
echo ""

# Make binary executable
chmod +x docker-output/ai-notes

# Check binary
echo -e "${YELLOW}Binary information:${NC}"
ls -lh docker-output/ai-notes
file docker-output/ai-notes
echo ""

# Check for snap libraries
echo -e "${YELLOW}Checking for snap library dependencies...${NC}"
if ldd docker-output/ai-notes | grep -q snap; then
    echo -e "${RED}⚠ Warning: Binary still has snap dependencies${NC}"
    ldd docker-output/ai-notes | grep snap
else
    echo -e "${GREEN}✓ No snap dependencies found!${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}Build Complete!${NC}"
echo "======================================"
echo ""
echo "Binary location: ./docker-output/ai-notes"
echo ""
echo "To test the application:"
echo "  cd docker-output"
echo "  ./ai-notes"
echo ""
echo "To run in Docker container (with display):"
echo "  ./docker-run.sh"
echo ""
