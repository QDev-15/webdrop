@echo off
cd /d "%~dp0"
set APP_URL=http://localhost:8081
echo === Luat Van Phong - Build ===
node build.mjs
pause
