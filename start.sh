#!/bin/bash

echo "🚀 Starting UN Garage Management System..."
echo ""

cd backend

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🌱 Seeding database with demo data..."
node seed.js

echo ""
echo "🚀 Starting backend server..."
npm start &
BACKEND_PID=$!

echo ""
echo "🌐 Starting frontend server..."
cd ../frontend
python -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "✅ System is running!"
echo "📊 Frontend: http://localhost:8000"
echo "🔧 Backend API: http://localhost:3000"
echo ""
echo "📋 Demo Credentials:"
echo "Admin: shem.admin@un.org / admin123"
echo "Requestor: james.requestor@un.org / requestor123"
echo "Mechanic: anthony.mechanic@un.org / mechanic123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait