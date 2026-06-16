#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== am-thuc — Linux/Mac Build ==="
node build.mjs
