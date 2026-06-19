@echo off
cd /d "%~dp0"
set APP_URL=http://localhost:8081
echo Build Blog Ca Nhan...
node build.mjs
pause
