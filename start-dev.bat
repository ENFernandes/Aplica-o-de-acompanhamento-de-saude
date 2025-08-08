@echo off
echo Iniciando os servicos...

REM Iniciar o backend
start cmd /k "cd backend & npm install & npm start"

REM Aguardar 5 segundos para o backend inicializar
timeout /t 5

REM Iniciar o frontend
start cmd /k "cd frontend & npm install & npm run dev"

echo Servicos iniciados!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
