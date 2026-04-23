# 🔗 REFERÊNCIA RÁPIDA - URLs & Acessos

## 🌐 URLs Principais

```
FRONTEND
├─ http://localhost:5173 ............... Aplicação Principal
├─ http://localhost:5173/login ......... Login
├─ http://localhost:5173/register ...... Registro
├─ http://localhost:5173/feed .......... Feed de Itens
├─ http://localhost:5173/likes/received Chat de Matches
└─ http://localhost:5173/profile ....... Perfil

BACKEND API
├─ http://localhost:3000/api/health ... Health Check
├─ http://localhost:3000/api/auth ...... Autenticação
├─ http://localhost:3000/api/items .... Itens
├─ http://localhost:3000/api/messages . Mensagens
├─ http://localhost:3000/api/likes .... Likes
├─ http://localhost:3000/api/matches .. Matches
└─ http://localhost:3000/api/notifications Push Notifications

SOCKET.IO
└─ ws://localhost:3000/socket.io .... WebSocket (Auto)

DATABASE
└─ localhost:3306 ...................... MySQL
```

---

## 🎯 DOCUMENTAÇÃO ATUALIZADA (6 Mar 2026)

### 📖 Comece Aqui (5 min)
- [00_COMECE_AQUI_NOTIFICACOES.md](./00_COMECE_AQUI_NOTIFICACOES.md) - Instruções finais
- [GUIA_RAPIDO_NOTIFICACOES.md](./GUIA_RAPIDO_NOTIFICACOES.md) - Teste em 5-10 min
- [STATUS_BUILD_COMPLETO.md](./STATUS_BUILD_COMPLETO.md) - Status atual ✅

### 📊 Resumos (5-10 min)
- [RESUMO_FINAL_COMPLETO.md](./RESUMO_FINAL_COMPLETO.md) - Resumo visual ⭐
- [RESUMO_EXECUTIVO_FINAL.md](./RESUMO_EXECUTIVO_FINAL.md) - Para gerentes
- [RESUMO_COMPLETO_SESSAO.md](./RESUMO_COMPLETO_SESSAO.md) - Documentação completa

### 🔧 Técnico (10-15 min)
- [NOTIFICACOES_STATUS_FINAL.md](./NOTIFICACOES_STATUS_FINAL.md) - Arquitetura
- [DIAGNOSTICO_NOTIFICACOES.md](./DIAGNOSTICO_NOTIFICACOES.md) - Debugging
- [MUDANCAS_EXATAS_CODIGO.md](./MUDANCAS_EXATAS_CODIGO.md) - Diff de código
- [BUGS_ENCONTRADOS_CORRIGIDOS.md](./BUGS_ENCONTRADOS_CORRIGIDOS.md) - Bugs fixados

### 📚 Índices e Referência
- [00_INDICE_NOTIFICACOES.md](./00_INDICE_NOTIFICACOES.md) - Índice de tudo
- [ARQUIVOS_CRIADOS_MODIFICADOS.md](./ARQUIVOS_CRIADOS_MODIFICADOS.md) - Inventário

### 🧪 Testes
- [GUIA_TESTE_NOTIFICACOES.md](./GUIA_TESTE_NOTIFICACOES.md) - Testes completos (45 min)
- [TESTE_1_2_RAPIDO.md](./TESTE_1_2_RAPIDO.md) - Testes rápidos (10 min)

### 🎨 Visual
- [VISUAL_SUMMARY_NOTIFICACOES.md](./VISUAL_SUMMARY_NOTIFICACOES.md) - Diagramas ASCII

---

## 🔐 Credenciais de Teste

### Usuários Seed (padrão)
```
User 1:
Email:    joao@example.com
Password: password
Name:     João

User 2:
Email:    maria@example.com
Password: password
Name:     Maria

User 3:
Email:    pedro@example.com
Password: password
Name:     Pedro

User 4:
Email:    ana@example.com
Password: password
Name:     Ana

... (mais 6 usuários com mesmo padrão)
```

### Admin (não existe, usar qualquer user)
```
Todos os usuários têm as mesmas permissões
(implementar admin painel em futuro)
```

---

## 📱 Testes no Browser

### DevTools Atalhos
```
F12 ........................ Abrir DevTools
Ctrl+Shift+I ............... Alternativa
Ctrl+Shift+J ............... Console apenas
Ctrl+Shift+C ............... Element picker

No DevTools:
Ctrl+Shift+P ............... Command palette
Ctrl+P ..................... Procurar arquivo
Ctrl+G ..................... Ir para linha
$0 ........................ Elemento selecionado
```

