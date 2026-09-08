#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-banhang — Linux/Mac Build ==="
node build.mjs
