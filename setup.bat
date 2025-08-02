@echo off
chcp 65001 >nul

echo 🚀 Health Tracker Setup Script
echo ==============================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    echo Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Start PostgreSQL database
echo 🗄️ Starting PostgreSQL database...
docker-compose up -d postgres

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ✅ .env file created. Please edit it with your configuration.
)

echo ✅ Backend setup complete

REM Start backend server
echo 🚀 Starting backend server...
start "Backend Server" cmd /k "npm run dev"

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend server
echo 🌐 Starting frontend server...
cd ..
start "Frontend Server" cmd /k "python -m http.server 8000"

echo.
echo 🎉 Setup complete!
echo ==================
echo.
echo 📊 Database:
echo    - PostgreSQL: localhost:5432
echo    - pgAdmin: http://localhost:5050
echo    - Email: admin@healthtracker.com
echo    - Password: admin_password_2024
echo.
echo 🔧 Backend API:
echo    - URL: http://localhost:3000
echo    - Health check: http://localhost:3000/api/health
echo.
echo 🌐 Frontend:
echo    - URL: http://localhost:8000
echo.
echo 📝 Test Account:
echo    - Email: test@healthtracker.com
echo    - Password: password123
echo.
echo 🛑 To stop all services, close the command windows or run:
echo    docker-compose down
echo.
pause 