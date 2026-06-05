@echo off
cd /d "%~dp0"
echo === Build Ca Phe Thoi Gian ===
node build.mjs
if %ERRORLEVEL% neq 0 (
  echo.
  echo Build that bai! Kiem tra loi o tren.
  pause
  exit /b 1
)
echo.
echo Build thanh cong! Thu muc deploy/ da san sang.
pause
