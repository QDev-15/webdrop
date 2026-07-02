#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== tham-my-vien — Linux/Mac Build ==="
node build.mjs
