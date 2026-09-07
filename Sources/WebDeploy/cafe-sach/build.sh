#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== cafe-sach — Linux/Mac Build ==="
node build.mjs
