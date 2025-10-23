# Docker Setup Guide for AI Notes App

This guide explains how to build and run the AI Notes Tauri application using Docker to avoid snap library conflicts.

---

## Prerequisites

### 1. Install Docker

**Ubuntu/Debian:**
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

**Verify Docker installation:**
```bash
docker --version
docker run hello-world
```

---

## Quick Start

### Step 1: Build the Docker Image

```bash
# Make the build script executable
chmod +x docker-build.sh

# Run the build
./docker-build.sh
```

**What this does:**
- Creates a clean Ubuntu 24.04 environment
- Installs Rust, Node.js, and all dependencies
- Builds the Tauri application
- Extracts the binary to `docker-output/`

**Expected time:** 10-15 minutes (first build)

### Step 2: Test the Binary

```bash
# The binary is in docker-output/
cd docker-output
./ai-notes
```

**If this works:** ✅ Success! The snap conflict is resolved.

**If this fails:** The binary may need to run inside the Docker container (see Step 3).

### Step 3: Run in Docker Container (Alternative)

```bash
# Make the run script executable
chmod +x docker-run.sh

# Run the application
./docker-run.sh
```

This runs the app inside Docker with X11 forwarding for GUI support.

---

## Detailed Usage

### Building for Development

```bash
# Build the Docker image
./docker-build.sh

# The binary will be at:
# - docker-output/ai-notes (release build)
```

### Building for Production

```bash
# Build with optimizations
docker build -t ai-notes-builder:latest .

# Extract the binary
CONTAINER_ID=$(docker create ai-notes-builder:latest)
docker cp "$CONTAINER_ID:/app/src-tauri/target/release/ai-notes" ./ai-notes-production
docker rm "$CONTAINER_ID"

# Make executable
chmod +x ai-notes-production
```

### Running with GUI Support

The `docker-run.sh` script handles X11 forwarding automatically:

```bash
./docker-run.sh
```

**Manual X11 setup (if needed):**
```bash
# Allow Docker to connect to X server
xhost +local:docker

# Run with display
docker run --rm -it \
    -e DISPLAY=$DISPLAY \
    -v /tmp/.X11-unix:/tmp/.X11-unix:rw \
    --network host \
    ai-notes-builder:latest \
    /app/src-tauri/target/release/ai-notes

# Cleanup
xhost -local:docker
```

---

## Troubleshooting

### Issue: "Cannot connect to Docker daemon"

**Solution:**
```bash
# Start Docker service
sudo systemctl start docker

# Check status
sudo systemctl status docker

# If still failing, try with sudo
sudo docker build -t ai-notes-builder:latest .
```

### Issue: "Permission denied" when running docker commands

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Verify
docker run hello-world
```

### Issue: "Cannot open display"

**Solution:**
```bash
# Allow X11 connections
xhost +local:docker

# Check DISPLAY variable
echo $DISPLAY

# If empty, set it
export DISPLAY=:0
```

### Issue: Build fails with "No space left on device"

**Solution:**
```bash
# Clean up Docker
docker system prune -a

# Check disk space
df -h

# Remove old images
docker image prune -a
```

### Issue: Binary still has snap dependencies

**Check dependencies:**
```bash
ldd docker-output/ai-notes | grep snap
```

**If snap libraries are found:**
This shouldn't happen in Docker, but if it does:
```bash
# Rebuild with explicit library paths
docker build --no-cache -t ai-notes-builder:latest .
```

---

## Advanced Configuration

### Custom Build Arguments

```bash
# Build with specific Rust version
docker build \
    --build-arg RUST_VERSION=1.90.0 \
    -t ai-notes-builder:latest .
```

### Development Mode

For faster iteration during development:

```bash
# Mount source code as volume
docker run --rm -it \
    -v $(pwd):/app \
    -w /app \
    ai-notes-builder:latest \
    bash

# Inside container:
cd src-tauri
cargo build
```

### Multi-stage Build (Smaller Image)

Create `Dockerfile.multistage`:
```dockerfile
# Build stage
FROM ubuntu:24.04 AS builder
# ... (same as current Dockerfile)

# Runtime stage
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y \
    libwebkit2gtk-4.1-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/src-tauri/target/release/ai-notes /usr/local/bin/
CMD ["ai-notes"]
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build with Docker

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t ai-notes-builder:latest .
      
      - name: Extract binary
        run: |
          CONTAINER_ID=$(docker create ai-notes-builder:latest)
          docker cp "$CONTAINER_ID:/app/src-tauri/target/release/ai-notes" ./ai-notes
          docker rm "$CONTAINER_ID"
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: ai-notes-linux
          path: ai-notes
```

---

## Performance Tips

### 1. Use BuildKit for Faster Builds

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Build with cache
docker build --cache-from ai-notes-builder:latest -t ai-notes-builder:latest .
```

### 2. Layer Caching

The Dockerfile is optimized for caching:
- System dependencies (rarely change)
- Rust installation (rarely change)
- Node.js installation (rarely change)
- npm dependencies (change occasionally)
- Source code (changes frequently)

### 3. Parallel Builds

```bash
# Use all CPU cores
docker build --build-arg MAKEFLAGS="-j$(nproc)" -t ai-notes-builder:latest .
```

---

## Comparison: Docker vs Native Build

| Aspect | Native Build | Docker Build |
|--------|--------------|--------------|
| Build Time | ~40s | ~10-15 min (first), ~2-3 min (cached) |
| Snap Conflict | ❌ Yes | ✅ No |
| Reproducibility | ❌ System-dependent | ✅ Consistent |
| Disk Space | ~3GB | ~5GB (includes image) |
| Complexity | Low | Medium |
| CI/CD Ready | ❌ No | ✅ Yes |

---

## Next Steps

After successful Docker build:

1. **Test the application thoroughly**
   - Create notes
   - Save/load functionality
   - AI features
   - Voice recording

2. **Package for distribution**
   - Create AppImage
   - Create .deb package
   - Create Flatpak

3. **Set up CI/CD**
   - Automated builds
   - Release automation
   - Multi-platform support

---

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Tauri Docker Guide](https://tauri.app/v1/guides/building/linux)
- [X11 Forwarding in Docker](https://wiki.ros.org/docker/Tutorials/GUI)

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker logs: `docker logs <container-id>`
3. Check build output for errors
4. Verify system requirements are met

**Common Issues:**
- Snap conflict: ✅ Resolved by Docker
- Display issues: Configure X11 forwarding
- Permission issues: Add user to docker group
- Build failures: Check disk space and dependencies
