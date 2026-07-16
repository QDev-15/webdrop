#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-thuc-pham-sach — Linux/Mac Build ==="
node build.mjs
