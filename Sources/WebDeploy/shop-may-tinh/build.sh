#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-may-tinh — Linux/Mac Build ==="
node build.mjs
