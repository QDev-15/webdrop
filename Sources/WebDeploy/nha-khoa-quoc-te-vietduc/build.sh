#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-quoc-te-vietduc — Linux/Mac Build ==="
node build.mjs
