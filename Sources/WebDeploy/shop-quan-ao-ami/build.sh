#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-quan-ao-ami — Linux/Mac Build ==="
node build.mjs
