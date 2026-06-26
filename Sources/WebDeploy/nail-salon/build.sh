#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nail-salon — Linux/Mac Build ==="
node build.mjs
