#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-tre-em-kidsmile — Linux/Mac Build ==="
node build.mjs
