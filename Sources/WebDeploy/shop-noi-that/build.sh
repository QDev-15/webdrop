#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-noi-that — Linux/Mac Build ==="
node build.mjs
