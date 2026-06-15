#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== Portfolio Tôi — Linux/Mac Build ==="
node build.mjs
