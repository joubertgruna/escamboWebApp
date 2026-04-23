#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         🧪 SUITE DE TESTES - ESCAMBO APP                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Reset data before starting tests
echo -e "${YELLOW}🔄 Resetando dados de teste...${NC}"
curl -s -X POST "http://localhost:3000/api/reset" > /dev/null 2>&1
sleep 1
echo ""

# Função para testar endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local expected_status=$3
  local data=$4
  local name=$5

  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "http://localhost:3000$endpoint" \
      -H "Content-Type: application/json")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "http://localhost:3000$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  status_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | sed '$d')

  if [ "$status_code" = "$expected_status" ]; then
    echo -e "${GREEN}✓ [$method] $endpoint${NC} (Status: $status_code) - $name"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}✗ [$method] $endpoint${NC} (Expected: $expected_status, Got: $status_code) - $name"
    echo -e "  Response: $body"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

# ==================== HEALTH CHECK ====================
echo -e "${YELLOW}━━━━ HEALTH CHECK ━━━━${NC}"
test_endpoint "GET" "/api/health" "200" "" "Verificar saúde do backend"
echo ""

# ==================== AUTH ENDPOINTS ====================
echo -e "${YELLOW}━━━━ AUTENTICAÇÃO ━━━━${NC}"
test_endpoint "POST" "/api/auth/login" "200" '{"email":"teste@escambo.com","password":"123456"}' "Login"
test_endpoint "POST" "/api/auth/register" "201" '{"name":"Novo User","email":"novo@escambo.com","password":"123456"}' "Registro"
test_endpoint "GET" "/api/auth/me" "200" "" "Verificar usuário autenticado"
test_endpoint "PUT" "/api/auth/profile" "200" '{"name":"Novo Nome","bio":"Minha bio"}' "Atualizar perfil"
echo ""

# ==================== ITEMS ENDPOINTS ====================
echo -e "${YELLOW}━━━━ ITEMS (PRODUTOS) ━━━━${NC}"
test_endpoint "GET" "/api/items" "200" "" "Listar todos os items"
test_endpoint "GET" "/api/items/feed" "200" "" "Feed de items"
test_endpoint "GET" "/api/items/1" "200" "" "Buscar item específico"
test_endpoint "GET" "/api/items/mine" "200" "" "Items do usuário atual"
test_endpoint "POST" "/api/items" "201" '{"title":"Novo Item","description":"Descrição","category":"electronics","condition":"good"}' "Criar novo item"
test_endpoint "PUT" "/api/items/1" "200" '{"title":"Item Atualizado","description":"Nova descrição"}' "Atualizar item"
test_endpoint "DELETE" "/api/items/1" "200" "" "Deletar item"
echo ""

# ==================== LIKES ENDPOINTS ====================
echo -e "${YELLOW}━━━━ LIKES ━━━━${NC}"
test_endpoint "GET" "/api/likes/my" "200" "" "Meus likes"
test_endpoint "GET" "/api/likes/received" "200" "" "Likes recebidos"
test_endpoint "POST" "/api/likes/1" "201" "" "Dar like em item"
test_endpoint "DELETE" "/api/likes/1" "200" "" "Remover like"
echo ""

# ==================== MATCHES ENDPOINTS ====================
echo -e "${YELLOW}━━━━ MATCHES (TROCAS) ━━━━${NC}"
test_endpoint "GET" "/api/matches" "200" "" "Listar matches"
test_endpoint "GET" "/api/matches/1" "200" "" "Detalhes do match"
test_endpoint "POST" "/api/matches" "201" '{"userId":2,"itemId":1,"matchItemId":5}' "Criar novo match"
test_endpoint "PUT" "/api/matches/1" "200" '{"status":"accepted"}' "Atualizar status do match"
echo ""

# ==================== MESSAGES ENDPOINTS ====================
echo -e "${YELLOW}━━━━ MENSAGENS/CHAT ━━━━${NC}"
test_endpoint "GET" "/api/matches/1/messages" "200" "" "Listar mensagens do match"
test_endpoint "POST" "/api/matches/1/messages" "201" '{"text":"Olá! Tudo bem?"}' "Enviar mensagem"
echo ""

# ==================== CATEGORIAS ENDPOINTS ====================
echo -e "${YELLOW}━━━━ CATEGORIAS ━━━━${NC}"
test_endpoint "GET" "/api/categories" "200" "" "Listar categorias"
echo ""

# ==================== RESULTADOS FINAIS ====================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                     📊 RESUMO DOS TESTES                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Total de testes: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "✓ Passou: ${GREEN}$PASSED_TESTS${NC}"
echo -e "✗ Falhou: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
  exit 0
else
  PERCENTAGE=$((($PASSED_TESTS * 100) / $TOTAL_TESTS))
  echo -e "${YELLOW}⚠️  Taxa de sucesso: ${PERCENTAGE}%${NC}"
  exit 1
fi
