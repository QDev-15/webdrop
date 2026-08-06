#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-van-phong-pham — Linux/Mac Build ==="
node build.mjs
