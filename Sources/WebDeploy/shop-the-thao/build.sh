#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-the-thao — Linux/Mac Build ==="
node build.mjs
