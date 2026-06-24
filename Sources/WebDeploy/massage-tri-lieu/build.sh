#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== massage-tri-lieu — Linux/Mac Build ==="
node build.mjs
