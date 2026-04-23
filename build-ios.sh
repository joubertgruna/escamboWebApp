#!/bin/bash

# 🍎 Script para gerar IPA iOS - Escambo
# ⚠️  Requer: Mac com Xcode instalado

echo "🍎 Gerando IPA para iOS..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se está no Mac
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ Este script requer macOS com Xcode${NC}"
    exit 1
fi

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script no diretório frontend-next${NC}"
    exit 1
fi

# 1. Instalar Capacitor iOS
echo -e "${BLUE}📦 Verificando Capacitor iOS...${NC}"
if ! grep -q "@capacitor/ios" package.json; then
    echo -e "${YELLOW}⚙️  Instalando Capacitor iOS...${NC}"
    npm install @capacitor/ios
fi

# 2. Build do Next.js
echo -e "${BLUE}🔨 Building Next.js...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build falhou${NC}"
    exit 1
fi

# 3. Export estático
echo -e "${BLUE}📦 Exportando build estático...${NC}"
npm run export || npm run build

# 4. Adicionar plataforma iOS (se necessário)
if [ ! -d "ios" ]; then
    echo -e "${BLUE}🍎 Adicionando plataforma iOS...${NC}"
    npx cap add ios
fi

# 5. Copiar assets
echo -e "${BLUE}📋 Copiando assets...${NC}"
npx cap copy ios
npx cap sync ios

# 6. Abrir Xcode
echo -e "${BLUE}🚀 Abrindo Xcode...${NC}"
npx cap open ios

# 7. Instruções finais
echo ""
echo -e "${GREEN}✅ Projeto iOS preparado!${NC}"
echo ""
echo -e "${YELLOW}📱 Próximos passos no Xcode:${NC}"
echo ""
echo "1. Configure Signing & Capabilities:"
echo "   - Team: Sua Apple Developer Account"
echo "   - Bundle ID: com.escambo.app"
echo ""
echo "2. Adicione ícones e splash screens:"
echo "   - Assets.xcassets > AppIcon"
echo "   - Assets.xcassets > LaunchScreen"
echo ""
echo "3. Archive e Export:"
echo "   - Product > Archive"
echo "   - Distribute App > App Store Connect"
echo ""
echo -e "${YELLOW}⚠️  Lembre-se:${NC}"
echo "- Você precisa de uma Apple Developer Account ($99/ano)"
echo "- Configure certificados e provisioning profiles"
echo "- Adicione screenshots e metadados no App Store Connect"
echo ""
echo -e "${GREEN}🎉 Boa sorte com a submissão!${NC}"
