#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== digital-innovation — Linux/Mac Build ==="
node build.mjs
