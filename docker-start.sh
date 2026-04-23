#!/bin/bash

# ============================================
# Escambo App - Docker Start Script
# ============================================

set -e

echo "=========================================="
echo "  🐳 ESCAMBO APP - DOCKER STARTUP"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Docker installation
echo -e "${BLUE}Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado. Instale o Docker primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker encontrado${NC}"

# Check Docker Compose
echo -e "${BLUE}Verificando Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose encontrado${NC}"

echo ""
echo -e "${YELLOW}📋 Opções disponíveis:${NC}"
echo "  1) start   - Inicia todos os containers"
echo "  2) stop    - Para todos os containers"
echo "  3) restart - Reinicia todos os containers"
echo "  4) logs    - Mostra logs de todos os containers"
echo "  5) logs:backend - Mostra logs do backend"
echo "  6) logs:frontend - Mostra logs do frontend"
echo "  7) logs:mysql - Mostra logs do MySQL"
echo "  8) ps      - Mostra status dos containers"
echo "  9) build   - Reconstrói as imagens"
echo "  10) clean  - Remove containers e volumes"
echo "  11) shell:backend - Acessa shell do backend"
echo "  12) shell:frontend - Acessa shell do frontend"
echo ""

# Get action from argument or ask user
ACTION=${1:-""}

if [ -z "$ACTION" ]; then
    read -p "Escolha uma opção (1-12): " ACTION
fi

case $ACTION in
    "1"|"start")
        echo -e "${BLUE}🚀 Iniciando containers...${NC}"
        docker-compose up -d
        sleep 3
        echo ""
        echo -e "${GREEN}✓ Aplicação iniciada!${NC}"
        echo ""
        echo -e "${YELLOW}🌐 URLs:${NC}"
        echo "  Frontend:  http://localhost:5174"
        echo "  Backend:   http://localhost:3000"
        echo "  MySQL:     localhost:3306"
        echo ""
        echo -e "${YELLOW}👉 Use 'docker-compose logs -f' para ver logs em tempo real${NC}"
        ;;

    "2"|"stop")
        echo -e "${BLUE}⏹️  Parando containers...${NC}"
        docker-compose down
        echo -e "${GREEN}✓ Containers parados${NC}"
        ;;

    "3"|"restart")
        echo -e "${BLUE}🔄 Reiniciando containers...${NC}"
        docker-compose restart
        sleep 3
        echo -e "${GREEN}✓ Containers reiniciados${NC}"
        ;;

    "4"|"logs")
        echo -e "${BLUE}📜 Mostrando logs (Ctrl+C para sair)...${NC}"
        docker-compose logs -f
        ;;

    "5"|"logs:backend")
        echo -e "${BLUE}📜 Logs do Backend (Ctrl+C para sair)...${NC}"
        docker-compose logs -f backend
        ;;

    "6"|"logs:frontend")
        echo -e "${BLUE}📜 Logs do Frontend (Ctrl+C para sair)...${NC}"
        docker-compose logs -f frontend
        ;;

    "7"|"logs:mysql")
        echo -e "${BLUE}📜 Logs do MySQL (Ctrl+C para sair)...${NC}"
        docker-compose logs -f mysql
        ;;

    "8"|"ps")
        echo -e "${BLUE}📊 Status dos containers:${NC}"
        docker-compose ps
        ;;

    "9"|"build")
        echo -e "${BLUE}🔨 Reconstruindo imagens...${NC}"
        docker-compose build --no-cache
        echo -e "${GREEN}✓ Imagens reconstruídas${NC}"
        ;;

    "10"|"clean")
        echo -e "${YELLOW}⚠️  Isso vai remover containers e volumes!${NC}"
        read -p "Tem certeza? (s/n): " CONFIRM
        if [ "$CONFIRM" = "s" ] || [ "$CONFIRM" = "S" ]; then
            docker-compose down -v
            echo -e "${GREEN}✓ Limpeza concluída${NC}"
        else
            echo "Cancelado"
        fi
        ;;

    "11"|"shell:backend")
        echo -e "${BLUE}🐚 Acessando shell do Backend...${NC}"
        docker-compose exec backend sh
        ;;

    "12"|"shell:frontend")
        echo -e "${BLUE}🐚 Acessando shell do Frontend...${NC}"
        docker-compose exec frontend sh
        ;;

    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
