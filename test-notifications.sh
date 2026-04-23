#!/bin/bash

# Script auxiliar para testar notificações
# Uso: ./test-notifications.sh

echo "🧪 Script Auxiliar - Testes 1 e 2"
echo "=================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs
BACKEND="http://localhost:3000"
FRONTEND="http://localhost:5173"

echo -e "${BLUE}📋 VERIFICAR CONEXÕES${NC}"
echo ""

# Verificar Backend
echo -n "Backend: "
if curl -s "$BACKEND/api/health" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Conectado (porta 3000)${NC}"
else
  echo -e "${RED}❌ Não respondendo${NC}"
  exit 1
fi

# Verificar Frontend
echo -n "Frontend: "
if curl -s "$FRONTEND" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Conectado (porta 5173)${NC}"
else
  echo -e "${RED}❌ Não respondendo${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}🔑 GERAR TOKENS DE TESTE${NC}"
echo ""

# Login João
echo "Tentando login como João..."
JOAO_LOGIN=$(curl -s -X POST "$BACKEND/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password123"}')

JOAO_TOKEN=$(echo $JOAO_LOGIN | jq -r '.token' 2>/dev/null)

if [ "$JOAO_TOKEN" != "null" ] && [ ! -z "$JOAO_TOKEN" ]; then
  echo -e "${GREEN}✅ João autenticado${NC}"
  echo "Token (primeiros 20 chars): ${JOAO_TOKEN:0:20}..."
else
  echo -e "${RED}❌ Falha ao autenticar João${NC}"
  echo "Resposta: $JOAO_LOGIN"
fi

echo ""

# Login Maria
echo "Tentando login como Maria..."
MARIA_LOGIN=$(curl -s -X POST "$BACKEND/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","password":"password123"}')

MARIA_TOKEN=$(echo $MARIA_LOGIN | jq -r '.token' 2>/dev/null)

if [ "$MARIA_TOKEN" != "null" ] && [ ! -z "$MARIA_TOKEN" ]; then
  echo -e "${GREEN}✅ Maria autenticada${NC}"
  echo "Token (primeiros 20 chars): ${MARIA_TOKEN:0:20}..."
else
  echo -e "${RED}❌ Falha ao autenticar Maria${NC}"
  echo "Resposta: $MARIA_LOGIN"
fi

echo ""
echo -e "${BLUE}📱 INSTRUÇÕES PARA TESTES${NC}"
echo ""
echo -e "${YELLOW}1. Abra 2 abas do navegador:${NC}"
echo "   Aba 1: $FRONTEND"
echo "   Aba 2: $FRONTEND"
echo ""
echo -e "${YELLOW}2. Aba 1 - Login como João:${NC}"
echo "   Email: joao@example.com"
echo "   Senha: password123"
echo ""
echo -e "${YELLOW}3. Aba 2 - Login como Maria:${NC}"
echo "   Email: maria@example.com"
echo "   Senha: password123"
echo ""
echo -e "${YELLOW}4. Teste 1 - Toast Notification:${NC}"
echo "   - João abre chat com Maria"
echo "   - Maria envia: 'Olá João, tudo bem?'"
echo "   - ✅ Validar pop-up no canto inferior direito"
echo ""
echo -e "${YELLOW}5. Teste 2 - Som:${NC}"
echo "   - Maria envia: 'Como vai o trabalho?'"
echo "   - ✅ Validar som 'ding-ding' (800Hz + 1000Hz)"
echo ""
echo -e "${GREEN}Tudo pronto! Abra as abas e siga os passos acima.${NC}"
echo ""
