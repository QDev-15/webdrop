#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-nu-cuoi-xua — Linux/Mac Build ==="
node build.mjs
