#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "=== Agency Sang Tao — Build Deploy ==="
node build.mjs
echo ""
echo "Build thanh cong! Thu muc deploy/ san sang."
