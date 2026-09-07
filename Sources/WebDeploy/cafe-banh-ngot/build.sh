#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== cafe-banh-ngot — Linux/Mac Build ==="
node build.mjs
