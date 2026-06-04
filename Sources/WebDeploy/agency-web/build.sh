#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "=== Agency Web Build Script ==="
node build.mjs
echo "=== Done! Thu muc deploy/ da san sang ==="
