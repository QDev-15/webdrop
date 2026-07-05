#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-implant-future — Linux/Mac Build ==="
node build.mjs
