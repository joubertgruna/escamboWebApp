# 🧪 GUIA RÁPIDO DE TESTES - PWA & Push Notifications

## ⚡ Quick Start (5 minutos)

### 1. Acesse a aplicação
```
http://localhost:5173
```

### 2. Teste PWA Installation

**No Chrome/Edge/Firefox:**

```
1. Clique no ícone de menu (⋯) → "Instalar Escambo"
   OU
2. Clique no botão "📥 Instalar App" na navbar (topo)

✅ Esperado: Dialog de instalação aparece
✅ Confirme: App será instalado na tela inicial
```

### 3. Teste Push Notifications

**Na mesma página:**

```
1. Clique no botão "🔔 Habilitar Notificações"
2. Browser pedirá permissão: Clique "Permitir"
3. Toast verde confirmará: "Notificações habilitadas!"

✅ Esperado: Permissão concedida
✅ Esperado: Subscription salva no backend
```

### 4. Teste Chat com Notificações

**Prepare dois usuários:**

```
ABA 1: http://localhost:5173 → Login como User 1
ABA 2: http://localhost:5173 → Login como User 2

Exemplo de credenciais (do seed):
- joao@example.com / password
- maria@example.com / password
```

**Teste de mensagem:**

```
ABA 1 (User 1):
  1. Clique em "👍" para like um item de User 2
  2. Abra chat com User 2

ABA 2 (User 2):
  1. Clique em "👍" para like um item de User 1
  2. Abra chat com User 1

ABA 1 (User 1):
  1. No chat, escreva uma mensagem
  2. Clique "Enviar"

ABA 2 (User 2):
  ✅ ESPERADO: Mensagem aparece instantaneamente
  ✅ ESPERADO: Notificação "Nova mensagem de [User 1]" aparece
  ✅ ESPERADO: Som de notificação (se habilitado no browser)
```

---

## 🔍 Verificações Técnicas

### Verificar Service Worker

```javascript
// No DevTools Console (F12):
navigator.serviceWorker.getRegistrations().then(reg => {
  console.log('Service Workers:', reg);
  console.log('Ativo:', reg[0]?.active);
});
```

✅ Esperado: 1 registro com active = ServiceWorkerContainer

### Verificar Push Subscription

```javascript
// No DevTools Console:
navigator.serviceWorker.ready.then(reg => {
  return reg.pushManager.getSubscription();
}).then(sub => {
  console.log('Push Subscription:', sub);
  console.log('Endpoint:', sub?.endpoint);
});
```

✅ Esperado: Subscription com endpoint válido

### Verificar Permissões

```javascript
// No DevTools Console:
Notification.permission
```

✅ Esperado: "granted" (se habilitou notificações)

### Verificar Backend

```bash
# Terminal:
curl http://localhost:3000/api/health

# Esperado:
# {"status":"ok","timestamp":"2026-03-05...","uptime":123.45}
```

---

## 📱 Teste em Mobile (Android)

### Chrome Mobile:

```
1. Abra http://localhost:5173 no Chrome mobile
2. Toque em ⋯ (menu) → Instalar app
3. App aparecerá na home screen
4. Notificações funcionam mesmo quando app está minimizado
```

### Firefox Mobile:

```
1. Abra http://localhost:5173 no Firefox mobile
2. Toque em ⋯ → Instalar app
3. Toque em botão "🔔 Habilitar" para notificações
4. Volte para home screen
5. Abra outra app
6. Notificação deve aparecer se receber mensagem
```

---

## 🐛 Troubleshooting

### ❌ PWA não instala

**Solução:**

```
1. Certifique-se que está em http://localhost (HTTPS em produção)
2. Verifique Service Worker no DevTools → Application → Service Workers
3. Limpe cache: DevTools → Aplicativo → Armazenamento → Limpar dados
4. Recarregue (Ctrl+Shift+R hard refresh)
```

### ❌ Notificações não aparecem

**Solução:**

```
1. Verifique permissão: Notification.permission === "granted"
2. Verifique Service Worker ativo
3. Verifique console para erros: F12 → Console
4. Tente habilitar novamente o botão 🔔
```

### ❌ Mensagens não chegam em tempo real

**Solução:**

```
1. Verifique Socket.io: DevTools → Network → WS ou polling
2. Verifique backend: curl http://localhost:3000/api/health
3. Recarregue a página (Ctrl+R)
4. Verif ique console para erros de conexão
```

