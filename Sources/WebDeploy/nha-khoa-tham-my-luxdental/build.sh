#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-tham-my-luxdental — Linux/Mac Build ==="
node build.mjs
