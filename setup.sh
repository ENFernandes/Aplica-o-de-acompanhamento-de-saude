#!/bin/bash

# Health Tracker Setup Script
# This script sets up the Health Tracker application with PostgreSQL database

echo "🚀 Health Tracker Setup Script"
echo "=============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Start PostgreSQL database
echo "🗄️ Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
fi

echo "✅ Backend setup complete"

# Start backend server
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend server
echo "🌐 Starting frontend server..."
cd ..
python -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "🎉 Setup complete!"
echo "=================="
echo ""
echo "📊 Database:"
echo "   - PostgreSQL: localhost:5432"
echo "   - pgAdmin: http://localhost:5050"
echo "   - Email: admin@healthtracker.com"
echo "   - Password: admin_password_2024"
echo ""
echo "🔧 Backend API:"
echo "   - URL: http://localhost:3000"
echo "   - Health check: http://localhost:3000/api/health"
echo ""
echo "🌐 Frontend:"
echo "   - URL: http://localhost:8000"
echo ""
echo "📝 Test Account:"
echo "   - Email: test@healthtracker.com"
echo "   - Password: password123"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "✅ Services stopped"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# Keep script running
wait 