### ❌ Backend retorna erro

**Solução:**

```
1. Reinicie o backend: 
   - Feche: Ctrl+C no terminal
   - Inicie: npm run dev (na pasta backend)

2. Verifique banco de dados:
   - MySQL deve estar rodando
   - docker-compose up -d mysql

3. Verifique variáveis de ambiente:
   - cat backend/.env | grep VAPID
```

---

## ✅ Checklist de Testes

### Funcionalidade

- [ ] PWA instalável
- [ ] Push notifications habilitáveis
- [ ] Chat em tempo real
- [ ] Notificações aparecem no chat
- [ ] Mensagens não duplicam
- [ ] Funciona offline (notificação)

### Compatibilidade

- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Chrome Mobile
- [ ] Firefox Mobile
- [ ] Safari (iOS) - parcial

### Performance

- [ ] Mensagens carregam em < 1s
- [ ] Notificações aparecem em < 500ms
- [ ] PWA instala em < 10s
- [ ] Sem lag/freeze na UI

### Segurança

- [ ] VAPID keys configuradas
- [ ] Subscriptions salvas
- [ ] Permissões solicitadas
- [ ] Service Worker seguro

---

## 📊 Logs Esperados

### No Console (DevTools - F12)

```javascript
// Quando carrega:
✅ "🔌 Conectando ao Socket.io..."
✅ "✅ Chat iniciado. Socket: conectando, Polling: ativo"

// Quando mensagem chega:
✅ "📨 Nova mensagem recebida via Socket: {…}"
✅ "🔔 Enviando notificação push para nova mensagem"

// Quando habilita notificações:
✅ "Permissão de notificações: granted"
✅ "✅ Subscrito a push notifications"
```

### No Terminal (Backend)

```
✅ "🚀 Escambo API running on port 3000"
✅ "[info]: Socket.io initialized"

// Quando mensagem é enviada:
✅ "POST /api/messages" ou Socket.io emit
✅ "[debug]: GET /api/messages" (polling)
```

---

## 🎯 Cenários de Teste

### Cenário 1: Novo Usuário
```
1. Acesse http://localhost:5173
2. Clique em "Registrar"
3. Preencha formulário
4. Faça login
5. Clique "📥 Instalar App"
6. Clique "🔔 Habilitar Notificações"
✅ SUCESSO: Notificações habilitadas no app novo
```

### Cenário 2: Chat em Tempo Real
```
1. Abra 2 abas
2. Login com usuários diferentes
3. Like item do outro usuário
4. Abra chat
5. User A envia mensagem
6. User B vê em tempo real
✅ SUCESSO: Mensagem carrega instantaneamente
```

### Cenário 3: Offline com Notificação
```
1. DevTools → Network → Offline
2. Mensagem de outro usuário (mudar aba ou app outra)
3. Volta para Online
✅ SUCESSO: Notificação apareceu mesmo offline
```

### Cenário 4: PWA Standalone
```
1. Instale app via PWA
2. Abra app do home screen
3. Envie/receba mensagens
4. Clique em link → abre no app
✅ SUCESSO: App funciona como aplicativo nativo
```

---

## 📞 Suporte

**Dúvidas?**

1. Verifique Console (F12)
2. Verifique Storage: DevTools → Application → Storage
3. Verifique Network: DevTools → Network (WS para Socket.io)
4. Restart backend e frontend
5. Limpe cache do browser

**Erro persistente?**

```bash
# Reset completo:
1. Feche todas as abas
2. Limpe cache: Ctrl+Shift+Delete (ou Cmd+Shift+Delete no Mac)
3. Desinstale app se já instalou
4. Recarregue: http://localhost:5173
```

---

## 🚀 Deploy (Próximo Passo)

Para deploy em produção:

```bash
# 1. Renovar VAPID keys para produção
npx web-push generate-vapid-keys

# 2. Configurar HTTPS (obrigatório)
# - LetsEncrypt ou certificado self-signed

# 3. Atualizar .env com domínio real
VAPID_SUBJECT=mailto:seu_email@seu_dominio.com

# 4. Deploy frontend (build)
npm run build

# 5. Deploy backend com docker
docker-compose -f docker-compose.prod.yml up -d
```

---

**Boa sorte com os testes! 🚀**

Data: 5 de Março de 2026  
Status: ✅ Pronto para Testes
