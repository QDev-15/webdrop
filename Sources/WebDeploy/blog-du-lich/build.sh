#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== blog-du-lich — Linux/Mac Build ==="
node build.mjs
