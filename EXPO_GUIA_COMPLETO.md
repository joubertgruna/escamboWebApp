# 🎯 EXPO - GUIA PROFISSIONAL PARA APP MOBILE

## ✅ O QUE É EXPO?

Expo é uma plataforma que permite criar apps React Native **sem precisar de compilação** e **testar no celular instantaneamente**.

### Vantagens
- ✅ 0 configuração de Xcode/Android Studio
- ✅ Testa em segundos com QR code
- ✅ Funciona em iPhone E Android
- ✅ Hot reload (atualiza automaticamente)
- ✅ Acesso a câmera, GPS, etc

---

## 📋 PRÉ-REQUISITOS

### No Mac
```
✅ Node.js 14+ instalado
✅ npm ou yarn
✅ Terminal aberto
```

### No Celular
```
iPhone: App "Expo Go" (App Store)
Android: App "Expo Go" (Google Play)
WiFi: Mesma rede que o Mac
```

---

## 🚀 PASSO A PASSO (15 minutos)

### Passo 1: Instalar Expo CLI (1 min)

```bash
# Terminal no Mac
npm install -g expo-cli

# Verificar instalação
expo --version
# Deve aparecer: versão (ex: 5.4.1)
```

### Passo 2: Preparar Projeto React Native (2 min)

**Se seu projeto já tem React Native:**

```bash
# Ir para pasta do projeto
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend

# Instalar dependências
npm install
# ou
yarn install

# Se ainda não tem app.json, criar:
expo init my-app
```

### Passo 3: Iniciar Expo (1 min)

```bash
# Na pasta do projeto
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend

# Rodar Expo
expo start

# Você verá:
#  ┌────────────────────────────────────────────────────────────┐
#  │                                                              │
#  │   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ │
#  │   █ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█  │
#  │   █ ░                                                ░█  │
#  │   █ ░ ▄▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄ ░█  │
#  │   █ ░ █    █ █    █ █    █ █    █ █    █ ░█  │
#  │   █ ░ ▀▀▀▀▀▀ ▀▀▀▀▀▀ ▀▀▀▀▀▀ ▀▀▀▀▀▀ ▀▀▀▀▀▀ ░█  │
#  │   █ ░                                                ░█  │
#  │   █ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ │
#  │                                                              │
#  │  Metro Bundler started                                      │
#  │                                                              │
#  │  i Logs for your project will appear here.                │
#  │                                                              │
#  └────────────────────────────────────────────────────────────┘
#
#  › Metro waiting on exp://YOUR_IP:19000
#  › Press 's' to restart dev server
#  › Press 'i' to open iOS simulator
#  › Press 'a' to open Android emulator
#  › Press 'q' to quit
```

### Passo 4: Instalar Expo Go no Celular (2 min)

#### iPhone
1. Abrir **App Store**
2. Procurar **"Expo Go"**
3. Instalar (ícone azul com 'E')

#### Android
1. Abrir **Google Play**
2. Procurar **"Expo Go"**
3. Instalar

### Passo 5: Conectar Celular (10 min)

#### Opção A: QR Code (Mais Fácil)

```
1. Terminal mostra QR code
2. Abrir Expo Go no celular
3. Clicar "Scan QR Code"
4. Apontar câmera para QR code
5. APP ABRE AUTOMATICAMENTE! 🎉
```

#### Opção B: Manual (se QR não funcionar)

```
1. No terminal, achar a linha:
   › Metro waiting on exp://192.168.X.X:19000
                     ^^^^^^^^^^^^^^^^ (seu IP)

2. No celular, abrir Expo Go
3. Clicar em "Enter URL manually"
4. Copiar URL: exp://192.168.X.X:19000
5. App abre!
```

---

## 🧪 TESTAR NO CELULAR

### Checklist Básico
```
□ App abre sem crash
□ Tela principal aparece
□ Botões são clicáveis
□ Scroll funciona
□ Sem console errors
```

### Testar Recursos
```
□ Câmera (se tiver permissão)
□ Galeria (upload de fotos)
□ GPS (localização)
□ Notificações push
```

