# 🧪 GUIA DE TESTE - NOTIFICAÇÕES DE CHAT

**Objetivo:** Validar que as notificações funcionam quando um usuário envia mensagem  
**Tempo Estimado:** 10-15 minutos  
**Dificuldade:** Fácil ✅

---

## 📋 Pré-requisitos

✅ Backend rodando: http://localhost:3000  
✅ Frontend rodando: http://localhost:5173  
✅ 2 usuários de teste:
- João Silva: `joao@example.com` / `password123`
- Maria Santos: `maria@example.com` / `password123`

---

## 🎯 Teste 1: Notificação Toast (Sempre Funciona)

### Objetivo
Validar que quando uma mensagem chega, um pop-up aparece no canto tela.

### Passos

1️⃣ **Abrir 2 abas do navegador**
```
Aba 1: http://localhost:5173
Aba 2: http://localhost:5173
```

2️⃣ **Login em cada aba**
```
Aba 1: Login como João (joao@example.com / password123)
Aba 2: Login como Maria (maria@example.com / password123)
```

3️⃣ **João abre chat com Maria**
```
Aba 1 (João):
- Vá para /matches
- Clique em qualquer match com Maria
- Aguarde carregar chat
```

4️⃣ **Maria envia mensagem**
```
Aba 2 (Maria):
- Vá para /matches
- Clique no mesmo match com João
- Escreva uma mensagem: "Olá João, tudo bem?"
- Envie a mensagem
```

5️⃣ **Validar notificação em João**
```
Aba 1 (João):
✅ Pop-up deve aparecer no canto INFERIOR DIREITO
✅ Texto: "💬 Mensagem recebida"
✅ Contém nome: "Maria Santos: Olá João..."
✅ Desaparece após alguns segundos ou clique
```

### Validação ✅
- [ ] Pop-up aparece no canto
- [ ] Contém nome do remetente
- [ ] Contém preview da mensagem
- [ ] Desaparece automaticamente

---

## 🔊 Teste 2: Som de Notificação

### Objetivo
Validar que um som é reproduzido quando mensagem chega.

### Passos

1️⃣ **Preparar navegador**
```
- Verifique se som do navegador está ativado
- Volume do computador deve estar ligado
- Não use fones com volume muito baixo
```

2️⃣ **Usar Teste 1 como base**
```
Repita os passos 1-4 do Teste 1
```

3️⃣ **Maria envia mensagem**
```
Aba 2 (Maria):
- Envie uma mensagem
```

4️⃣ **Validar som em João**
```
Aba 1 (João):
🔊 Você deve ouvir: "ding-ding" (dois tons)
   Tons: 800Hz + 1000Hz
   Duração: ~150ms total
```

### Validação ✅
- [ ] Som é ouvido quando mensagem chega
- [ ] Som é discreto (não muito alto)
- [ ] Som não interfere com outras notificações
- [ ] Você consegue ouvir e voltar para conversa normalmente

---

## 📱 Teste 3: Push Notification (Requer Permissão)

### Objetivo
Validar que notificação do sistema operacional aparece.

### Pré-requisitos
- Permissão de notificação deve estar ativada
- PWAControls deve ter botão de notificações

### Passos

1️⃣ **Ativar Notificações Push**
```
Aba 1 (João):
- Procure pelo botão "🔔 Habilitar" em PWAControls
- Clique no botão
- Navegador pode pedir permissão
- Autorize a permissão
- Botão muda para "🔔 Desabilitar"
```

2️⃣ **Minimizar aba ou ir para outra aba**
```
- Minimize a aba 1 do navegador
OU
- Clique em outra aba/aplicativo
- A aba 1 não deve estar visível na tela
```

3️⃣ **Maria envia mensagem**
```
Aba 2 (Maria):
- Envie uma mensagem para João
```

4️⃣ **Validar notificação do SO**
```
Você deve ver:
┌─────────────────────────────────┐
│ Escambo                         │
│ ┌───────────────────────────┐   │
│ │ 💬 Nova mensagem de Maria │   │
│ │ Olá João, tudo bem?...    │   │
│ │                           │   │
│ │ [Abrir] [Fechar]          │   │
│ └───────────────────────────┘   │
└─────────────────────────────────┘

Validações:
✅ Notificação aparece mesmo em aba inativa
✅ Título mostra "Escambo"
✅ Corpo mostra: "Nova mensagem de [Nome]"
✅ Preview da mensagem
✅ Botões "Abrir" e "Fechar"
```

5️⃣ **Testar clique**
```
- Clique em "Abrir"
- João deve:
  a) Voltar para aba do navegador
  b) Ir automaticamente para o chat
  c) Ver a mensagem recebida
```

### Validação ✅
- [ ] Notificação do SO aparece
- [ ] Mesmo em aba inativa
- [ ] Clique abre o chat
- [ ] Mensagem aparece no chat

