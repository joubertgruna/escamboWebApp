# 🔧 DIAGNÓSTICO: Por que a mensagem não está sendo enviada?

## 📋 PASSOS PARA DIAGNOSTICAR

### 1️⃣ ABRA O DEVTOOLS (F12)

1. Abra o navegador em `http://localhost:5173/chat/1`
2. Pressione **F12** (ou Cmd+Option+I no Mac)
3. Vá para a aba **Console**

### 2️⃣ TENTE ENVIAR UMA MENSAGEM

1. Digite algo no input do chat (ex: "Olá!")
2. Clique no botão ➤
3. **IMEDIATAMENTE**, verifique o Console (F12)

### 3️⃣ PROCURE POR ESTES LOGS:

```
✅ SUCESSO (você verá):
"📤 Enviando mensagem:" (em amarelo/azul)
"✅ Mensagem enviada com sucesso" (em azul)

❌ ERRO (você verá):
"❌ Erro ao enviar mensagem:" (em vermelho)
"Detalhes:" (com informações do erro)
```

### 4️⃣ QUAL É O ERRO? (Possibilidades)

#### Erro A: "Token inválido ou expirado"
```
Significa: Sua sessão expirou
Solução: 
1. Logout (clique em Perfil)
2. Faça login novamente
3. Tente enviar mensagem de novo
```

#### Erro B: "Sem permissão para enviar mensagens"
```
Significa: Você não é participante do match
Solução:
1. Verifique se está no match correto
2. Volte para /matches
3. Tente outro match
```

#### Erro C: "Is not a function" ou "cannot read property"
```
Significa: Bug no código
Solução: Me avise! Vou corrigir imediatamente
Copie o erro completo do console e mande
```

#### Erro D: "Network error" ou "Failed to fetch"
```
Significa: Backend não está rodando
Solução:
1. Verifique se backend está rodando (npm start em /backend)
2. Verifique se está na porta 3000
3. Teste: curl http://localhost:3000/api/health
```

#### Erro E: "Nada acontece" (sem logs, sem erro)
```
Significa: Mensagem está sendo enviada mas algo está silencioso
Solução:
1. Vá para aba Network (F12)
2. Clique em enviar
3. Procure por requisição POST para /chat/1
4. Clique nela e veja a resposta (Response tab)
5. Mande a resposta para mim
```

---

## 📡 VERIFICAR NETWORK (Aba Network do DevTools)

1. F12 → Network tab
2. Filtro: **XHR** (para ver requisições API)
3. Limpe os logs (ícone de lixo)
4. Clique em enviar mensagem
5. Você deve ver uma requisição:

```
POST http://localhost:3000/api/chat/1
Status: 201 (Created) ✅
ou
Status: 400/403/500 ❌
```

Se o status for:
- **201** → Mensagem foi enviada! Bug visual apenas
- **400** → Validação falhou (conteúdo vazio?)
- **403** → Sem permissão (token inválido?)
- **500** → Erro no servidor (backend quebrou)

---

## 🧪 TESTE RÁPIDO COM CURL

Se quiser testar sem o frontend, abra Terminal e execute:

```bash
# Primeiro, faça login para pegar um token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario1@test.com",
    "password": "senha123"
  }' \
  2>&1 | jq .data.token
```

Você verá um token JWT longo. Copie ele.

Depois execute:

```bash
# Cole o token aqui ↓↓↓
TOKEN="seu-token-super-longo-aqui"

curl -X POST http://localhost:3000/api/chat/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content": "Teste de mensagem"}' | jq
```

Se retornar um objeto com `id`, `content`, `sender_id` → **backend está OK!**

---

## ✅ RESUMO: O QUE FOI MELHORADO

1. ✅ Adicionado console.log para rastrear o fluxo
2. ✅ Adicionado try/catch para pegar erros
3. ✅ Adicionadas notificações de sucesso/erro
4. ✅ Melhoradas mensagens de erro

**Próximo passo:**
1. Recarregue o navegador (Cmd+Shift+R)
2. Tente enviar uma mensagem
3. Abra o Console (F12)
4. **Me mande o print/screenshot do que aparecer no console**

---

## 🆘 SE CONTINUAR SEM FUNCIONAR

Me mande:
1. **Print do Console** (F12 → Console)
2. **Print do Network** (F12 → Network → POST request)
3. **O que aparece em cada um**

Com essas informações conseguirei diagnosticar e corrigir! 🎯
