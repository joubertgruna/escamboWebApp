#!/bin/bash

# Script para criar dados de teste: items, likes e matches

BACKEND="http://localhost:3000/api"

echo "🧪 CRIANDO DADOS DE TESTE"
echo "========================="
echo ""

# Step 1: Login
echo "1️⃣  Autenticando usuários..."
JOAO_TOKEN=$(curl -s -X POST "$BACKEND/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password123"}' | jq -r '.data.token')

MARIA_TOKEN=$(curl -s -X POST "$BACKEND/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","password":"password123"}' | jq -r '.data.token')

echo "✅ Tokens obtidos"

# Step 2: Criar item para João
echo ""
echo "2️⃣  Criando item para João..."
JOAO_ITEM=$(curl -s -X POST "$BACKEND/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JOAO_TOKEN" \
  -d '{
    "title": "MacBook Air M2",
    "description": "Laptop em perfeito estado de funcionamento",
    "category": "Eletrônicos",
    "condition": "Excelente",
    "photos": []
  }')

JOAO_ITEM_ID=$(echo "$JOAO_ITEM" | jq -r '.data.id // .id' 2>/dev/null)
echo "✅ Item de João criado (ID: $JOAO_ITEM_ID)"

# Step 3: Criar item para Maria
echo ""
echo "3️⃣  Criando item para Maria..."
MARIA_ITEM=$(curl -s -X POST "$BACKEND/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" \
  -d '{
    "title": "Monitor LG 27 polegadas",
    "description": "Monitor 4K com suporte HDMI",
    "category": "Eletrônicos",
    "condition": "Muito Bom",
    "photos": []
  }')

MARIA_ITEM_ID=$(echo "$MARIA_ITEM" | jq -r '.data.id // .id' 2>/dev/null)
echo "✅ Item de Maria criado (ID: $MARIA_ITEM_ID)"

# Step 4: João dá like no item de Maria
echo ""
echo "4️⃣  João dando like no item de Maria..."
LIKE_1=$(curl -s -X POST "$BACKEND/likes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JOAO_TOKEN" \
  -d "{\"item_id\":$MARIA_ITEM_ID}")

LIKE_1_SUCCESS=$(echo "$LIKE_1" | jq -r '.success' 2>/dev/null)
if [ "$LIKE_1_SUCCESS" == "true" ]; then
  echo "✅ Like criado"
else
  echo "⚠️  Resposta: $(echo "$LIKE_1" | jq .)"
fi

# Step 5: Maria dá like no item de João
echo ""
echo "5️⃣  Maria dando like no item de João..."
LIKE_2=$(curl -s -X POST "$BACKEND/likes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" \
  -d "{\"item_id\":$JOAO_ITEM_ID}")

LIKE_2_SUCCESS=$(echo "$LIKE_2" | jq -r '.success' 2>/dev/null)
if [ "$LIKE_2_SUCCESS" == "true" ]; then
  echo "✅ Like criado"
else
  echo "⚠️  Resposta: $(echo "$LIKE_2" | jq .)"
fi

# Step 6: Buscar matches
echo ""
echo "6️⃣  Buscando matches..."
sleep 2

MATCHES=$(curl -s -X GET "$BACKEND/matches" \
  -H "Authorization: Bearer $JOAO_TOKEN")

MATCH_COUNT=$(echo "$MATCHES" | jq '.data | length' 2>/dev/null || echo "0")
MATCH_ID=$(echo "$MATCHES" | jq -r '.data[0].id' 2>/dev/null)

echo "Total de matches: $MATCH_COUNT"
if [ "$MATCH_COUNT" -gt 0 ]; then
  echo "✅ Match criado (ID: $MATCH_ID)"
  echo ""
  echo "Detalhes do match:"
  echo "$MATCHES" | jq '.data[0]' 2>/dev/null
else
  echo "⚠️  Nenhum match criado ainda"
  exit 1
fi

# Step 7: Verificar se pode enviar mensagem
echo ""
echo "7️⃣  Enviando mensagem de teste..."
TEST_MSG=$(curl -s -X POST "$BACKEND/matches/$MATCH_ID/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MARIA_TOKEN" \
  -d '{"content":"Olá João! Está tudo bem?"}')

TEST_MSG_SUCCESS=$(echo "$TEST_MSG" | jq -r '.success' 2>/dev/null)
if [ "$TEST_MSG_SUCCESS" == "true" ]; then
  echo "✅ Mensagem enviada com sucesso!"
  echo ""
  echo "SISTEMA PRONTO PARA TESTES! ✨"
else
  echo "❌ Erro ao enviar mensagem"
  echo "$TEST_MSG" | jq .
  exit 1
fi

# Final summary
echo ""
echo "📊 RESUMO"
echo "========="
echo ""
echo "Dados criados:"
echo "  - Item de João (MacBook): ID $JOAO_ITEM_ID"
echo "  - Item de Maria (Monitor): ID $MARIA_ITEM_ID"
echo "  - Match entre João e Maria: ID $MATCH_ID"
echo "  - Mensagem de teste enviada com sucesso"
echo ""
echo "📱 PRÓXIMA AÇÃO:"
echo ""
echo "1. Recarregue o navegador: Ctrl+R"
echo "2. Abra 2 abas do navegador"
echo "3. Aba 1: Login como João"
echo "4. Aba 2: Login como Maria"
echo "5. Ambos abrem: /matches (ou Menu → Matches)"
echo "6. Clicam no match para abrir chat"
echo "7. Maria envia mensagem: 'Teste de notificação'"
echo ""
echo "✅ VALIDAÇÃO:"
echo "  [ ] Toast notification aparece em João"
echo "  [ ] Som toca (ding-ding)"
echo "  [ ] Mensagem aparece no chat"
echo ""
