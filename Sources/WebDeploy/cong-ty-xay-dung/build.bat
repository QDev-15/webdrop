@echo off
chcp 65001 > nul
echo ============================================
echo    Build: cong-ty-xay-dung
echo ============================================
echo.

cd /d "%~dp0"

REM Kiem tra Node.js
node --version > nul 2>&1
if errorlevel 1 (
    echo LOI: Khong tim thay Node.js. Cai dat tai https://nodejs.org
    pause
    exit /b 1
)

REM Cai dat dependencies neu chua co
if not exist "website\node_modules" (
    echo [1/4] Cai dat website dependencies...
    cd website && npm install && cd ..
)
if not exist "admin\node_modules" (
    echo [2/4] Cai dat admin dependencies...
    cd admin && npm install && cd ..
)

REM Chay build.mjs
echo [3/4] Build va dong goi...
node build.mjs

if errorlevel 1 (
    echo.
    echo LOI: Build that bai!
    pause
    exit /b 1
)

echo.
echo Build thanh cong! Folder deploy/ san sang.
pause
