@echo off
cd /d "%~dp0"
echo ===================================================
echo       Starting AI Photo Editor Project
echo ===================================================

echo [1/2] Launching Backend Server...
start "AI Editor Backend" cmd /k "python -m uvicorn backend.main:app --reload --host 0.0.0.0"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend Server...
cd frontend
start "AI Editor Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo             Servers Started!
echo ===================================================
echo Backend API: http://127.0.0.1:8000
echo Frontend App: http://localhost:5173
echo.
pause
