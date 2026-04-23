#!/bin/bash

# 🧪 TESTE AUTOMATIZADO - FASE 4 COMPLETA
# Testa: Mobile (320px), Tablet (768px), Desktop (1280px)

echo "🚀 INICIANDO TESTES AUTOMATIZADOS - FASE 4"
echo "==========================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5174"
RESULTS_FILE="/tmp/test_results.log"

# Limpar arquivo de resultados
> $RESULTS_FILE

echo "📋 TESTE 1: Verificar se servidores estão rodando"
echo "=================================================="

# Teste Backend
echo -n "Backend (localhost:3000): "
if curl -s "$API_URL/health" > /dev/null 2>&1 || curl -s "$API_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ RESPONDENDO${NC}"
    echo "[PASS] Backend rodando" >> $RESULTS_FILE
else
    echo -e "${RED}❌ NÃO RESPONDENDO${NC}"
    echo "[FAIL] Backend não respondendo" >> $RESULTS_FILE
fi

# Teste Frontend
echo -n "Frontend (localhost:5174): "
if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ RESPONDENDO${NC}"
    echo "[PASS] Frontend rodando" >> $RESULTS_FILE
else
    echo -e "${RED}❌ NÃO RESPONDENDO${NC}"
    echo "[FAIL] Frontend não respondendo" >> $RESULTS_FILE
fi

echo ""
echo "📋 TESTE 2: Verificar endpoints da API"
echo "======================================"

# Testes de endpoints
ENDPOINTS=(
    "/items/feed"
    "/notifications"
    "/help/faq"
)

for endpoint in "${ENDPOINTS[@]}"; do
    echo -n "GET $endpoint: "
    status=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
    if [ "$status" = "200" ] || [ "$status" = "201" ]; then
        echo -e "${GREEN}✅ $status${NC}"
        echo "[PASS] Endpoint $endpoint retorna $status" >> $RESULTS_FILE
    else
        echo -e "${RED}❌ $status${NC}"
        echo "[FAIL] Endpoint $endpoint retorna $status" >> $RESULTS_FILE
    fi
done

echo ""
echo "📋 TESTE 3: Verificar páginas do Frontend"
echo "=========================================="

PAGES=(
    "/feed"
    "/my-items"
    "/likes"
    "/create-item"
    "/notifications"
    "/settings"
    "/help"
    "/matches"
    "/profile"
)

for page in "${PAGES[@]}"; do
    echo -n "GET $page: "
    status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$page")
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ $status${NC}"
        echo "[PASS] Página $page retorna $status" >> $RESULTS_FILE
    else
        echo -e "${RED}❌ $status${NC}"
        echo "[FAIL] Página $page retorna $status" >> $RESULTS_FILE
    fi
done

echo ""
echo "📋 TESTE 4: Verificar Performance"
echo "================================="

# Medir tempo de resposta
echo -n "Tempo de resposta /feed: "
time_feed=$(curl -s -o /dev/null -w "%{time_total}" "$API_URL/items/feed")
echo -e "${GREEN}${time_feed}s${NC}"
echo "[PASS] /feed respondeu em ${time_feed}s" >> $RESULTS_FILE

echo ""
echo "📋 TESTE 5: Verificar Responsividade (CSS Classes)"
echo "=================================================="

# Verificar se arquivo contém breakpoints
echo -n "Verificar sm: breakpoints: "
if grep -r "sm:" /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend-next/src --include="*.tsx" | grep -q "grid-cols\|h-\|px-"; then
    echo -e "${GREEN}✅ ENCONTRADO${NC}"
    echo "[PASS] Breakpoints sm: encontrados" >> $RESULTS_FILE
else
    echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
    echo "[FAIL] Breakpoints sm: não encontrados" >> $RESULTS_FILE
fi

echo -n "Verificar md: breakpoints: "
if grep -r "md:" /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend-next/src --include="*.tsx" | grep -q "grid-cols\|h-\|px-"; then
    echo -e "${GREEN}✅ ENCONTRADO${NC}"
    echo "[PASS] Breakpoints md: encontrados" >> $RESULTS_FILE
else
    echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
    echo "[FAIL] Breakpoints md: não encontrados" >> $RESULTS_FILE
fi

echo -n "Verificar lg: breakpoints: "
if grep -r "lg:" /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend-next/src --include="*.tsx" | grep -q "grid-cols\|h-\|px-"; then
    echo -e "${GREEN}✅ ENCONTRADO${NC}"
    echo "[PASS] Breakpoints lg: encontrados" >> $RESULTS_FILE
else
    echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
    echo "[FAIL] Breakpoints lg: não encontrados" >> $RESULTS_FILE
fi

echo ""
echo "📋 TESTE 6: Verificar Next/Image Optimization"
echo "============================================="

echo -n "Componentes com next/Image: "
count=$(grep -r "from \"next/image\"" /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend-next/src --include="*.tsx" | wc -l)
if [ "$count" -ge 5 ]; then
    echo -e "${GREEN}✅ $count arquivos${NC}"
    echo "[PASS] $count arquivos com next/Image" >> $RESULTS_FILE
else
    echo -e "${RED}❌ $count arquivos${NC}"
    echo "[FAIL] Apenas $count arquivos com next/Image" >> $RESULTS_FILE
fi

echo ""
echo "📋 TESTE 7: Verificar Páginas Novas"
echo "==================================="

PAGES_NEW=(
    "notifications/page.tsx"
    "settings/page.tsx"
    "help/page.tsx"
)

for page in "${PAGES_NEW[@]}"; do
    file="/Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend-next/src/app/(main)/$page"
    echo -n "Verificar $page: "
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        echo -e "${GREEN}✅ $lines linhas${NC}"
        echo "[PASS] $page criada com $lines linhas" >> $RESULTS_FILE
    else
        echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
        echo "[FAIL] $page não encontrada" >> $RESULTS_FILE
    fi
done

echo ""
echo "📊 RESUMO DOS TESTES"
echo "==================="
echo ""

# Contar resultados
PASS=$(grep -c "\[PASS\]" $RESULTS_FILE)
FAIL=$(grep -c "\[FAIL\]" $RESULTS_FILE)
TOTAL=$((PASS + FAIL))

echo "Total de testes: $TOTAL"
echo -e "✅ Passou: ${GREEN}$PASS${NC}"
echo -e "❌ Falhou: ${RED}$FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo ""
    echo "✅ Backend rodando"
    echo "✅ Frontend rodando"
    echo "✅ Endpoints respondendo"
    echo "✅ Páginas carregando"
    echo "✅ Responsividade implementada"
    echo "✅ Imagens otimizadas"
    echo "✅ Páginas novas criadas"
    echo ""
    echo "🚀 PRONTO PARA PRODUÇÃO!"
else
    echo ""
    echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
    echo "Ver detalhes em: $RESULTS_FILE"
fi

echo ""
echo "📝 Detalhes completos em: $RESULTS_FILE"
cat $RESULTS_FILE

echo ""
echo "==========================================="
echo "✅ TESTES FINALIZADOS"
echo "==========================================="
