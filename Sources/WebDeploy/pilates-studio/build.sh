#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== pilates-studio — Linux/Mac Build ==="
node build.mjs
