#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== blog-cong-nghe — Linux/Mac Build ==="
node build.mjs
