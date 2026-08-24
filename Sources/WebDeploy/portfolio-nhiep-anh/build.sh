#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== portfolio-nhiep-anh — Linux/Mac Build ==="
node build.mjs
