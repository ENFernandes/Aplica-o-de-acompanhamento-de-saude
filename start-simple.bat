@echo off
echo Iniciando Backend na porta 3000...
cd backend
start cmd /k "npm start"
cd ..

echo Aguardando 3 segundos...
timeout /t 3 > nul

echo Iniciando Frontend na porta 8000...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo Servicos iniciados!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:8000
echo.
pause
