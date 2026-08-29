#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-dat-viet — Linux/Mac Build ==="
node build.mjs
