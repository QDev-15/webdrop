#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Building Agency Sang Tao..."
node "$DIR/build.mjs"
echo "Build complete! Deploy folder: $DIR/deploy"
