#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-chinh-nha-saigon — Linux/Mac Build ==="
node build.mjs