### DevTools Tabs Importante
```
Console ................... Ver logs e errors
Network ................... HTTP/WebSocket
Application → Service Workers ... Ver SW status
Application → Storage ....... LocalStorage, IndexedDB
```

---

## 🧪 Testes Recomendados

### Teste 1: Login
```
1. Acesse: http://localhost:5173/login
2. Email: joao@example.com
3. Senha: password
4. Clique: Entrar

✅ Esperado: Redireciona para /feed
✅ Token: Salvo em localStorage
```

### Teste 2: Feed de Itens
```
1. Na página de login, acesse: http://localhost:5173/feed
2. Ou clique: "🔄 Escambo" (logo)

✅ Esperado: Lista de itens aparece
✅ Itens: Mostram foto, nome, categoria
✅ Botões: Like (+) e arrow (detalhes)
```

### Teste 3: Dar Like e Criar Match
```
1. Na feed, clique em "+" para um item
2. Mude para outra aba/user (maria)
3. Clique em "+" para um item de João

✅ Esperado: Match criado automaticamente
✅ Ambos recebem notificação de match
✅ Podem iniciar chat
```

### Teste 4: Chat em Tempo Real
```
1. Abra duas abas com usuários diferentes
2. Crie um match entre eles (like mútuo)
3. Abra chat em ambas as abas
4. User A envia mensagem

✅ Esperado: User B vê instantaneamente (<1s)
✅ Notificação: Push aparece se habilitada
✅ Sem duplicação: Mensagem aparece uma vez
```

### Teste 5: PWA Installation
```
1. Abra http://localhost:5173
2. Procure: Botão "📥 Instalar" (navbar topo)
3. Clique e confirme

✅ Esperado: Browser mostra modal de instalação
✅ App: Instalado na tela inicial/home screen
✅ Ícone: 192x192 PNG aparece
```

### Teste 6: Push Notifications
```
1. Na navbar, clique: "🔔 Habilitar Notificações"
2. Permita no browser
3. Toast: "Notificações habilitadas!"

✅ Esperado: Subscription salva
✅ No console: Mensagem de sucesso
✅ Próximas mensagens: Notificação push
```

---

## 🛠️ Comandos Rápidos

### Iniciar/Parar Aplicação
```bash
# Iniciar tudo
cd ~/Documents/CodePlace/EscamboWebApp && bash start.sh

# Parar (Ctrl+C em ambos terminais)

# Reiniciar apenas frontend
cd frontend && npm run dev

# Reiniciar apenas backend
cd backend && npm run dev
```

### Verificar Status
```bash
# Health check
curl http://localhost:3000/api/health | jq .

# Verificar portas
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
lsof -i :3306  # MySQL
```

### Limpar Cache
```bash
# Frontend
rm -rf frontend/.vite
rm -rf frontend/node_modules/.vite

# Browser (via DevTools)
F12 → Application → Clear site data → Clear
```

---

## 📊 Endpoints API

