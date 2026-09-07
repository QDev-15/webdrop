#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== cafe-den-muon — Linux/Mac Build ==="
node build.mjs
