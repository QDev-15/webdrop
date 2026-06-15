#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== {{SLUG}} — Linux/Mac Build ==="
node build.mjs
