#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== beauty-studio — Linux/Mac Build ==="
node build.mjs
