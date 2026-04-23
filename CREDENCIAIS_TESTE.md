# 🔐 CREDENCIAIS VÁLIDAS DE TESTE

A senha de todos os usuários de teste é: **`password`**

## Usuários Disponíveis para Login

```
1. João Silva
   Email: joao@example.com
   Senha: password

2. Maria Santos
   Email: maria@example.com
   Senha: password

3. Carlos Oliveira
   Email: carlos@example.com
   Senha: password

4. Ana Costa
   Email: ana@example.com
   Senha: password

5. Pedro Ferreira
   Email: pedro@example.com
   Senha: password
```

---

## 🎯 Como Testar o Chat Agora

### Passo 1: Login com Credenciais Válidas
1. Ir para `http://localhost:5173/login`
2. Email: `joao@example.com`
3. Senha: `password`
4. Clique em "Entrar"

### Passo 2: Crie um Match
1. Ir para Feed (`/feed`)
2. Swipe para cima em alguns items para criar likes
3. Ir para Matches (`/matches`)
4. Clique em um match para abrir MatchView

### Passo 3: Abra o Chat
1. Clique em "Conversar" (botão no MatchView)
2. Você deve estar agora em `/chat/1`

### Passo 4: Envie uma Mensagem
1. Digite algo no input (ex: "Olá!")
2. Clique no botão ➤
3. **Abra o Console (F12) e procure por:**
   - ✅ "Mensagem enviada com sucesso" (azul)
   - ❌ "Erro ao enviar mensagem" (vermelho)

---

## 💡 Problema Anterior

O erro `401 (Unauthorized)` significava que:
- Email ou senha estava incorreto
- Você estava usando credenciais que não existem no banco

**Agora com essas credenciais válidas, tudo deve funcionar!** 🚀

---

## 🆘 Se Continuar Falhando

1. Verifique se o backend está rodando:
   ```bash
   ps aux | grep "node server.js"
   ```

2. Verifique se o banco foi seedado:
   ```bash
   npm run seed
   ```

3. Teste se o backend responde:
   ```bash
   curl http://localhost:3000/api/health
   ```

Qualquer problema, me avisa!
