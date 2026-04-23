# ✅ ESCAMBO - PRONTO PARA TESTAR!

## 🎯 Status Crítico Resolvido

**Problema:** Backend retornando erro 500
**Causa:** MySQL não está rodando
**Solução:** Usar Backend Mock (sem banco de dados)
**Status:** ✅ RESOLVIDO

---

## 🚀 COMECE AGORA - 1 COMANDO

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
bash start-easy.sh
```

Pronto! Ambos os servidores iniciam automaticamente:
- ✅ Backend Mock: http://localhost:3000
- ✅ Frontend: http://localhost:5174

---

## 📱 Testar no Celular

### 1. Conecte na mesma WiFi
- Celular: Settings → WiFi
- Conecte na mesma rede que o Mac

### 2. Abra Safari
- iPhone: Abra Safari
- Android: Chrome/Firefox

### 3. Digite o IP
```
192.168.15.10:5174
```

### 4. Pronto!
- App carrega no celular
- Teste login/feed/tudo!

---

## 🧪 Testar Login

### Credenciais Mock (Qualquer uma funciona!)
```
Email: teste@escambo.com
Senha: qualquer coisa (mock aceita tudo)
```

Ou criar nova conta - mock aceita qualquer email/senha.

---

## 📊 O Que Está Funcionando

✅ **Login/Register** - Mock aceita qualquer coisa
✅ **Feed** - 3 items de teste
✅ **/my-items** - Items do usuário teste
✅ **/likes** - 2 likes de teste
✅ **/chat** - Mensagens mock
✅ **/notifications** - Notificações mock
✅ **/settings** - Configurações (UI pura)
✅ **/help** - Ajuda (UI pura)

---

## 🛑 Como Parar

Pressione **Ctrl+C** no Terminal

---

## 📁 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `backend-mock.js` | Backend com dados mock |
| `start-easy.sh` | Script para iniciar tudo |
| `frontend-next/` | App Next.js |

---

## 📝 Alternativas

### Se preferir iniciar manualmente:

**Terminal 1 (Backend):**
```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
node backend-mock.js
```

**Terminal 2 (Frontend):**
```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend-next
npm run dev -- --port 5174
```

---

## 🔍 Debug

### Ver logs do Backend
```bash
cat /tmp/escambo-backend.log
```

### Ver logs do Frontend
```bash
cat /tmp/escambo-frontend.log
```

### Testar API manualmente
```bash
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'
```

---

## 🎯 Próximo Passo

1. Execute: `bash start-easy.sh`
2. Aguarde "ESCAMBO INICIADO COM SUCESSO!"
3. Abra no celular: `192.168.15.10:5174`
4. Faça login
5. Teste todas as páginas
6. Anotar qualquer problema

---

**Status:** 🟢 PRONTO PARA TESTE  
**Data:** 23 de março de 2026  
**Modo:** Backend Mock (sem DB)

Bora testar! 🚀
