# 🚀 Guia Completo de Deploy - Escambo

## 📋 Índice
1. [Deploy Web (Vercel/AWS)](#deploy-web)
2. [PWA para App Stores](#pwa-app-stores)
3. [Google Play Store](#google-play-store)
4. [Apple App Store](#apple-app-store)
5. [Checklist Pré-Deploy](#checklist-pre-deploy)

---

## 🌐 Deploy Web

### Opção 1: Vercel (Recomendado - Grátis)

**Vantagens:**
- ✅ Deploy automático do Next.js
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Preview URLs para cada PR
- ✅ 100% grátis para projetos pessoais

**Passos:**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy do frontend
cd frontend-next
vercel

# 4. Deploy de produção
vercel --prod
```

**Configuração via Dashboard:**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend-next`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

**Variáveis de Ambiente:**
```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_APP_NAME=Escambo
```

---

### Opção 2: AWS Amplify

```bash
# 1. Instalar AWS Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configurar
amplify init

# 3. Add hosting
amplify add hosting

# 4. Deploy
amplify publish
```

---

### Backend Deploy (Node.js + MySQL)

#### Opção A: Railway (Recomendado - Grátis)

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Inicializar projeto
railway init

# 4. Add MySQL
railway add mysql

# 5. Deploy
railway up
```

**Railway Dashboard:**
- MySQL: Provisionado automaticamente
- Variáveis de ambiente configuradas automaticamente
- Domain: `seu-app.railway.app`

#### Opção B: Render.com (Grátis)

1. Acesse [render.com](https://render.com)
2. Crie um **Web Service**:
   - Repository: Seu GitHub
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. Crie um **MySQL Database**:
   - Connection String será gerado automaticamente

---

## 📱 PWA para App Stores

Seu app já é um PWA! Agora vamos transformá-lo em apps nativos.

### Ferramentas Disponíveis:

1. **Capacitor** (Recomendado) - Ionic
2. **PWABuilder** - Microsoft (Mais Simples)
3. **Bubblewrap** - Google

---

## 🤖 Google Play Store (Android)

### Método 1: PWABuilder (Mais Simples - 30 minutos)

**Passos:**

1. **Gerar APK/AAB:**

```bash
# 1. Acesse PWABuilder
# https://www.pwabuilder.com/

# 2. Digite a URL do seu PWA
https://seuapp.vercel.app

# 3. Baixe o pacote Android (.aab)
```

2. **Preparar para Google Play:**

```bash
# O PWABuilder gera:
# - app-release.aab (Android App Bundle)
# - signing.keystore (chave de assinatura)
# - README com instruções
```

3. **Publicar no Google Play Console:**

- Acesse: [play.google.com/console](https://play.google.com/console)
- Crie uma conta de desenvolvedor ($25 taxa única)
- Crie um novo app
- Upload do `.aab`

**Informações Necessárias:**
```
Nome do App: Escambo
Descrição Curta: Troque itens com segurança
Categoria: Estilo de Vida
Classificação: Livre
Screenshots: 8 imagens (mobile + tablet)
Ícone: 512x512px PNG
Feature Graphic: 1024x500px
```

---

### Método 2: Capacitor (Mais Controle)

```bash
# 1. Instalar Capacitor
cd frontend-next
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# 2. Inicializar
npx cap init

# 3. Build do Next.js
npm run build

# 4. Adicionar plataforma Android
npx cap add android

# 5. Copiar assets
npx cap copy android

# 6. Abrir Android Studio
npx cap open android
```

**Configuração `capacitor.config.ts`:**

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.escambo.app',
  appName: 'Escambo',
  webDir: 'out', // ou 'dist' dependendo do build
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#34c759",
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

**Build Production APK:**

```bash
# No Android Studio:
# Build > Generate Signed Bundle / APK > Android App Bundle (.aab)

# Ou via linha de comando:
cd android
./gradlew bundleRelease

# APK gerado em:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Gerar Keystore (primeira vez):**

```bash
keytool -genkey -v -keystore escambo-release.keystore \
  -alias escambo -keyalg RSA -keysize 2048 -validity 10000

# Guarde o keystore e a senha em segurança!
```

---

## 🍎 Apple App Store (iOS)

### Requisitos:
- Mac com Xcode
- Apple Developer Account ($99/ano)
- Certificados e Provisioning Profiles

### Método 1: PWABuilder + Mac

```bash
# 1. Gerar pacote iOS no PWABuilder
https://www.pwabuilder.com/

# 2. Baixar o .zip com projeto Xcode
```

### Método 2: Capacitor (Recomendado)

```bash
# 1. Adicionar iOS (requer Mac)
npm install @capacitor/ios
npx cap add ios

# 2. Copiar assets
npx cap copy ios

# 3. Abrir Xcode
npx cap open ios
```

**Configuração no Xcode:**

1. **Signing & Capabilities:**
   - Team: Sua Apple Developer Team
   - Bundle Identifier: `com.escambo.app`

2. **Info.plist - Permissões:**

```xml
<key>NSCameraUsageDescription</key>
<string>Escambo precisa da câmera para tirar fotos dos itens</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Escambo precisa acessar suas fotos</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Escambo usa sua localização para encontrar trocas próximas</string>
```

3. **Build e Archive:**
   - Product > Archive
   - Upload para App Store Connect

**App Store Connect:**
1. Crie um novo app
2. Configure metadados
3. Upload screenshots (5.5", 6.5", 12.9")
4. Envie para revisão

---

## ✅ Checklist Pré-Deploy

### PWA Otimização

```bash
# 1. Verificar PWA Score
npx lighthouse https://localhost:3000 --view

# 2. Validar manifest.json
https://manifest-validator.appspot.com/

# 3. Verificar Service Worker
# Chrome DevTools > Application > Service Workers
```

### Performance

```bash
# 1. Otimizar imagens
npm install sharp
npx @next/codemod new-link .

# 2. Adicionar compressão
# next.config.js já tem compress: true

# 3. Analisar bundle
npm run build
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### SEO & Metadados

Verifique se tem em todas as páginas:

```tsx
// app/layout.tsx
export const metadata = {
  title: 'Escambo - Troque com Segurança',
  description: 'Troque itens usados com segurança',
  manifest: '/manifest.json',
  themeColor: '#34c759',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Escambo'
  }
}
```

### Segurança

```bash
# 1. HTTPS obrigatório
# Vercel/Railway fornecem automaticamente

# 2. Headers de segurança (next.config.js)
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' }
      ]
    }
  ]
}

# 3. Rate limiting no backend
npm install express-rate-limit
```

---

## 🔧 Scripts Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "build:web": "npm run build",
    "build:android": "npm run build && npx cap copy android && npx cap sync android",
    "build:ios": "npm run build && npx cap copy ios && npx cap sync ios",
    "deploy:vercel": "vercel --prod",
    "deploy:railway": "railway up",
    "open:android": "npx cap open android",
    "open:ios": "npx cap open ios"
  }
}
```

---

## 📊 Comparação de Custos

| Serviço | Custo | Notas |
|---------|-------|-------|
| **Vercel** (Frontend) | Grátis | Até 100GB bandwidth |
| **Railway** (Backend) | Grátis | $5/mês depois de 500h |
| **Render** (Backend) | Grátis | Com limitações |
| **Google Play** | $25 | Taxa única |
| **Apple Store** | $99/ano | Renovação anual |

**Total para começar:**
- Web: **R$ 0**
- Android: **R$ 140** (taxa única)
- iOS: **R$ 550/ano**

---

## 🚀 Roteiro Recomendado

### Fase 1: MVP Web (Semana 1)
```bash
1. Deploy frontend → Vercel
2. Deploy backend → Railway
3. Configurar domínio customizado
4. Testar PWA em mobile
```

### Fase 2: Android (Semana 2)
```bash
1. Gerar APK com PWABuilder
2. Testar no dispositivo físico
3. Criar conta Google Play
4. Publicar versão beta
```

### Fase 3: iOS (Semana 3-4)
```bash
1. Contratar Apple Developer
2. Configurar Capacitor iOS
3. Testar no TestFlight
4. Submeter para revisão
```

---

## 📞 Próximos Passos

Escolha seu caminho:

### Caminho Rápido (1 dia):
```bash
# Deploy web apenas
cd frontend-next
vercel

cd ../backend
railway up
```

### Caminho Completo (2 semanas):
```bash
# 1. Web
vercel --prod

# 2. Android
pwabuilder.com

# 3. iOS (requer Mac)
npx cap add ios
```

---

## 🛠️ Suporte e Troubleshooting

### Problemas Comuns:

**Build falha:**
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

**PWA não instala:**
```bash
# Verificar manifest e service worker
# Chrome DevTools > Lighthouse > PWA
```

**App não conecta ao backend:**
```bash
# Verificar CORS no backend
# Verificar URL da API nas env vars
```

---

**Precisa de ajuda?** Estou aqui para guiar você em cada etapa! 🚀
