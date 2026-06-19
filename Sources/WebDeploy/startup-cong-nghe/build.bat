@echo off
cd /d "%~dp0"
set APP_URL=http://localhost:8081
node build.mjs
pause
