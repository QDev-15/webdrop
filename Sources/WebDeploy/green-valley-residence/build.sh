#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== green-valley-residence — Linux/Mac Build ==="
node build.mjs
