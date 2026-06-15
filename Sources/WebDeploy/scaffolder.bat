@echo off
cd /d "%~dp0"
node scaffolder.mjs %1 %2
pause
