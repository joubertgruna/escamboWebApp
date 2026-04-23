#!/bin/bash

# 🚀 Script de Deploy Rápido - Escambo

echo "🎯 Iniciando deploy do Escambo..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Verificar dependências
echo -e "${BLUE}📋 Verificando dependências...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado. Instale em: https://nodejs.org${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js e npm encontrados${NC}"

# 2. Instalar Vercel CLI se necessário
if ! command_exists vercel; then
    echo -e "${BLUE}📦 Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# 3. Build e teste local
echo -e "${BLUE}🔨 Building frontend...${NC}"
cd frontend-next

# Instalar dependências
npm install

# Build
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Build falhou. Verifique os erros acima.${NC}"
    exit 1
fi

# 4. Deploy
echo -e "${BLUE}🚀 Iniciando deploy na Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    echo -e "${GREEN}🎉 Seu app está no ar!${NC}"
else
    echo -e "${RED}❌ Deploy falhou${NC}"
    exit 1
fi

# 5. Instruções pós-deploy
echo ""
echo -e "${BLUE}📝 Próximos passos:${NC}"
echo "1. Configure as variáveis de ambiente no dashboard da Vercel"
echo "2. Adicione um domínio customizado (opcional)"
echo "3. Configure o backend no Railway/Render"
echo ""
echo -e "${GREEN}✨ Deploy web completo!${NC}"
