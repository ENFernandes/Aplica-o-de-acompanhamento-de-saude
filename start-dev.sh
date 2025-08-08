#!/bin/bash

echo "Iniciando os servicos..."

# Iniciar o backend
cd backend && npm install && npm start &
BACKEND_PID=$!

# Aguardar 5 segundos para o backend inicializar
sleep 5

# Iniciar o frontend
cd ../frontend && npm install && npm run dev &
FRONTEND_PID=$!

echo "Servicos iniciados!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"

# Aguardar os processos terminarem
wait $BACKEND_PID
wait $FRONTEND_PID
