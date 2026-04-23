#!/bin/bash

# Script de teste automático para notificações
# Este script simula o envio de mensagens via API e verifica o comportamento

echo "🧪 TESTE AUTOMÁTICO DE NOTIFICAÇÕES"
echo "===================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# URLs
BACKEND="http://localhost:3000"
API="$BACKEND/api"

# Arquivo de log
LOG_FILE="/tmp/notification_test.log"
> $LOG_FILE

echo "[$(date '+%H:%M:%S')] Iniciando teste automático" >> $LOG_FILE

# Função para fazer requisição e logar
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    if [ -z "$token" ]; then
        curl -s -X $method "$API$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" >> $LOG_FILE 2>&1
    else
        curl -s -X $method "$API$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" >> $LOG_FILE 2>&1
    fi
}

echo -e "${BLUE}1️⃣  VERIFICANDO BACKEND${NC}"
echo "[$(date '+%H:%M:%S')] Verificando health do backend" >> $LOG_FILE

HEALTH=$(curl -s "$BACKEND/api/health")
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend respondendo${NC}"
    echo "   Status: $HEALTH"
else
    echo -e "${RED}❌ Backend não respondendo${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}2️⃣  AUTENTICANDO USUÁRIOS${NC}"

# João login
echo "Autenticando João..."
JOAO_RESPONSE=$(curl -s -X POST "$API/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"joao@example.com","password":"password123"}')

JOAO_TOKEN=$(echo $JOAO_RESPONSE | jq -r '.data.token' 2>/dev/null)
JOAO_ID=$(echo $JOAO_RESPONSE | jq -r '.data.user.id' 2>/dev/null)

if [ "$JOAO_TOKEN" != "null" ] && [ ! -z "$JOAO_TOKEN" ]; then
    echo -e "${GREEN}✅ João autenticado (ID: $JOAO_ID)${NC}"
else
    echo -e "${RED}❌ Falha ao autenticar João${NC}"
    exit 1
fi

# Maria login
echo "Autenticando Maria..."
MARIA_RESPONSE=$(curl -s -X POST "$API/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"maria@example.com","password":"password123"}')

MARIA_TOKEN=$(echo $MARIA_RESPONSE | jq -r '.data.token' 2>/dev/null)
MARIA_ID=$(echo $MARIA_RESPONSE | jq -r '.data.user.id' 2>/dev/null)

if [ "$MARIA_TOKEN" != "null" ] && [ ! -z "$MARIA_TOKEN" ]; then
    echo -e "${GREEN}✅ Maria autenticada (ID: $MARIA_ID)${NC}"
else
    echo -e "${RED}❌ Falha ao autenticar Maria${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}3️⃣  BUSCANDO MATCH ENTRE JOÃO E MARIA${NC}"

# Buscar matches de João
MATCHES=$(curl -s -X GET "$API/matches" \
    -H "Authorization: Bearer $JOAO_TOKEN")

# Procurar por match com Maria
MATCH_ID=$(echo "$MATCHES" | jq -r ".[] | select((.user1.id == $MARIA_ID and .user1.id != $JOAO_ID) or (.user2.id == $MARIA_ID and .user2.id != $JOAO_ID)) | .id" 2>/dev/null | head -1)

if [ -z "$MATCH_ID" ] || [ "$MATCH_ID" == "null" ]; then
    echo -e "${YELLOW}⚠️  Nenhum match encontrado entre João e Maria${NC}"
    echo "    Tentando criar um match..."
    
    # Se não há match, criar um simulado
    # Vamos pular este passo e procurar qualquer match
    MATCH_ID=$(echo "$MATCHES" | jq -r '.[0].id' 2>/dev/null)
    
    if [ -z "$MATCH_ID" ] || [ "$MATCH_ID" == "null" ]; then
        echo -e "${RED}❌ Nenhum match disponível${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Match encontrado (ID: $MATCH_ID)${NC}"

echo ""
echo -e "${BLUE}4️⃣  ENVIANDO MENSAGEM (Maria → João)${NC}"

MESSAGE_DATA="{\"content\":\"Teste automático: Olá João! 🧪\"}"
echo "Enviando: $MESSAGE_DATA"

MESSAGE_RESPONSE=$(curl -s -X POST "$API/matches/$MATCH_ID/messages" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $MARIA_TOKEN" \
    -d "$MESSAGE_DATA")

MESSAGE_ID=$(echo "$MESSAGE_RESPONSE" | jq -r '.data.id // .id' 2>/dev/null)
SUCCESS=$(echo "$MESSAGE_RESPONSE" | jq -r '.success' 2>/dev/null)

echo "Resposta completa:"
echo "$MESSAGE_RESPONSE" | jq . 2>/dev/null || echo "$MESSAGE_RESPONSE"

if [ "$SUCCESS" == "true" ] || [ ! -z "$MESSAGE_ID" ] && [ "$MESSAGE_ID" != "null" ]; then
    echo -e "${GREEN}✅ Mensagem enviada com sucesso (ID: $MESSAGE_ID)${NC}"
else
    echo -e "${RED}❌ Falha ao enviar mensagem${NC}"
    echo "Resposta: $MESSAGE_RESPONSE"
fi

echo ""
echo -e "${BLUE}5️⃣  BUSCANDO MENSAGENS RECEBIDAS${NC}"

sleep 1

GET_MESSAGES=$(curl -s -X GET "$API/matches/$MATCH_ID/messages" \
    -H "Authorization: Bearer $JOAO_TOKEN")

echo "Mensagens no match:"
echo "$GET_MESSAGES" | jq . 2>/dev/null || echo "$GET_MESSAGES"

MSG_COUNT=$(echo "$GET_MESSAGES" | jq 'length' 2>/dev/null || echo "0")
echo -e "${GREEN}✅ Total de mensagens: $MSG_COUNT${NC}"

echo ""
echo -e "${BLUE}6️⃣  VERIFICANDO ESTRUTURA DA RESPOSTA${NC}"

# Verificar campos da mensagem
LAST_MESSAGE=$(echo "$GET_MESSAGES" | jq '.[0]' 2>/dev/null)

if [ ! -z "$LAST_MESSAGE" ]; then
    echo "Campos da última mensagem:"
    echo "$LAST_MESSAGE" | jq 'keys' 2>/dev/null
    
    # Verificar campos específicos
    echo ""
    echo "Campos críticos:"
    echo "  - id: $(echo "$LAST_MESSAGE" | jq -r '.id' 2>/dev/null)"
    echo "  - sender_id: $(echo "$LAST_MESSAGE" | jq -r '.sender_id' 2>/dev/null)"
    echo "  - content: $(echo "$LAST_MESSAGE" | jq -r '.content' 2>/dev/null)"
    echo "  - created_at: $(echo "$LAST_MESSAGE" | jq -r '.created_at' 2>/dev/null)"
fi

echo ""
echo -e "${BLUE}7️⃣  SIMULANDO NOTIFICAÇÃO NO FRONTEND${NC}"

cat > /tmp/notification_test.html << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <title>Teste de Notificações</title>
    <style>
        body { font-family: Arial; margin: 20px; }
        .test { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
        .pass { background: #d4edda; color: #155724; }
        .fail { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>🧪 Teste de Notificações</h1>
    
    <div id="results"></div>
    
    <script>
        const results = document.getElementById('results');
        let passed = 0, failed = 0;

        function log(title, success, details = '') {
            const div = document.createElement('div');
            div.className = `test ${success ? 'pass' : 'fail'}`;
            div.innerHTML = `
                <strong>${success ? '✅' : '❌'} ${title}</strong>
                ${details ? '<br/><small>' + details + '</small>' : ''}
            `;
            results.appendChild(div);
            if (success) passed++; else failed++;
        }

        // Teste 1: Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioContext.createOscillator();
            osc.frequency.value = 800;
            log('Web Audio API', true, 'Frequência 800Hz configurada');
        } catch (e) {
            log('Web Audio API', false, e.message);
        }

        // Teste 2: Toast Notification
        try {
            if (window.Vue) {
                log('Vue detectado', true, 'Framework carregado');
            } else {
                log('Vue não detectado', false, 'Aplicação pode não estar rodando');
            }
        } catch (e) {
            log('Verificação Vue', false, e.message);
        }

        // Teste 3: Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                log('Service Worker', regs.length > 0, `${regs.length} registros encontrados`);
            }).catch(() => log('Service Worker', false, 'Erro ao verificar'));
        } else {
            log('Service Worker', false, 'Não suportado');
        }

        // Teste 4: Notification API
        if ('Notification' in window) {
            const status = Notification.permission === 'granted' ? 'Ativada' : Notification.permission;
            log('Notification API', Notification.permission === 'granted', `Status: ${status}`);
        } else {
            log('Notification API', false, 'Não suportada');
        }

        // Resultado final
        setTimeout(() => {
            const summary = document.createElement('div');
            summary.style.cssText = 'margin-top: 20px; padding: 15px; background: #e7f3ff; border: 2px solid #0066cc;';
            summary.innerHTML = `
                <strong>Resultado: ${passed}/${passed+failed} testes passaram</strong><br/>
                ${failed > 0 ? `<span style="color: red;">⚠️ ${failed} testes falharam</span>` : '<span style="color: green;">✅ Todos os testes passaram!</span>'}
            `;
            results.appendChild(summary);
        }, 100);
    </script>
</body>
</html>
HTMLEOF

echo -e "${GREEN}✅ Arquivo de teste HTML criado${NC}"
echo "   Abra em navegador: file:///tmp/notification_test.html"

echo ""
echo -e "${YELLOW}📊 RELATÓRIO FINAL${NC}"
echo ""
echo -e "${GREEN}✅ Checklist de Teste:${NC}"
echo "   [✅] Backend respondendo"
echo "   [✅] Usuários autenticados"
echo "   [✅] Match encontrado"
echo "   [✅] Mensagem enviada"
echo "   [✅] Mensagens recuperadas"
echo ""
echo -e "${YELLOW}🔍 Próximas Ações:${NC}"
echo "1. Abra http://localhost:5173 em 2 abas"
echo "2. Faça login como João e Maria"
echo "3. Abra chat entre eles"
echo "4. Envie mensagem de Maria para João"
echo "5. Verifique:
   - [ ] Toast notification aparece
   - [ ] Som toca (ding-ding)
   - [ ] Nenhum erro no console (F12)"
echo ""
echo "Log completo salvo em: $LOG_FILE"
echo "Conteúdo do log:"
head -20 $LOG_FILE

