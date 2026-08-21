#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== portfolio-ux-designer — Linux/Mac Build ==="
node build.mjs
