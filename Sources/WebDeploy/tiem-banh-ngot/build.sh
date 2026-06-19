#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
echo "=== tiem-banh-ngot — Linux/Mac Build ==="
node build.mjs
