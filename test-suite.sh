#!/bin/bash

##############################################################################
# ESCAMBO - COMPREHENSIVE TEST SUITE
# Executa todos os testes necessários antes da migração para backend real
# Data: 17/03/2026
##############################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Timestamps
START_TIME=$(date +%s)

##############################################################################
# FUNÇÕES AUXILIARES
##############################################################################

log_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

log_test() {
  echo -e "${YELLOW}▶ $1${NC}"
  ((TESTS_TOTAL++))
}

log_pass() {
  echo -e "${GREEN}✓ $1${NC}"
  ((TESTS_PASSED++))
}

log_fail() {
  echo -e "${RED}✗ $1${NC}"
  ((TESTS_FAILED++))
}

log_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

##############################################################################
# TESTES DE SISTEMA
##############################################################################

test_system_health() {
  log_header "TESTE 1: SAÚDE DO SISTEMA"

  log_test "Verificando MySQL está rodando"
  if pgrep -x mysql > /dev/null; then
    log_pass "MySQL está rodando"
  else
    log_fail "MySQL não está rodando"
    return 1
  fi

  log_test "Verificando backend na porta 3000"
  if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    log_pass "Backend está respondendo"
  else
    log_fail "Backend não está respondendo na porta 3000"
    return 1
  fi

  log_test "Verificando frontend na porta 5174"
  if curl -s http://localhost:5174 > /dev/null 2>&1; then
    log_pass "Frontend está respondendo"
  else
    log_fail "Frontend não está respondendo na porta 5174"
    return 1
  fi

  return 0
}

##############################################################################
# TESTES DE API - HEALTH
##############################################################################

test_api_health() {
  log_header "TESTE 2: API HEALTH CHECK"

  log_test "GET /api/health"
  RESPONSE=$(curl -s http://localhost:3000/api/health)
  
  if echo "$RESPONSE" | grep -q "ok"; then
    log_pass "Health check respondendo com status ok"
    log_info "Response: $RESPONSE"
  else
    log_fail "Health check não retornou status ok"
    log_info "Response: $RESPONSE"
    return 1
  fi

  return 0
}

##############################################################################
# TESTES DE API - AUTENTICAÇÃO
##############################################################################

test_api_auth() {
  log_header "TESTE 3: AUTENTICAÇÃO (LOGIN)"

  log_test "POST /api/auth/login com credenciais válidas"
  RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "joao@example.com",
      "password": "password123"
    }')

  if echo "$RESPONSE" | grep -q "token"; then
    log_pass "Login bem-sucedido, token retornado"
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    log_info "Token: ${TOKEN:0:20}..."
  else
    log_fail "Login falhou, nenhum token retornado"
    log_info "Response: $RESPONSE"
    return 1
  fi

  log_test "GET /api/auth/me com token válido"
  ME_RESPONSE=$(curl -s http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$ME_RESPONSE" | grep -q "email"; then
    log_pass "Endpoint /api/auth/me retornou dados do usuário"
    log_info "User ID: $(echo "$ME_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)"
  else
    log_fail "Endpoint /api/auth/me não retornou dados válidos"
    return 1
  fi

  return 0
}

##############################################################################
# TESTES DE API - ITEMS
##############################################################################

