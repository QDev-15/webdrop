#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-trang-suc — Linux/Mac Build ==="
node build.mjs
