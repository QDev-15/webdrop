#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== yoga-wellness — Linux/Mac Build ==="
node build.mjs
