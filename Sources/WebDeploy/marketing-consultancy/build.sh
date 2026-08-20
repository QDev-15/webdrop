#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== marketing-consultancy — Linux/Mac Build ==="
node build.mjs
