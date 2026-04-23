#!/bin/bash

################################################################################
#
#  ESCAMBO - Docker Build & Start (Simples e Direto)
#  Faz build e inicia MySQL + Backend + Frontend
#
################################################################################

set -e

PROJECT_ROOT="/Users/joubertgabriel/Documents/CodePlace/EscamboWebApp"
cd "$PROJECT_ROOT"

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║      🐳 ESCAMBO - DOCKER BUILD & START                             ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não instalado!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não instalado!"
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"
echo ""

# Parar containers antigos
echo "🛑 Parando containers antigos..."
docker-compose down 2>/dev/null || true
sleep 2

# Build
echo ""
echo "🔨 Fazendo BUILD das imagens..."
echo ""
docker-compose build

# Iniciar
echo ""
echo "🚀 Iniciando containers..."
echo ""
docker-compose up -d

# Aguardar inicialização
echo ""
echo "⏳ Aguardando serviços iniciarem (15 segundos)..."
sleep 15

# Status
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "✅ ESCAMBO COM DOCKER INICIADO!"
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "📱 Abra no navegador:"
echo "   🖥️  http://localhost:5174"
echo ""
echo "📋 Comandos úteis:"
echo "   Logs (todos):        docker-compose logs -f"
echo "   Logs (backend):      docker-compose logs -f backend"
echo "   Logs (frontend):     docker-compose logs -f frontend"
echo "   Parar:               docker-compose down"
echo "   Status:              docker-compose ps"
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""
