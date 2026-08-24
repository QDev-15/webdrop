#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== rao-nha — Linux/Mac Build ==="
node build.mjs