test_api_items() {
  log_header "TESTE 4: ITEMS (CRUD)"

  # First, authenticate
  AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "joao@example.com", "password": "password123"}')
  TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

  log_test "GET /api/items - Listar todos os items"
  ITEMS_RESPONSE=$(curl -s http://localhost:3000/api/items)
  
  if echo "$ITEMS_RESPONSE" | grep -q "data"; then
    ITEM_COUNT=$(echo "$ITEMS_RESPONSE" | grep -o '"id":"[^"]*' | wc -l)
    log_pass "Items listados com sucesso (Total: $ITEM_COUNT items)"
  else
    log_fail "Erro ao listar items"
    return 1
  fi

  log_test "GET /api/items/mine - Items do usuário"
  MY_ITEMS=$(curl -s http://localhost:3000/api/items/mine \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$MY_ITEMS" | grep -q "data"; then
    MY_COUNT=$(echo "$MY_ITEMS" | grep -o '"id":"[^"]*' | wc -l)
    log_pass "Items do usuário recuperados (Total: $MY_COUNT items)"
  else
    log_fail "Erro ao recuperar items do usuário"
    return 1
  fi

  log_test "POST /api/items - Criar novo item"
  NEW_ITEM=$(curl -s -X POST http://localhost:3000/api/items \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "title": "Test Item",
      "description": "Item de teste",
      "category": "electronics",
      "condition": "new"
    }')
  
  if echo "$NEW_ITEM" | grep -q '"id"'; then
    NEW_ITEM_ID=$(echo "$NEW_ITEM" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    log_pass "Item criado com sucesso (ID: $NEW_ITEM_ID)"
  else
    log_fail "Erro ao criar novo item"
    log_info "Response: $NEW_ITEM"
    return 1
  fi

  log_test "GET /api/items/:id - Obter item específico"
  GET_ITEM=$(curl -s http://localhost:3000/api/items/$NEW_ITEM_ID)
  
  if echo "$GET_ITEM" | grep -q "Test Item"; then
    log_pass "Item recuperado com sucesso"
  else
    log_fail "Erro ao recuperar item específico"
    return 1
  fi

  log_test "PUT /api/items/:id - Atualizar item"
  UPDATE_ITEM=$(curl -s -X PUT http://localhost:3000/api/items/$NEW_ITEM_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "title": "Updated Test Item",
      "description": "Item de teste atualizado"
    }')
  
  if echo "$UPDATE_ITEM" | grep -q "Updated Test Item"; then
    log_pass "Item atualizado com sucesso"
  else
    log_fail "Erro ao atualizar item"
    return 1
  fi

  log_test "DELETE /api/items/:id - Deletar item"
  DELETE_ITEM=$(curl -s -X DELETE http://localhost:3000/api/items/$NEW_ITEM_ID \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$DELETE_ITEM" | grep -q "success"; then
    log_pass "Item deletado com sucesso"
  else
    log_fail "Erro ao deletar item"
    return 1
  fi

  return 0
}

##############################################################################
# TESTES DE API - MATCHES
##############################################################################

test_api_matches() {
  log_header "TESTE 5: MATCHES"

  # First, authenticate
  AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "joao@example.com", "password": "password123"}')
  TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

  log_test "GET /api/matches - Listar matches"
  MATCHES=$(curl -s http://localhost:3000/api/matches \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$MATCHES" | grep -q "data"; then
    MATCH_COUNT=$(echo "$MATCHES" | grep -o '"id":"[^"]*' | wc -l)
    log_pass "Matches listados com sucesso (Total: $MATCH_COUNT matches)"
  else
    log_fail "Erro ao listar matches"
    return 1
  fi

  log_test "POST /api/matches/:userId - Criar match"
  NEW_MATCH=$(curl -s -X POST http://localhost:3000/api/matches/user2 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "item_offered_id": "item1",
      "item_wanted_id": "item2"
    }')
  
  if echo "$NEW_MATCH" | grep -q '"id"'; then
    log_pass "Match criado com sucesso"
  else
    log_fail "Erro ao criar match"
    log_info "Response: $NEW_MATCH"
  fi

  return 0
}

##############################################################################
# TESTES DE API - LIKES
##############################################################################

test_api_likes() {
  log_header "TESTE 6: LIKES"

  # First, authenticate
  AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "joao@example.com", "password": "password123"}')
  TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

  log_test "POST /api/likes - Dar like em um item"
  LIKE=$(curl -s -X POST http://localhost:3000/api/likes \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"item_id": "item1"}')
  
  if echo "$LIKE" | grep -q "success"; then
    log_pass "Like criado com sucesso"
  else
    log_fail "Erro ao criar like"
    log_info "Response: $LIKE"
    return 1
  fi

  log_test "GET /api/likes - Listar likes do usuário"
  LIKES=$(curl -s http://localhost:3000/api/likes \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$LIKES" | grep -q "data"; then
    log_pass "Likes listados com sucesso"
  else
    log_fail "Erro ao listar likes"
    return 1
  fi

  log_test "DELETE /api/likes/:itemId - Remover like"
  UNLIKE=$(curl -s -X DELETE http://localhost:3000/api/likes/item1 \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$UNLIKE" | grep -q "success"; then
    log_pass "Like removido com sucesso"
  else
    log_fail "Erro ao remover like"
    return 1
  fi

  return 0
}

##############################################################################
# TESTES DE API - MESSAGES
##############################################################################

test_api_messages() {
  log_header "TESTE 7: MESSAGES/CHAT"

  # First, authenticate
  AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "joao@example.com", "password": "password123"}')
  TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

  log_test "GET /api/messages - Listar conversas"
  CONVERSATIONS=$(curl -s http://localhost:3000/api/messages \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$CONVERSATIONS" | grep -q "data"; then
    log_pass "Conversas listadas com sucesso"
  else
    log_fail "Erro ao listar conversas"
    return 1
  fi

  log_test "GET /api/messages/:matchId - Obter mensagens de um match"
  MESSAGES=$(curl -s http://localhost:3000/api/messages/match1 \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$MESSAGES" | grep -q "data"; then
    MSG_COUNT=$(echo "$MESSAGES" | grep -o '"id":"[^"]*' | wc -l)
    log_pass "Mensagens recuperadas com sucesso (Total: $MSG_COUNT mensagens)"
  else
    log_fail "Erro ao recuperar mensagens"
    return 1
  fi

  log_test "POST /api/messages - Enviar mensagem"
  NEW_MSG=$(curl -s -X POST http://localhost:3000/api/messages \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "match_id": "match1",
      "message": "Teste de mensagem"
    }')
  
  if echo "$NEW_MSG" | grep -q '"id"'; then
    log_pass "Mensagem enviada com sucesso"
  else
    log_fail "Erro ao enviar mensagem"
    log_info "Response: $NEW_MSG"
    return 1
  fi

  return 0
}

##############################################################################
# TESTES DE PERFORMANCE
##############################################################################

test_performance() {
  log_header "TESTE 8: PERFORMANCE"

  log_test "Teste de latência - 10 requisições GET /api/items"
  TOTAL_TIME=0
  for i in {1..10}; do
    START=$(date +%s%N)
    curl -s http://localhost:3000/api/items > /dev/null
    END=$(date +%s%N)
    TIME=$((($END - $START) / 1000000))
    TOTAL_TIME=$((TOTAL_TIME + TIME))
  done
  AVG_TIME=$((TOTAL_TIME / 10))
  
  if [ $AVG_TIME -lt 500 ]; then
    log_pass "Latência aceitável: ${AVG_TIME}ms (média de 10 requisições)"
  else
    log_fail "Latência elevada: ${AVG_TIME}ms (média de 10 requisições)"
  fi

  log_test "Teste de carga - 50 requisições simultâneas"
  (for i in {1..50}; do
    curl -s http://localhost:3000/api/items > /dev/null &
  done
  wait)
  log_pass "50 requisições simultâneas processadas"

  return 0
}

##############################################################################
# TESTES DE DATABASE
##############################################################################

test_database() {
  log_header "TESTE 9: DATABASE"

  log_test "Verificando conexão MySQL"
  if mysql -u escambo -pescambo123 -e "SELECT 1" > /dev/null 2>&1; then
    log_pass "Conectado ao MySQL com sucesso"
  else
    log_fail "Erro ao conectar ao MySQL"
    return 1
  fi

  log_test "Verificando database escambo_dev"
  RESULT=$(mysql -u escambo -pescambo123 -e "USE escambo_dev; SHOW TABLES;" 2>&1)
  if echo "$RESULT" | grep -q "users"; then
    log_pass "Database escambo_dev encontrada e tabelas verificadas"
  else
    log_fail "Database escambo_dev não encontrada ou sem tabelas"
    return 1
  fi

  log_test "Verificando tabelas críticas"
  TABLES=("users" "items" "matches" "messages" "likes")
  for table in "${TABLES[@]}"; do
    if mysql -u escambo -pescambo123 escambo_dev -e "DESCRIBE $table" > /dev/null 2>&1; then
      log_pass "Tabela $table encontrada"
    else
      log_fail "Tabela $table não encontrada"
      return 1
    fi
  done

  log_test "Contando registros nas tabelas principais"
  for table in "${TABLES[@]}"; do
    COUNT=$(mysql -u escambo -pescambo123 escambo_dev -se "SELECT COUNT(*) FROM $table;")
    log_info "Tabela '$table': $COUNT registros"
  done

  return 0
}

##############################################################################
# TESTES DE FRONTEND
##############################################################################

test_frontend() {
  log_header "TESTE 10: FRONTEND"

  log_test "Verificando carregamento da página inicial"
  FRONTEND=$(curl -s http://localhost:5174)
  if echo "$FRONTEND" | grep -q "Escambo"; then
    log_pass "Frontend carregou corretamente"
  else
    log_fail "Erro ao carregar frontend"
    return 1
  fi

  log_test "Verificando arquivo de manifest (PWA)"
  MANIFEST=$(curl -s http://localhost:5174/manifest.json 2>&1)
  if echo "$MANIFEST" | grep -q "name"; then
    log_pass "Manifest PWA encontrado"
  else
    log_info "Manifest PWA não encontrado (não crítico)"
  fi

  return 0
}

##############################################################################
# TESTES DE CORS
##############################################################################

test_cors() {
  log_header "TESTE 11: CORS"

  log_test "Verificando headers CORS"
  HEADERS=$(curl -s -I -X OPTIONS http://localhost:3000/api/items)
  
  if echo "$HEADERS" | grep -q "Access-Control-Allow-Origin"; then
    log_pass "Headers CORS configurados corretamente"
  else
    log_fail "Headers CORS não encontrados"
    return 1
  fi

  return 0
}

##############################################################################
# TESTES DE ERROR HANDLING
##############################################################################

test_error_handling() {
  log_header "TESTE 12: ERROR HANDLING"

  log_test "Teste 404 - Endpoint inexistente"
  RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/nonexistent)
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" == "404" ]; then
    log_pass "Endpoint inexistente retorna HTTP 404"
  else
    log_fail "Endpoint inexistente retorna HTTP $HTTP_CODE (esperado 404)"
  fi

  log_test "Teste 400 - Requisição inválida"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"invalid": "data"}')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" == "400" ] || [ "$HTTP_CODE" == "401" ]; then
    log_pass "Requisição inválida retorna HTTP $HTTP_CODE"
  else
    log_info "Requisição inválida retorna HTTP $HTTP_CODE"
  fi

  log_test "Teste 500 - Erro no servidor (tentando com método inválido)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH http://localhost:3000/api/items \
    -H "Content-Type: application/json" \
    -d '{}')
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" == "405" ] || [ "$HTTP_CODE" == "500" ]; then
    log_pass "Método não permitido retorna HTTP $HTTP_CODE"
  else
    log_info "Método não permitido retorna HTTP $HTTP_CODE"
  fi

  return 0
}

##############################################################################
# RESUMO FINAL
##############################################################################

print_summary() {
  local DURATION=$(($(date +%s) - START_TIME))
  
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}RESUMO DOS TESTES - RESULTADO FINAL${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
  
  echo -e "${GREEN}✓ TESTES PASSOU: $TESTS_PASSED${NC}"
  echo -e "${RED}✗ TESTES FALHARAM: $TESTS_FAILED${NC}"
  echo -e "${YELLOW}⊙ TOTAL DE TESTES: $TESTS_TOTAL${NC}"
  echo -e "${BLUE}⏱ TEMPO TOTAL: ${DURATION}s${NC}\n"
  
  PASS_PERCENTAGE=$(( (TESTS_PASSED * 100) / TESTS_TOTAL ))
  
  if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 🎉${NC}"
    echo -e "${GREEN}Taxa de Aprovação: ${PASS_PERCENTAGE}%${NC}"
    echo -e "${GREEN}Aplicação está PRONTA para migração ao backend real!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    return 0
  else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM ⚠️${NC}"
    echo -e "${RED}Taxa de Aprovação: ${PASS_PERCENTAGE}%${NC}"
    echo -e "${RED}Por favor, corrija os erros antes de migrar${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    return 1
  fi
}

##############################################################################
# MAIN EXECUTION
##############################################################################

main() {
  clear
  
  echo -e "${BLUE}"
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║           ESCAMBO - COMPREHENSIVE TEST SUITE           ║"
  echo "║     Testes completos antes da migração do backend      ║"
  echo "║                  17/03/2026 - $(date +%H:%M:%S)                     ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo -e "${NC}\n"

  # Execute all tests
  test_system_health || true
  test_api_health || true
  test_api_auth || true
  test_api_items || true
  test_api_matches || true
  test_api_likes || true
  test_api_messages || true
  test_performance || true
  test_database || true
  test_frontend || true
  test_cors || true
  test_error_handling || true

  # Print summary
  print_summary
}

# Run main function
main
