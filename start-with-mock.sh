#!/bin/bash

# ESCAMBO - Start Script com Backend Mock
# Este script inicia o backend (mock) e frontend

echo "🚀 Iniciando Escambo..."
echo ""

# Kill processos anteriores na porta 5174 se existirem
echo "🧹 Limpando portas..."
lsof -i :5174 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :3000 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 1

# Verificar se está no diretório correto
if [ ! -f "backend-mock.js" ]; then
  echo "❌ Erro: backend-mock.js não encontrado"
  echo "Execute este script do diretório raiz do projeto"
  exit 1
fi

echo "✅ Portas limpas"
echo ""

# Iniciar Backend Mock em background
echo "🚀 Iniciando Backend Mock..."
node backend-mock.js &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
sleep 2

# Verificar se backend iniciou
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "❌ Erro: Backend Mock não iniciou"
  exit 1
fi

echo "✅ Backend Mock rodando em http://localhost:3000"
echo ""

# Iniciar Frontend em background
echo "🚀 Iniciando Frontend Next.js..."
cd frontend-next
npm run dev -- --port 5174 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
sleep 5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ESCAMBO INICIADO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Para testar no celular:"
echo "   1. Conecte celular na mesma WiFi"
echo "   2. Abra navegador"
echo "   3. Digite: 192.168.15.10:5174"
echo ""
echo "🖥️ Para testar no navegador:"
echo "   http://localhost:5174"
echo ""
echo "🛑 Para parar: Pressione Ctrl+C"
echo ""

# Aguardar que ambos processos continuem rodando
wait

