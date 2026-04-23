# 🗨️ Guia para Testar o Chat

## Fluxo para Acessar o Chat

### Passo 1: Login (Se ainda não estiver logado)
```
URL: http://localhost:5173/login

Credenciais de teste:
- Email: usuario1@test.com
- Senha: senha123

OU crie uma nova conta clicando em "Registrar"
```

### Passo 2: Criar um Match (Necessário para ter chat)
Para acessar o chat, você precisa primeiro ter um **match** com outro usuário.

#### Opção A: Fazer um match testando o Swipe
1. Acesse: `http://localhost:5173/feed`
2. Você verá cards de itens de outros usuários
3. **Deslize para cima/swipe up** para curtir um item
4. Se o outro usuário tiver curtido seu item também, será criado um match! ✅

#### Opção B: Criar manualmente um match (Se tiver 2 contas)
1. Faça login com a conta A
2. Vá para Feed e curta um item da conta B
3. Faça login com a conta B (em outra aba anônima/privada)
4. Vá para Feed e curta um item da conta A
5. Pronto! Match criado entre A e B

### Passo 3: Acessar Matches e Abrir Chat

#### Opção 1: Via Tela de Matches
1. Acesse: `http://localhost:5173/matches`
2. Você verá uma lista de matches
3. Clique em um match para ir para: `http://localhost:5173/matches/:id`
4. Clique em "Abrir Chat" ou similar para acessar: `http://localhost:5173/chat/:matchId`

#### Opção 2: Acesso Direto (Se souber o matchId)
```
URL: http://localhost:5173/chat/1
URL: http://localhost:5173/chat/2
URL: http://localhost:5173/chat/3
```

### Passo 4: Teste o Chat
Na tela de chat você pode:
- ✅ Ver mensagens anteriores
- ✅ Enviar nova mensagem
- ✅ Receber mensagens em tempo real (WebSocket)
- ✅ Ver status do outro usuário

---

## 📋 Checklist de Teste do Chat

### Cenário 1: Chat Básico
- [ ] Acessar `/matches` e ver lista de matches
- [ ] Clicar em um match e abrir chat
- [ ] Enviar uma mensagem
- [ ] Mensagem aparece na tela
- [ ] Voltar para matches e retornar ao chat
- [ ] Mensagem anterior ainda está lá

### Cenário 2: Chat com 2 Usuários (Recomendado)
1. Abra 2 abas do navegador em modo privado/incógnito
2. Aba 1: Login com usuario1@test.com
3. Aba 2: Login com usuario2@test.com
4. Crie um match entre eles (Aba 1 curte Aba 2, Aba 2 curte Aba 1)
5. Aba 1: Vá para `/matches` e abra o chat
6. Aba 2: Vá para `/matches` e abra o **mesmo** chat
7. Aba 1: Envie mensagem → deve aparecer em tempo real na Aba 2 ✅
8. Aba 2: Responda → deve aparecer em tempo real na Aba 1 ✅

### Cenário 3: Verificar WebSocket
1. Abra DevTools (F12 ou Cmd+Option+I)
2. Vá para aba "Network" → filtro "WS" (WebSocket)
3. Você deve ver uma conexão WebSocket ativa
4. Status: `101 Switching Protocols` ou `Connected`
5. Ao enviar mensagem, deve ver frames sendo enviados/recebidos

---

## 🚀 Fluxo Completo de Teste (Recomendado)

```
1. Login → http://localhost:5173/login
2. Feed → http://localhost:5173/feed
3. Swipe para curtir items → cria matches
4. Matches → http://localhost:5173/matches
5. Clique em match → http://localhost:5173/matches/:id
6. Abra Chat → http://localhost:5173/chat/:matchId
7. Teste envio/recebimento de mensagens
```

---

## ⚙️ Dados de Teste

Se precisar de contas de teste, você pode usar:

```sql
-- No banco de dados, você pode verificar usuários:
SELECT id, name, email FROM users LIMIT 10;

-- Ou criar novos usuários via Registrar na UI
```

---

## 🔧 Se o Chat não carregar

1. ✅ Verifique se está logado (deve ter token JWT)
2. ✅ Verifique se tem um match válido (matchId > 0)
3. ✅ Abra DevTools (F12) e veja a aba Console para erros
4. ✅ Verifique a aba Network para ver requisições da API
5. ✅ Reinicie o servidor: `npm run dev` na pasta frontend
6. ✅ Limpe o cache: Ctrl+Shift+Delete ou Cmd+Shift+Delete

---

## 📊 Status do Componente Chat

**Arquivo:** `frontend/src/views/ChatView.vue`

**Features Implementadas:**
- ✅ Listar mensagens do match
- ✅ Enviar nova mensagem
- ✅ WebSocket para tempo real
- ✅ Suportar imagens nas mensagens
- ✅ Timestamp das mensagens
- ✅ Dados do outro usuário (nome, foto)

**Rotas Relacionadas:**
- `/matches` - Lista todos os matches
- `/matches/:id` - Detalhe de 1 match (pode abrir chat daqui)
- `/chat/:matchId` - Chat com outro usuário

---

## 💡 Dicas

- Se tiver múltiplos matches, teste o chat com cada um
- WebSocket deve conectar automaticamente
- Se houver erro de autenticação, faça login novamente
- Mensagens de teste: "Olá!", "Tudo bem?", "Oi! 👋"

---

**Boa sorte com os testes! 🎉**
