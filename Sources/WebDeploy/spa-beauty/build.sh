#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== spa-beauty — Linux/Mac Build ==="
node build.mjs