### Autenticação
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me (requer token)
```

### Itens
```
GET  /api/items?page=1&limit=20
GET  /api/items/:id
POST /api/items (requer auth)
PUT  /api/items/:id (requer auth)
DELETE /api/items/:id (requer auth)
```

### Likes
```
POST /api/likes (requer auth)
GET  /api/likes/sent (requer auth)
GET  /api/likes/received (requer auth)
```

### Matches
```
GET /api/matches (requer auth)
GET /api/matches/:id (requer auth)
```

### Mensagens
```
GET  /api/messages/:matchId (requer auth)
POST /api/messages (requer auth, Socket.io)
```

### Notificações
```
POST /api/notifications/subscribe (requer auth)
DELETE /api/notifications/subscribe (requer auth)
```

---

## 🔄 Socket.io Events

### Client → Server
```
connect ..................... Conecta ao servidor
disconnect .................. Desconecta
joinChat(matchId) ............ Entra em sala
leaveChat(matchId) ........... Sai de sala
sendMessage(message) ......... Envia mensagem
typing(matchId, typing) ...... Indica digitação
```

### Server → Client
```
message ..................... Nova mensagem
typing ....................... Alguém digitando
connect ..................... Conectado
disconnect .................. Desconectado
error ........................ Erro de conexão
```

---

## 🌍 Estrutura de Dados

### User
```json
{
  "id": 1,
  "email": "joao@example.com",
  "name": "João",
  "avatar_url": "/uploads/avatar_1.jpg",
  "created_at": "2026-03-05T10:00:00Z"
}
```

### Item
```json
{
  "id": 1,
  "user_id": 1,
  "title": "iPhone 12",
  "description": "Em perfeito estado",
  "category": "eletrônicos",
  "photos": ["photo1.jpg", "photo2.jpg"],
  "trade_for": "Algo com a mesma qualidade",
  "created_at": "2026-03-05T10:00:00Z"
}
```

### Match
```json
{
  "id": 1,
  "user1_id": 1,
  "user2_id": 2,
  "item1_id": 10,
  "item2_id": 20,
  "status": "active",
  "created_at": "2026-03-05T10:00:00Z"
}
```

### Message
```json
{
  "id": 1,
  "match_id": 1,
  "sender_id": 1,
  "content": "Oi, tudo bem?",
  "created_at": "2026-03-05T10:05:00Z"
}
```

### Push Subscription
```json
{
  "id": 1,
  "user_id": 1,
  "endpoint": "https://fcm.googleapis.com/...",
  "auth": "base64-encoded-auth-key",
  "p256dh": "base64-encoded-p256dh-key",
  "created_at": "2026-03-05T10:00:00Z"
}
```

---

## 📁 Arquivos Importantes

### Frontend Essenciais
```
frontend/
├── src/main.js ..................... Entry point (Service Worker)
├── src/App.vue ..................... Layout principal
├── src/components/
│   ├── PWAControls.vue ............. ✨ PWA + Notificações
│   └── common/AppNavbar.vue ........ Navbar com PWAControls
├── src/views/
│   ├── ChatView.vue ................ Chat com notificações
│   ├── FeedView.vue ................ Feed de itens
│   └── LoginView.vue ............... Login
├── src/stores/
│   ├── auth.js ..................... Autenticação (Pinia)
│   ├── chat.js ..................... Chat (Pinia)
│   └── matches.js .................. Matches (Pinia)
├── src/composables/
│   ├── usePushNotifications.js ...... ✨ Push API
│   ├── useSocket.js ................ Socket.io
│   └── useNotification.js .......... Toast notifications
└── src/.env ....................... Variáveis de ambiente
```

### Backend Essenciais
```
backend/
├── server.js ...................... Entry point
├── src/app.js ..................... Express app com Socket.io
├── src/routes/
│   ├── authRoutes.js .............. Login/Register
│   ├── messageRoutes.js ............ Mensagens
│   └── notificationRoutes.js ....... ✨ Push Notifications
├── src/controllers/
│   ├── authController.js .......... Lógica de auth
│   ├── chatController.js .......... Lógica de chat
│   └── NotificationController.js .. ✨ Lógica de push
├── src/sockets/
│   └── messageSocket.js ........... Socket.io listeners
├── migrations/
│   └── 20260305000001_create_push_subscriptions_table.js
└── .env ........................... Variáveis de ambiente
```

---

## 🚨 Troubleshooting Rápido

### Problema: Nada carrega
```
Solução:
1. Verifique se ambos serviços rodando: lsof -i :3000 && lsof -i :5173
2. Limpe cache: Ctrl+Shift+Delete
3. Hard refresh: Ctrl+Shift+R
4. Reinicie tudo: pkill -f "node" && bash start.sh
```

### Problema: PWA não instala
```
Solução:
1. Service Worker ativo? DevTools → Application → SW
2. Manifest válido? Chrome coloca 📥 quando tudo certo
3. HTTPS em produção (localhost ok)
4. Limpe dados: Clear site data no DevTools
```

### Problema: Notificações não funcionam
```
Solução:
1. Permissão concedida? Notification.permission === "granted"
2. Subscription existe? Check DevTools Console
3. Service Worker rodando? DevTools → Application → SW
4. Backend respondendo? curl http://localhost:3000/api/health
```

### Problema: Chat não funciona
```
Solução:
1. Socket.io conectado? DevTools → Network → "ws"
2. Match existe entre usuários?
3. Ambos no mesmo matchId?
4. Backend rodando? curl http://localhost:3000
```

---

## 📚 Recursos Externos

```
PWA:
https://web.dev/progressive-web-apps/
https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/

Push Notifications:
https://developer.mozilla.org/en-US/docs/Web/API/Push_API
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

Vue.js:
https://vuejs.org/guide/
https://pinia.vuejs.org/

Express.js:
https://expressjs.com/
https://socket.io/docs/

Testing PWA:
https://www.webpagetest.org/
https://pagespeed.web.dev/
```

---

## ✅ Checklist de Início Rápido

- [ ] Backend rodando em :3000
- [ ] Frontend rodando em :5173
- [ ] Browser abrindo http://localhost:5173
- [ ] Login funcionando
- [ ] Feed carregando
- [ ] Chat em tempo real
- [ ] PWA instalável
- [ ] Notificações habilitáveis
- [ ] Tudo pronto! 🚀

---

**Última atualização:** 5 de Março de 2026

