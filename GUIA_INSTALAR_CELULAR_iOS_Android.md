# 📱 GUIA - INSTALAR E TESTAR NO CELULAR (iPhone/Android)

## 🎯 Opções Disponíveis

Existem 3 formas de testar a app no seu celular:

### 1️⃣ **Expo (MAIS FÁCIL)** ⭐ Recomendado
- ✅ Rápido de setup
- ✅ Não precisa compilar
- ✅ Funciona em qualquer telefone
- ✅ Basta escanear QR code

### 2️⃣ **Android Studio** (Emulador)
- ✅ Sem necessidade de device físico
- ✅ Completo controle
- ❌ Mais lento
- ❌ Consome recursos

### 3️⃣ **Xcode** (iOS Simulator - Mac only)
- ✅ Simulador perfeito do iPhone
- ❌ Apenas para Mac
- ❌ Mais lento

---

## ✅ OPÇÃO 1: EXPO (MAIS FÁCIL) ⭐

### Pré-requisitos
```
✅ Node.js instalado
✅ npm ou yarn instalado
✅ Telefone com WiFi
✅ App Expo Go instalado no telefone
```

### Passo 1: Instalar Expo Go no Celular

#### iPhone
```
App Store → Procurar "Expo Go"
Instalar (app oficial)
```

#### Android
```
Google Play → Procurar "Expo Go"
Instalar (app oficial)
```

### Passo 2: Preparar o Projeto

```bash
# 1. Verificar se Expo CLI está instalado
npm install -g expo-cli

# 2. Ir para o diretório do projeto (se tiver React Native)
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend

# 3. Instalar dependências
npm install

# OU se usar yarn
yarn install
```

### Passo 3: Iniciar o Expo

```bash
# Rodar o servidor Expo
expo start

# OU se usar yarn
yarn start
```

### Resultado Esperado
```
Metro Bundler com QR code na tela:

   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
   █ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ █
   █ ▓   ▓   ▓   ▓ █
   █ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ █
   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

Pressionar:
- 'i' para abrir no iOS Simulator
- 'a' para abrir no Android Emulator
- 'j' para abrir no navegador
- 'w' para abrir no web
```

### Passo 4: Conectar seu Celular

#### iPhone
```
1. Abrir App "Expo Go"
2. Clicar em "Scan QR code"
3. Apontar câmera para QR code do terminal
4. Aplicação abrirá automaticamente!
```

#### Android
```
1. Abrir App "Expo Go"
2. Clicar em "Scan QR code"
3. Apontar câmera para QR code do terminal
4. Aplicação abrirá automaticamente!
```

---

## ✅ OPÇÃO 2: ANDROID STUDIO (Emulador)

### Pré-requisitos
```
✅ Node.js instalado
✅ Android Studio instalado
✅ JDK instalado (Java)
✅ ~10GB espaço em disco
```

### Passo 1: Instalar Android Studio

**Mac:**
```bash
# Via Homebrew
brew install --cask android-studio
```

**Windows/Linux:**
- Baixar em: https://developer.android.com/studio

### Passo 2: Configurar Emulador

```bash
# Abrir Android Studio
open /Applications/Android\ Studio.app

# 1. Clicar em "Virtual Device Manager"
# 2. Clicar em "Create Device"
# 3. Selecionar device (ex: Pixel 5)
# 4. Selecionar versão Android (ex: Android 12)
# 5. Clicar "Finish"
```

### Passo 3: Iniciar Emulador

```bash
# Via terminal
emulator -avd Pixel_5_API_31 &

# OU via Android Studio
# Virtual Device Manager → Play button do seu device
```

### Passo 4: Rodar App no Emulador

```bash
# Na pasta do projeto React Native
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend

# Rodar no Android
react-native run-android

# OU com Expo
expo start
# Depois pressionar 'a' para Android
```

---

## ✅ OPÇÃO 3: XCODE (iOS Simulator - Mac only)

### Pré-requisitos
```
✅ Mac com Xcode instalado
✅ iOS 13+
```

### Passo 1: Instalar Xcode

```bash
# Via App Store ou
xcode-select --install
```

### Passo 2: Iniciar Simulator

