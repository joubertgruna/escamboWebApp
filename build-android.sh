#!/bin/bash

# 📱 Script para gerar APK Android - Escambo

echo "🤖 Gerando APK para Android..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script no diretório frontend-next${NC}"
    exit 1
fi

# 1. Instalar Capacitor se necessário
echo -e "${BLUE}📦 Verificando Capacitor...${NC}"
if ! grep -q "@capacitor/core" package.json; then
    echo -e "${YELLOW}⚙️  Instalando Capacitor...${NC}"
    npm install @capacitor/core @capacitor/cli
    npm install @capacitor/android
fi

# 2. Inicializar Capacitor (se necessário)
if [ ! -f "capacitor.config.ts" ]; then
    echo -e "${BLUE}🔧 Inicializando Capacitor...${NC}"
    npx cap init
fi

# 3. Build do Next.js
echo -e "${BLUE}🔨 Building Next.js...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build falhou${NC}"
    exit 1
fi

# 4. Export estático (para Capacitor)
echo -e "${BLUE}📦 Exportando build estático...${NC}"
npm run export || npm run build

# 5. Adicionar plataforma Android (se necessário)
if [ ! -d "android" ]; then
    echo -e "${BLUE}🤖 Adicionando plataforma Android...${NC}"
    npx cap add android
fi

# 6. Copiar assets
echo -e "${BLUE}📋 Copiando assets...${NC}"
npx cap copy android
npx cap sync android

# 7. Instruções finais
echo ""
echo -e "${GREEN}✅ Projeto Android preparado!${NC}"
echo ""
echo -e "${YELLOW}📱 Próximos passos:${NC}"
echo "1. Abra o Android Studio:"
echo -e "   ${BLUE}npx cap open android${NC}"
echo ""
echo "2. No Android Studio, execute:"
echo "   - Build > Generate Signed Bundle / APK"
echo "   - Escolha 'Android App Bundle (.aab)'"
echo "   - Crie ou selecione uma keystore"
echo ""
echo "3. O arquivo .aab estará em:"
echo "   android/app/build/outputs/bundle/release/"
echo ""
echo -e "${GREEN}🎉 Pronto para upload no Google Play!${NC}"
