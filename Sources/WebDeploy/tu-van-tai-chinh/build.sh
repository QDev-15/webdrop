#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "=== Build VietFinance Website ==="
node build.mjs
