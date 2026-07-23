#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-ami-mobile — Linux/Mac Build ==="
node build.mjs
