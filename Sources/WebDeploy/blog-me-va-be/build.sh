#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== blog-me-va-be — Linux/Mac Build ==="
node build.mjs
