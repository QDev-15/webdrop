#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-thu-cung — Linux/Mac Build ==="
node build.mjs