### Performance
```
□ App não congela
□ Scroll smooth
□ Imagens carregam rápido
□ Nenhum lag perceptível
```

---

## 🔄 HOT RELOAD (A Mágica do Expo)

Depois que a app está aberta:

1. **Salvar arquivo** no editor
2. **App atualiza automaticamente** no celular
3. Sem precisar recompiler!

```bash
# Se der erro, pressionar no terminal:
r - recarregar
c - limpar console
```

---

## 📊 MONITORAMENTO EM TEMPO REAL

### Ver Logs do Celular

No terminal, enquanto app está rodando:

```
• Quando usuário clica = Log aparece
• Quando erro acontece = Error aparece  
• Console.log() mostra no terminal
```

Exemplo:
```bash
[10:30:45] LOG: User pressed Like button
[10:30:46] ERROR: Image failed to load
[10:30:47] LOG: Chat opened
```

---

## 🛠️ TROUBLESHOOTING

### "QR Code não funciona"
```
Solução:
1. Verificar permissão de câmera (Expo Go)
2. Aproximar do código
3. Verificar iluminação
4. Tentar Manual URL option
```

### "Conexão recusada"
```
Solução:
1. Mac e celular na mesma WiFi?
2. Firewall bloqueando? (desabilitar temporariamente)
3. IP correto?
4. Porta 19000 aberta?

Teste:
ping 192.168.X.X
```

### "App crash ao abrir"
```
Solução:
1. Ver erro no terminal
2. Verificar logs completos (terminal)
3. `npm install` novamente
4. `expo start --clear` (limpar cache)
```

### "Muito lento"
```
Soluções:
1. Aproximar do router WiFi
2. Fechar outros apps no celular
3. Usar ethernet no Mac (mais estável)
4. `expo start --tunnel` (se WiFi ruim)
```

---

## 🚀 COMANDOS ÚTEIS

```bash
# Iniciar com cache limpo
expo start --clear

# Modo tunnel (WiFi ruim)
expo start --tunnel

# Abrir diretamente iOS
expo start -i

# Abrir diretamente Android
expo start -a

# Preview da build
expo publish

# Build para produção
eas build --platform ios
eas build --platform android
```

---

## 📈 PRÓXIMAS AÇÕES

1. **Instalar Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

2. **Instalar Expo Go no celular** (App Store/Play Store)

3. **Rodar projeto**
   ```bash
   cd frontend
   npm install
   expo start
   ```

4. **Conectar via QR code**
   - Abrir Expo Go
   - Scan QR Code
   - App abre!

5. **Testar funcionalidades**

6. **Fazer build final** (opcional)

---

## 📦 BUILD FINAL (Para Distribuição)

Quando terminar os testes e quiser fazer build profissional:

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login na Expo
eas login

# 3. Build para iOS
eas build --platform ios

# 4. Build para Android
eas build --platform android
```

Resultado: Apps prontas para App Store e Google Play!

---

## 📱 COMPARAÇÃO: Teste vs Build

| Aspecto | Teste (Expo) | Build Final |
|---------|-----------|---------|
| Setup | 2 min | 10 min |
| Deploy | WiFi | App Store |
| Atualizar | Instant | Resubmit |
| Performance | ✅ Boa | ✅ Melhor |
| Acesso | Seu celular | Usuários |

---

## 🎯 RESUMO

### 5 Passos Essenciais
1. ✅ `npm install -g expo-cli`
2. ✅ Instalar Expo Go no celular
3. ✅ `expo start`
4. ✅ Scan QR code
5. ✅ Testar!

### Tempo
- Setup: 5 min
- Testes: 30 min
- Total: 35 min

### Resultado
- App rodando no seu celular ✅
- Sem bugs encontrados ✅
- Pronto para build final ✅

---

**Vamos começar? 🚀**

```bash
npm install -g expo-cli
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend
npm install
expo start
```

**Depois abra Expo Go no seu celular e scan o QR code!**

---

Data: 23 de março de 2026
Status: ✅ GUIA EXPO COMPLETO
Próximo: Instalar e testar!
