#!/bin/bash

set -e

APP_DIR="/Users/joubertgabriel/Documents/CodePlace/EscamboWebApp"

echo "🚀 Iniciando Escambo App..."
echo ""

# Check if MySQL is running
echo "📊 Verificando MySQL..."
if ! mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    echo "⏳ Iniciando MySQL..."
    brew services start mysql
    sleep 3
fi
echo "✅ MySQL verificado"
echo ""

# Kill any existing processes on ports 3000 and 5174
echo "🧹 Limpando processos anteriores..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true
sleep 1
echo "✅ Portas limpas"
echo ""

# Start Backend Mock API
echo "🔧 Iniciando Backend Mock API (porta 3000)..."
node "$APP_DIR/backend-simple.js" > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "❌ Backend falhou ao iniciar"
    cat /tmp/backend.log
    exit 1
fi
echo "✅ Backend Mock API rodando (PID: $BACKEND_PID)"
echo ""

# Start Frontend
echo "🖥️ Iniciando Frontend Next.js (porta 5174)..."
cd "$APP_DIR/frontend-next"
npm run dev -- --port 5174 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

if ! curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "❌ Frontend falhou ao iniciar"
    cat /tmp/frontend.log
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi
echo "✅ Frontend rodando (PID: $FRONTEND_PID)"
echo ""

# Display summary
echo "════════════════════════════════════════════"
echo "✅ APLICAÇÃO INICIADA COM SUCESSO!"
echo "════════════════════════════════════════════"
echo ""
echo "🌐 Frontend:  http://localhost:5174"
echo "🔌 Backend:   http://localhost:3000"
echo "💾 MySQL:     localhost:3306"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 Para parar a aplicação:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "════════════════════════════════════════════"

# Keep script running
wait
