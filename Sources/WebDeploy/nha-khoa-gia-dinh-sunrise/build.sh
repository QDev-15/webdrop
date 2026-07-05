#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-gia-dinh-sunrise — Linux/Mac Build ==="
node build.mjs
