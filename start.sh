#!/bin/bash
# Start Escambo - Backend + Frontend
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Iniciando Escambo..."

# Kill any existing processes on our ports
kill -9 $(lsof -ti:3000) 2>/dev/null
kill -9 $(lsof -ti:5173) 2>/dev/null
sleep 1

# Start backend
echo "⚙️  Iniciando Backend..."
cd "$DIR/backend"
node server.js &
BACKEND_PID=$!

# Wait for backend to be ready (up to 10s)
for i in $(seq 1 10); do
  if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend rodando na porta 3000 (PID: $BACKEND_PID)"
    break
  fi
  if [ $i -eq 10 ]; then
    echo "❌ Backend falhou ao iniciar!"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done

# Start frontend
echo "🖥️  Iniciando Frontend..."
cd "$DIR/frontend"
npx vite --port 5173 &
FRONTEND_PID=$!

# Wait for frontend to be ready (up to 15s)
for i in $(seq 1 15); do
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend rodando na porta 5173 (PID: $FRONTEND_PID)"
    break
  fi
  if [ $i -eq 15 ]; then
    echo "❌ Frontend falhou ao iniciar!"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done

echo ""
echo "🎉 Escambo rodando!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""

# Cleanup on exit
trap "echo '🛑 Parando Escambo...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

# Wait for both
wait
