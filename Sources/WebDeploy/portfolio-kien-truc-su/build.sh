#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== portfolio-kien-truc-su — Linux/Mac Build ==="
node build.mjs
