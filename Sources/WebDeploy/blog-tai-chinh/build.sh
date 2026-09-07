#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== blog-tai-chinh — Linux/Mac Build ==="
node build.mjs
