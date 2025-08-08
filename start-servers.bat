@echo off
echo ========================================
echo    Health Tracker - Servidores
echo ========================================
echo.

echo Iniciando Backend (porta 3000)...
cd backend
start "Backend Server" cmd /k "node server.js"
cd ..

echo.
echo Iniciando Frontend (porta 8000)...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo    Servidores iniciados!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:8000
echo.
echo Pressione qualquer tecla para sair...
pause > nul
