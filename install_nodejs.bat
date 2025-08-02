@echo off
echo ========================================
echo Health Tracker - Node.js Setup Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo Make sure to check "Add to PATH" during installation.
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed!
    node --version
)

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    echo Please reinstall Node.js to include npm.
    pause
    exit /b 1
) else (
    echo ✅ npm is installed!
    npm --version
)

echo.
echo ========================================
echo Setting up Backend...
echo ========================================

echo Checking if backend directory exists...
if not exist "backend" (
    echo ❌ Backend directory not found!
    echo Please ensure you're in the correct project directory.
    pause
    exit /b 1
)

echo ✅ Backend directory found!

echo.
echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!

echo.
echo Creating environment file...
if not exist ".env" (
    copy env.example .env
    echo ✅ Environment file created!
) else (
    echo ✅ Environment file already exists!
)

echo.
echo ========================================
echo Backend Setup Complete!
echo ========================================
echo.
echo To start the backend server:
echo 1. Navigate to backend directory: cd backend
echo 2. Start the server: npm run dev
echo.
echo The server will run on: http://localhost:3000
echo.
echo Make sure Docker containers are running:
echo docker-compose up -d
echo.
pause 