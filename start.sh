#!/bin/bash

# UIWiz Development Starter Script
# This script starts both the Python/Django backend and the React/Vite frontend.

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping Lumina services..."
    # Kill all background jobs started by this script
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "🚀 Starting UIWiz Full Stack Development Environment..."

# 1. Start Backend
echo "📡 Starting Django Backend on port 8001..."
cd backend
if [ -d "venv" ]; then
    # Use virtual environment if it exists
    ./venv/bin/python manage.py runserver 8001 &
else
    # Fallback to system python3
    python3 manage.py runserver 8001 &
fi
BACKEND_PID=$!
cd ..

# 2. Wait a moment for backend to initialize
sleep 2

# 3. Start Frontend
echo "💻 Starting Vite Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ UIWiz is now running!"
echo "🔗 Frontend: http://localhost:5173"
echo "🔗 Backend:  http://localhost:8001"
echo ""
echo "💡 Press Ctrl+C to stop both services simultaneously."

# Keep the script running to maintain the background processes
wait $BACKEND_PID $FRONTEND_PID
