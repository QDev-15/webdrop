#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-dong-ho — Linux/Mac Build ==="
node build.mjs
