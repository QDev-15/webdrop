#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-hang-nhat-ban — Linux/Mac Build ==="
node build.mjs
