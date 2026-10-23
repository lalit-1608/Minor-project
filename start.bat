@echo off
title StudySnippet - Educational Research Platform
cls

echo ========================================================
echo    StudySnippet Research Platform - Windows Launcher
echo ========================================================
echo.

cd /d "%~dp0"

:: Handle case if executed from outer folder containing FacultyPulse-main
if exist "FacultyPulse-main" (
    cd "FacultyPulse-main"
)

:: Step 1: Verify Node.js availability
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not detected on your system.
    echo.
    echo StudySnippet requires Node.js (version 18 or higher recommended).
    echo Please download and install Node.js from:
    echo    https://nodejs.org/
    echo.
    echo Once installed, reopen this file to start StudySnippet.
    echo.
    pause
    exit /b 1
)

:: Step 2: Verify npm availability
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm (Node Package Manager) is not detected on your system.
    echo Please ensure Node.js is installed with npm included.
    echo.
    pause
    exit /b 1
)

:: Step 3: Install dependencies if missing (first-time launch)
if not exist "node_modules" (
    echo [1/2] Installing dependencies for first-time launch...
    echo (This may take 1-2 minutes depending on your internet connection)
    echo.
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Dependency installation failed.
        echo Please verify your internet connection and try running 'npm install' manually.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies successfully installed.
    echo.
)

:: Step 4: Display access instructions
echo [2/2] Starting StudySnippet Research Platform...
echo.
echo ========================================================
echo    Server URL: http://localhost:5173
echo.
echo    If your browser does not open automatically,
echo    please open Google Chrome and navigate to:
echo    http://localhost:5173
echo.
echo    Demo Accounts:
echo    - Student:   rahul.chauhan@apex.edu  / Student@123
echo    - Faculty:   ashok.rathi@apex.edu    / Faculty@123
echo    - Principal: rajesh.verma@apex.edu   / Principal@123
echo ========================================================
echo.

:: Launch default browser
start http://localhost:5173

:: Start the Vite development server
call npm run dev

echo.
echo Server stopped.
pause
