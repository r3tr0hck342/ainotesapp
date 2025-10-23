#!/bin/bash

# Launch script for Tauri app that avoids snap library conflicts
# while preserving necessary GTK/display environment

# Preserve display and GTK environment
export DISPLAY="${DISPLAY:-:0}"
export WAYLAND_DISPLAY="${WAYLAND_DISPLAY}"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR}"
export DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS}"

# GTK theme and settings
export GTK_THEME="${GTK_THEME}"
export GTK_DATA_PREFIX="${GTK_DATA_PREFIX}"
export GTK_EXE_PREFIX="${GTK_EXE_PREFIX}"

# Remove snap paths from LD_LIBRARY_PATH
if [ -n "$LD_LIBRARY_PATH" ]; then
    export LD_LIBRARY_PATH=$(echo "$LD_LIBRARY_PATH" | tr ':' '\n' | grep -v '/snap/' | tr '\n' ':' | sed 's/:$//')
fi

# Prepend system library paths
export LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"

echo "Starting Vite dev server..."
npx vite &
VITE_PID=$!

# Wait for Vite to start
echo "Waiting for Vite server to be ready..."
sleep 3

# Check if Vite is running
if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "Waiting a bit more for Vite..."
    sleep 2
fi

echo "Starting Tauri application..."
cd src-tauri
./target/debug/ai-notes

# Cleanup: kill Vite when Tauri exits
echo "Cleaning up..."
kill $VITE_PID 2>/dev/null
