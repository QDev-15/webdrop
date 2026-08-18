#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== strategy-consulting — Linux/Mac Build ==="
node build.mjs
