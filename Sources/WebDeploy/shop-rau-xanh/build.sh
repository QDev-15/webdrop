#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-rau-xanh — Linux/Mac Build ==="
node build.mjs
