#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-hang-hai-san — Linux/Mac Build ==="
node build.mjs
