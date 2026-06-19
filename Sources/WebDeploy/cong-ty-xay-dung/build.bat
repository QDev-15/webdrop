@echo off
cd /d "%~dp0"
set APP_URL=http://localhost:8081
echo === Build: Cong Ty Xay Dung ===
node build.mjs
pause
