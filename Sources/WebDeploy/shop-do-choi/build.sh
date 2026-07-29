#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== shop-do-choi — Linux/Mac Build ==="
node build.mjs
