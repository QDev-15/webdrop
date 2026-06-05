#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "=== Build Ca Phe Thoi Gian ==="
node build.mjs
echo ""
echo "Build thanh cong! Thu muc deploy/ da san sang."
