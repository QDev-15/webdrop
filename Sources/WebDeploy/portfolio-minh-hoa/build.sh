#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== portfolio-minh-hoa — Linux/Mac Build ==="
node build.mjs
