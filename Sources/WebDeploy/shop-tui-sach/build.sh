#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-tui-sach — Linux/Mac Build ==="
node build.mjs
