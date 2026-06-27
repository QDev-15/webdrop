#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== spa-luxury — Linux/Mac Build ==="
node build.mjs
