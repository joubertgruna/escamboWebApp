#!/bin/bash

# ESCAMBO - Start Script (Fácil)
# Inicia Backend Mock + Frontend Next.js

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ESCAMBO - Iniciando..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Limpar portas
echo "🧹 Limpando portas 3000 e 5174..."
lsof -i :5174 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :3000 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 1
echo "✅ Portas limpas"
echo ""

# Iniciar Backend Mock
echo "🚀 Iniciando Backend Mock (Porta 3000)..."
cd "$(dirname "$0")"
node backend-mock.js > /tmp/escambo-backend.log 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
sleep 2

if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "❌ Backend não iniciou. Log:"
  cat /tmp/escambo-backend.log
  exit 1
fi

echo "✅ Backend Mock rodando"
echo ""

# Iniciar Frontend
echo "🚀 Iniciando Frontend Next.js (Porta 5174)..."
cd frontend-next
npm run dev -- --port 5174 > /tmp/escambo-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
sleep 5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ESCAMBO INICIADO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 No Celular (mesma WiFi):"
echo "   https://192.168.15.10:5174"
echo ""
echo "🖥️ No Navegador:"
echo "   http://localhost:5174"
echo ""
echo "📊 Backend Mock:"
echo "   http://localhost:3000"
echo ""
echo "🛑 Para parar:"
echo "   Pressione Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Função para cleanup
cleanup() {
  echo ""
  echo "🛑 Encerrando..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  exit 0
}

# Executar cleanup ao pressionar Ctrl+C
trap cleanup SIGINT

# Aguardar indefinidamente
wait
