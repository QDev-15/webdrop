#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== nha-khoa-dong-do — Linux/Mac Build ==="
node build.mjs
