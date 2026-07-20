@echo off
cd /d "%~dp0"
echo ===================================================
echo       Starting AI Editor Backend
echo ===================================================
echo.
echo Launching server...
python -m uvicorn backend.main:app --reload --host 0.0.0.0
pause
