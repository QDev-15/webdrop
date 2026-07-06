#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-ban-hang — Linux/Mac Build ==="
node build.mjs
