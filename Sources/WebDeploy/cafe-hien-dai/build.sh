#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== cafe-hien-dai — Linux/Mac Build ==="
node build.mjs
