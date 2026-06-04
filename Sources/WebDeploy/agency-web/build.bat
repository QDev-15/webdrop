@echo off
cd /d "%~dp0"
echo === Agency Web Build Script ===
node build.mjs
if errorlevel 1 (
  echo.
  echo Build that bai! Kiem tra loi phia tren.
  pause
  exit /b 1
)
echo.
echo === Done! Thu muc deploy/ da san sang ===
pause
