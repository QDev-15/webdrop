#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-quan-ao — Linux/Mac Build ==="
node build.mjs
