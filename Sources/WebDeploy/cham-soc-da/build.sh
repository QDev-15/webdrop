#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== cham-soc-da — Linux/Mac Build ==="
node build.mjs