---

## 📵 Teste 4: Notificação em Aba Inativa (Integrado com Teste 3)

### Objetivo
Validar que notificações funcionam quando aba não está em foco.

### Passos (Usar Teste 3 como base)

1️⃣ **Setup**
```
Aba 1 (João): Chat aberto
Aba 2 (Maria): Chat aberto
```

2️⃣ **João clica em outra aba**
```
- Clique na aba do navegador que não é a 1
- OU clique em outro aplicativo
- João não consegue ver a aba 1 mais
```

3️⃣ **Maria envia mensagem**
```
- Aba 2 (Maria): Envie mensagem
```

4️⃣ **Validar notificações em João**
```
Mesmo com aba inativa:
✅ Toast não pode aparecer (aba não visível)
✅ Mas PUSH NOTIFICATION aparece
✅ E som ainda é ouvido
```

### Validação ✅
- [ ] Push notification aparece (mesmo inativo)
- [ ] Som toca (mesmo inativo)
- [ ] Ao clicar na notificação, abre aba

---

## 🔇 Teste 5: Sem Notificação para Própria Mensagem

### Objetivo
Validar que João não recebe notificação quando ele mesmo envia mensagem.

### Passos

1️⃣ **João está no chat com Maria**
```
Aba 1 (João): Chat aberto
```

2️⃣ **João envia mensagem**
```
- Escreva: "Oi Maria!"
- Clique em enviar
```

3️⃣ **Validar**
```
✅ João NÃO recebe notificação
✅ Nenhum toast aparece
✅ Nenhum som toca
✅ Nenhuma push notification

(É normal receber confirmação de envio, mas não notificação)
```

### Validação ✅
- [ ] Nenhuma notificação para mensagem própria

---

## ❌ Teste 6: Tratamento de Erros

### Objetivo
Validar comportamento em casos de erro.

### Cenário 1: Som não funciona
```
Resultado esperado:
- Toast still appears ✅
- Push still works ✅
- Erro no console: "Não foi possível reproduzir som"
- App continua normal
```

### Cenário 2: Push não permitido
```
Se usuário negar permissão:
- Toast still appears ✅
- Som still works ✅
- Push não funciona (esperado)
- App continua normal
```

### Cenário 3: Sem conexão
```
Se Internet cair:
- Mensagens não chegam (esperado)
- Sem notificações (esperado)
- App mostra indicador offline
```

---

## 🎨 Teste 7: Múltiplas Mensagens

### Objetivo
Validar que múltiplas notificações aparecem corretamente.

### Passos

1️⃣ **João no chat com Maria**
```
Aba 1 (João): Chat aberto
```

2️⃣ **Maria envia 3 mensagens rápido**
```
Aba 2 (Maria):
1. Envie: "Oi!"
2. Envie: "Como vai?"
3. Envie: "Responde!"
(Com 1-2 segundos entre cada)
```

3️⃣ **Validar notificações**
```
João deve ver:
✅ 3 toast notifications (uma por uma)
✅ 3 sons (ding-ding, 3 vezes)
✅ 3 push notifications (ou 1 atualizada)
```

### Validação ✅
- [ ] Cada mensagem gera notificação
- [ ] Não se misturam/duplicam
- [ ] Todas aparecem no chat

---

## 🛠️ Troubleshooting

### Problema 1: Toast não aparece
```
Solução:
1. Verifique se backend está rodando
2. Verifique console (F12) para erros
3. Recarregue página (Ctrl+R)
4. Tente fazer login novamente
```

### Problema 2: Som não funciona
```
Solução:
1. Verifique volume do navegador
2. Verifique volume do computador
3. Tente outro navegador
4. Web Audio API pode estar bloqueada
```

### Problema 3: Push não aparece
```
Solução:
1. Clique em "🔔 Habilitar Notificações"
2. Autorize quando navegador pedir
3. Verifique se está em http:// ou https://
4. Alguns navegadores bloqueiam em localhost
```

### Problema 4: Notificação clica mas não abre
```
Solução:
1. Verifique se Service Worker está ativo
2. Abra DevTools → Application → Service Workers
3. Veja se há erros
4. Recarregue página
```

---

## ✅ Checklist Final

- [ ] Toast notification aparece
- [ ] Som de notificação funciona
- [ ] Push notification aparece (se permissão ativada)
- [ ] Notificação não aparece para mensagem própria
- [ ] Múltiplas mensagens = múltiplas notificações
- [ ] Clique em push abre chat correto
- [ ] Funciona com aba inativa
- [ ] Sem erros no console (F12)

---

## 🎉 Sucesso!

Se todos os testes passarem, o sistema de notificações está 100% funcional! 🚀

**Dica:** Você pode também testar com 2 navegadores diferentes para melhor simular experiência real.
