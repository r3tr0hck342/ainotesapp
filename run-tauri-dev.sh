#!/bin/bash

# Wrapper script to run Tauri dev server without snap library conflicts

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

echo "Starting Tauri development server..."
echo "Environment configured to avoid snap library conflicts"
echo ""

# Run the Tauri dev server
npm run dev
