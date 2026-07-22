#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-may-anh — Linux/Mac Build ==="
node build.mjs
