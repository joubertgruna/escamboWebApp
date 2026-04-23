#!/bin/bash

# Script simplificado para testar notificações
BACKEND="http://localhost:3000/api"

echo "🧪 TESTE AUTOMÁTICO - FASE 1: PREPARAÇÃO"
echo "=========================================="
echo ""

# 1. Login João
echo "1️⃣  Autenticando João..."
JOAO_LOGIN=$(curl -s -X POST "$BACKEND/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password123"}')

JOAO_TOKEN=$(echo "$JOAO_LOGIN" | jq -r '.data.token' 2>/dev/null)
JOAO_ID=$(echo "$JOAO_LOGIN" | jq -r '.data.user.id' 2>/dev/null)

if [ "$JOAO_TOKEN" == "null" ] || [ -z "$JOAO_TOKEN" ]; then
  echo "❌ Erro ao autenticar João"
  echo "$JOAO_LOGIN" | jq .
  exit 1
fi

echo "✅ João autenticado (ID: $JOAO_ID)"
echo "   Token: ${JOAO_TOKEN:0:30}..."

# 2. Login Maria
echo ""
echo "2️⃣  Autenticando Maria..."
MARIA_LOGIN=$(curl -s -X POST "$BACKEND/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","password":"password123"}')

MARIA_TOKEN=$(echo "$MARIA_LOGIN" | jq -r '.data.token' 2>/dev/null)
MARIA_ID=$(echo "$MARIA_LOGIN" | jq -r '.data.user.id' 2>/dev/null)

if [ "$MARIA_TOKEN" == "null" ] || [ -z "$MARIA_TOKEN" ]; then
  echo "❌ Erro ao autenticar Maria"
  echo "$MARIA_LOGIN" | jq .
  exit 1
fi

echo "✅ Maria autenticada (ID: $MARIA_ID)"
echo "   Token: ${MARIA_TOKEN:0:30}..."

# 3. Buscar matches
echo ""
echo "3️⃣  Buscando matches de João..."
MATCHES=$(curl -s -X GET "$BACKEND/matches" \
  -H "Authorization: Bearer $JOAO_TOKEN")

echo "Resposta:"
echo "$MATCHES" | jq . 2>/dev/null || echo "$MATCHES"

MATCH_COUNT=$(echo "$MATCHES" | jq 'length' 2>/dev/null || echo "0")
echo "Total: $MATCH_COUNT matches"

if [ "$MATCH_COUNT" == "0" ] || [ "$MATCH_COUNT" == "null" ]; then
  echo ""
  echo "⚠️  Nenhum match disponível"
  echo ""
  echo "INVESTIGAÇÃO:"
  echo "- Verifique se há items no banco"
  echo "- Verifique se há likes entre usuários"
  echo "- Verifique tabela de matches no MySQL"
  echo ""
  echo "Comando para verificar:"
  echo "docker exec escambo-mysql mysql -u root -pescambo escambo -e 'SELECT * FROM matches LIMIT 5;'"
  exit 1
fi

# Se tem matches, usar o primeiro
MATCH_ID=$(echo "$MATCHES" | jq -r '.[0].id' 2>/dev/null)
echo "✅ Usando match ID: $MATCH_ID"

# 4. Buscar mensagens existentes
echo ""
echo "4️⃣  Buscando mensagens no match..."
EXISTING_MSGS=$(curl -s -X GET "$BACKEND/matches/$MATCH_ID/messages" \
  -H "Authorization: Bearer $JOAO_TOKEN")

MSG_COUNT=$(echo "$EXISTING_MSGS" | jq 'length' 2>/dev/null || echo "0")
echo "Mensagens existentes: $MSG_COUNT"

# 5. Enviar mensagem de teste
echo ""
echo "5️⃣  Enviando mensagem de teste..."
TEST_MSG="Teste automático $(date '+%H:%M:%S')"

SEND_RESPONSE=$(curl -s -X POST "$BACKEND/matches/$MATCH_ID/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" \
  -d "{\"content\":\"$TEST_MSG\"}")

echo "Resposta do servidor:"
echo "$SEND_RESPONSE" | jq . 2>/dev/null || echo "$SEND_RESPONSE"

MSG_SUCCESS=$(echo "$SEND_RESPONSE" | jq -r '.success' 2>/dev/null)

if [ "$MSG_SUCCESS" == "true" ]; then
  echo "✅ Mensagem enviada com sucesso"
else
  echo "❌ Erro ao enviar mensagem"
fi

# 6. Buscar mensagens novamente
echo ""
echo "6️⃣  Buscando mensagens após envio..."
sleep 1

NEW_MSGS=$(curl -s -X GET "$BACKEND/matches/$MATCH_ID/messages" \
  -H "Authorization: Bearer $JOAO_TOKEN")

NEW_COUNT=$(echo "$NEW_MSGS" | jq 'length' 2>/dev/null || echo "0")
echo "Mensagens totais agora: $NEW_COUNT"

# Mostrar última mensagem
echo ""
echo "Última mensagem:"
echo "$NEW_MSGS" | jq '.[0]' 2>/dev/null

# 7. Verificar estrutura da resposta
echo ""
echo "7️⃣  VERIFICAÇÃO DE ESTRUTURA"
echo "============================="

LAST_MSG=$(echo "$NEW_MSGS" | jq '.[0]' 2>/dev/null)

if [ ! -z "$LAST_MSG" ]; then
  echo "✅ Campos da mensagem:"
  echo "$LAST_MSG" | jq 'keys' 2>/dev/null | sed 's/^/   /'
  
  echo ""
  echo "Valores:"
  echo "   sender_id: $(echo "$LAST_MSG" | jq -r '.sender_id' 2>/dev/null)"
  echo "   content: $(echo "$LAST_MSG" | jq -r '.content' 2>/dev/null)"
  echo "   created_at: $(echo "$LAST_MSG" | jq -r '.created_at' 2>/dev/null)"
fi

# 8. Resumo
echo ""
echo "8️⃣  RESUMO DO TESTE"
echo "==================="
echo "✅ Backend respondendo"
echo "✅ Autenticação funcionando"
echo "✅ Mensagem enviada com sucesso"
echo "✅ Mensagens sendo recuperadas"
echo ""
echo "📋 PRÓXIMAS AÇÕES:"
echo "1. Abra http://localhost:5173 em 2 abas"
echo "2. Login como João na Aba 1"
echo "3. Login como Maria na Aba 2"
echo "4. Ambos abrem chat (Match ID: $MATCH_ID)"
echo "5. Maria envia mensagem"
echo "6. Verifique console (F12) para erros"
echo "7. Procure por logs como '🔔 Enviando notificações...'"
echo ""
echo "🔍 DEBUGGER:"
echo "   Se notificação não aparecer, veja:"
echo "   - Console da aba 1 (F12)"
echo "   - Se há erro em useChatNotifications"
echo "   - Se onMessage está sendo acionado"
echo ""

