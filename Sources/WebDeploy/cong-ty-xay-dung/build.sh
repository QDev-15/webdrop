#!/bin/bash
set -e

echo "============================================"
echo "   Build: cong-ty-xay-dung"
echo "============================================"
echo ""

# Di chuyen ve thu muc script
cd "$(dirname "$0")"

# Kiem tra Node.js
if ! command -v node &> /dev/null; then
    echo "LOI: Khong tim thay Node.js. Cai dat tai https://nodejs.org"
    exit 1
fi

# Cai dat dependencies neu chua co
if [ ! -d "website/node_modules" ]; then
    echo "[1/4] Cai dat website dependencies..."
    cd website && npm install && cd ..
fi

if [ ! -d "admin/node_modules" ]; then
    echo "[2/4] Cai dat admin dependencies..."
    cd admin && npm install && cd ..
fi

# Chay build.mjs
echo "[3/4] Build va dong goi..."
node build.mjs

echo ""
echo "Build thanh cong! Folder deploy/ san sang."
