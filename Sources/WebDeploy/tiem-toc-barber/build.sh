#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== tiem-toc-barber — Linux/Mac Build ==="
node build.mjs
