#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-ruou-vang — Linux/Mac Build ==="
node build.mjs
