@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === nha-hang-cao-cap — Windows Build ===
node build.mjs
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Loi xay ra trong qua trinh build!
  pause
  exit /b 1
)
pause
