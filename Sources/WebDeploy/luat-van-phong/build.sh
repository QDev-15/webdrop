#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "=== Luật Văn Phòng — Build ==="
node build.mjs
