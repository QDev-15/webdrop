#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-tong-quat-antam — Linux/Mac Build ==="
node build.mjs
