#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== portfolio-thiet-ke-do-hoa — Linux/Mac Build ==="
node build.mjs