```bash
# Abrir Xcode
open /Applications/Xcode.app

# OU via terminal
open -a Simulator
```

### Passo 3: Rodar App

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend

# Com Expo
expo start
# Pressionar 'i' para iOS

# OU com React Native
react-native run-ios
```

---

## 🔗 SE SEU PROJETO FOR NEXT.JS (Frontend Web)

Se você quer testar a versão **web** (Next.js) no celular:

### Passo 1: Rodar Next.js localmente

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend-next

npm run dev -- --port 5174
```

### Passo 2: Descobrir seu IP local

```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Resultado esperado:
```
inet 192.168.15.10  (seu IP local)
```

### Passo 3: Abrir no Celular

**No navegador do seu celular:**
```
http://192.168.15.10:5174
```

**Importante:**
- Celular e computador devem estar na **mesma rede WiFi**
- Use o IP local, NÃO localhost

---

## 🧪 TESTAR NO DISPOSITIVO REAL

### Checklist de Testes Essenciais

```
□ App abre sem crash
□ Feed carrega com imagens
□ Scroll funciona smooth
□ Botões são responsivos
□ Touch funciona (like, unlike, etc)
□ Notificações aparecem
□ Configurações abrem
□ Help page funciona
□ Chat carrega
□ Performance é boa (sem lag)
□ Sem console errors
```

### Teste Performance

**No iPhone/Android:**
```
1. Abrir DevTools (se disponível)
2. Ou monitorar no terminal do servidor
3. Verificar se há errors
4. Medir tempo de resposta
```

---

## 📊 RESUMO DAS OPÇÕES

| Opção | Setup | Facilidade | Performance | Recomendado |
|-------|-------|-----------|-------------|------------|
| **Expo** | 5 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ SIM |
| **Android Studio** | 30 min | ⭐⭐ | ⭐⭐ | ❌ Não |
| **Xcode** | 20 min | ⭐⭐⭐ | ⭐⭐ | ❌ Mac only |
| **Browser (Next.js)** | 5 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ SIM |

---

## ⚠️ TROUBLESHOOTING

### Problema: "Network error / Cannot connect"
```
Solução:
1. Verificar se está na mesma WiFi
2. Verificar firewall
3. Usar IP local, não localhost
4. Reiniciar router WiFi
```

### Problema: "QR code not working"
```
Solução:
1. Verificar se Expo Go está instalado
2. Escanear novamente
3. Reiniciar expo (Ctrl+C e npm start)
4. Verificar permissão de câmera
```

### Problema: "App is blank / Loading forever"
```
Solução:
1. Verificar logs no terminal
2. Verificar se backend está rodando
3. Limpar cache: npm start -- --clear
4. Reinstalar node_modules
```

### Problema: "Port already in use"
```
Solução:
# Encontrar e matar processo
lsof -i :5174
kill -9 <PID>

# Ou usar porta diferente
npm run dev -- --port 5175
```

---

## 🚀 QUICK START (30 SEGUNDOS)

Se você só quer testar **Next.js no browser do celular:**

```bash
# Terminal 1: Rodar servidor
cd frontend-next
npm run dev -- --port 5174

# Terminal 2: Descobrir IP
ifconfig | grep "inet " | grep -v 127

# Celular: Abrir navegador
http://SEU_IP:5174
```

**Pronto! 🎉**

---

## 📱 PRÓXIMAS AÇÕES

1. **Escolher opção** (Expo ou Browser)
2. **Seguir passos** acima
3. **Testar app** no celular
4. **Documentar resultados**
5. **Fazer screenshots** (opcional)

---

## 🎯 O QUE TESTAR NO CELULAR

- ✅ Responsividade em real device
- ✅ Touch interaction (buttons, swipe)
- ✅ Performance (lag, crashes)
- ✅ Imagens carregam rápido
- ✅ Navegação funciona
- ✅ Sem console errors
- ✅ Battery/data usage (se relevante)

---

**Qual opção você quer usar? 📱**

1. **Expo (mais fácil)** ← RECOMENDADO
2. Android Studio (emulador)
3. Xcode (iOS simulator)
4. Browser Next.js (mais simples)

---

Data: 23 de março de 2026
Status: ✅ GUIA COMPLETO
Próximo: Escolher opção e testar!
