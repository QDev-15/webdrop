#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-thoi-trang — Linux/Mac Build ==="
node build.mjs
