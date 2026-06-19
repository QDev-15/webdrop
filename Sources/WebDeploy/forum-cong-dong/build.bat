@echo off
cd /d "%~dp0"
set APP_URL=http://localhost:8081
echo === Forum Cong Dong - Build ===
node build.mjs
pause
