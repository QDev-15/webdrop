#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-hang-cao-cap — Linux/Mac Build ==="
node build.mjs
