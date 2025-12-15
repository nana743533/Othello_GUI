#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/backend/tmp/pids/server.pid

# Compile Othello AI binary
# This applies to both production build (if not using multi-stage artifact) and local dev (volume mount)
echo "Compiling Othello AI..."
cd /app/backend
if [ -f "othelloai_logic/othello.cpp" ]; then
    g++ -O3 -o othelloai_logic/othello othelloai_logic/othello.cpp
    chmod +x othelloai_logic/othello
    echo "Compilation successful."
else
    echo "Warning: othello.cpp not found."
fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
