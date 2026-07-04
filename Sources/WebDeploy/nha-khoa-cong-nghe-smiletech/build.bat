@echo off
chcp 65001 > nul
cd /d "%~dp0"
set APP_URL=http://localhost:8081
echo === nha-khoa-cong-nghe-smiletech — Windows Build ===
node build.mjs
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Loi xay ra trong qua trinh build!
  pause
  exit /b 1
)
pause
