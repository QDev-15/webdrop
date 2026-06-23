#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== quan-bbq-lua — Linux/Mac Build ==="
node build.mjs
