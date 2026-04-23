# ✅ ERRO DE REGISTRO/LOGIN - RESOLVIDO!

## 🎯 Problema Resolvido
Erro HTTP 500 ao tentar **registrar** ou **fazer login**

## 🔴 Causa
**MySQL não estava rodando!** O backend precisa do banco de dados para funcionar.

## ✅ Solução Implementada

### 1️⃣ Iniciar MySQL (Docker)
```bash
docker start escambo-mysql
```

### 2️⃣ Corrigir Erro de Migração
Arquivo: `backend/migrations/20260305000001_create_push_subscriptions_table.js`
- Mudou: `table.text('endpoint')` → `table.string('endpoint', 512)`
- Motivo: Erro de chave MySQL com BLOB/TEXT muito longo

### 3️⃣ Rodar Migrations
```bash
cd backend
npm run migrate
```

## 🧪 Teste Rápido

### Via Terminal
```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@test.com","phone":"11999999999","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"pass123"}'
```

### Via Navegador
1. Acesse: http://localhost:5173
2. Clique em "Criar conta" ou "Entrar"
3. Use as credenciais:

**Usuários Criados:**
| Email | Senha | Nome |
|:--|:--|:--|
| joao@example.com | password123 | João Silva |
| maria@example.com | password123 | Maria Santos |
| pedro.oliveira@example.com | password123 | Pedro Oliveira |

## ✅ Status Verificado

- ✅ MySQL rodando
- ✅ Banco de dados criado
- ✅ Migrations executadas
- ✅ Registro funcionando
- ✅ Login funcionando
- ✅ Usuários de teste criados

## 🚀 Próximo Passo

**Acesse a aplicação agora:**
→ http://localhost:5173

Tudo está pronto para usar! 🎉
