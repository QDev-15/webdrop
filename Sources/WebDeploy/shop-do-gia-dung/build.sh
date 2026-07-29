#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-do-gia-dung — Linux/Mac Build ==="
node build.mjs
