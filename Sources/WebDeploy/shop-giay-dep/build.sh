#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-giay-dep — Linux/Mac Build ==="
node build.mjs
