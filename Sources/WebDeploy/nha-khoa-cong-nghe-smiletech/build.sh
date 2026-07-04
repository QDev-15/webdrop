#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-cong-nghe-smiletech — Linux/Mac Build ==="
node build.mjs
