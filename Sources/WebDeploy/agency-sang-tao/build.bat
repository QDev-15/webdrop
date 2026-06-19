@echo off
cd /d "%~dp0"
set APP_URL=http://localhost:8081
echo === Agency Sang Tao - Build Deploy ===
node build.mjs
if %ERRORLEVEL% neq 0 (
  echo Build that bai!
  pause
  exit /b 1
)
echo.
echo Build thanh cong! Thu muc deploy/ san sang.
pause
