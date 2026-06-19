#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== quan-an-pho-bien — Linux/Mac Build ==="
node build.mjs
