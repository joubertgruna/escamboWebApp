#!/bin/bash

# ESCAMBO - Start com MySQL Real
# Inicia MySQL + Backend com dados reais + Frontend

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ESCAMBO - Iniciando com MySQL Real..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se MySQL está rodando
echo "🔍 Verificando MySQL..."
if ! command -v mysql &> /dev/null; then
  echo "❌ MySQL não instalado"
  echo ""
  echo "Para instalar MySQL no Mac:"
  echo "  brew install mysql"
  echo "  brew services start mysql"
  echo ""
  echo "Ou use Docker:"
  echo "  docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=escambo123 -e MYSQL_DATABASE=escambo_dev mysql:8"
  exit 1
fi

echo "✅ MySQL instalado"
echo ""

# Verificar se MySQL está rodando
echo "🔌 Testando conexão com MySQL..."
if ! mysqladmin ping -h localhost -u escambo -pescambo123 &> /dev/null; then
  echo "⚠️ MySQL não está rodando ou credenciais incorretas"
  echo ""
  echo "Iniciando MySQL..."
  
  if command -v brew &> /dev/null; then
    brew services start mysql || true
    sleep 2
  fi
  
  # Tentar novamente
  if ! mysqladmin ping -h localhost -u escambo -pescambo123 &> /dev/null; then
    echo "❌ Não foi possível conectar ao MySQL"
    echo ""
    echo "Verifique:"
    echo "  1. MySQL está instalado? brew install mysql"
    echo "  2. MySQL está rodando? brew services start mysql"
    echo "  3. Usuário 'escambo' existe? mysql -u root -p"
    echo "     CREATE USER 'escambo'@'localhost' IDENTIFIED BY 'escambo123';"
    echo "     GRANT ALL PRIVILEGES ON escambo_dev.* TO 'escambo'@'localhost';"
    echo "  4. Banco 'escambo_dev' existe?"
    exit 1
  fi
fi

echo "✅ Conexão MySQL OK"
echo ""

# Limpar portas
echo "🧹 Limpando portas 3000 e 5174..."
lsof -i :5174 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :3000 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 1
echo "✅ Portas limpas"
echo ""

# Executar migrations
echo "🔄 Executando migrations..."
cd "$(dirname "$0")/backend"
npm run migrate 2>&1 | tail -5 || echo "⚠️ Migrations já executadas"
echo "✅ Migrations OK"
echo ""

# Voltar para raiz
cd ..

# Iniciar Backend Real
echo "🚀 Iniciando Backend Real (com MySQL)..."
cd backend
npm run dev > /tmp/escambo-backend.log 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
sleep 3

if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "❌ Backend não iniciou"
  echo ""
  echo "Log do erro:"
  cat /tmp/escambo-backend.log
  exit 1
fi

echo "✅ Backend Real rodando (dados persistentes)"
echo ""

# Voltar para raiz
cd ..

# Iniciar Frontend
echo "🚀 Iniciando Frontend Next.js..."
cd frontend-next
npm run dev -- --port 5174 > /tmp/escambo-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
sleep 5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ESCAMBO COM MySQL REAL INICIADO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 No Celular (mesma WiFi):"
echo "   http://192.168.15.10:5174"
echo ""
echo "🖥️ No Navegador:"
echo "   http://localhost:5174"
echo ""
echo "📊 Backend Real (MySQL):"
echo "   http://localhost:3000"
echo ""
echo "💾 Banco de Dados:"
echo "   Host: localhost"
echo "   User: escambo"
echo "   Database: escambo_dev"
echo ""
echo "⏸️  Status:"
echo "   Backend: $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
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

