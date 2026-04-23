#!/bin/bash

# Teste de Endpoints da API

echo "🧪 Iniciando testes de endpoints da API..."
echo ""

BASE_URL="http://localhost:3000/api"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected=$3
    
    echo -n "Testing $method $endpoint... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if echo "$http_code" | grep -qE "$expected"; then
        echo -e "${GREEN}✓ ($http_code)${NC}"
    else
        echo -e "${RED}✗ (HTTP $http_code)${NC}"
        echo "  Response: $body"
    fi
}

# Testes de GET endpoints públicos
echo -e "${YELLOW}=== Testando Endpoints Públicos ===${NC}"
test_endpoint "GET" "/health" "200|404"
test_endpoint "GET" "/items" "200|401"
test_endpoint "GET" "/items/feed" "200|401"

# Testes sem autenticação
echo ""
echo -e "${YELLOW}=== Testando Endpoints de Auth ===${NC}"
test_endpoint "POST" "/auth/login" "400|401"
test_endpoint "POST" "/auth/register" "400|422"

echo ""
echo -e "${YELLOW}=== Status Final ===${NC}"
echo -e "${GREEN}✅ Testes de endpoint concluídos${NC}"
echo ""
echo "💡 Para testes com autenticação, execute após fazer login"
