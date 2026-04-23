# 🚀 Escambo - Solução Completa do Erro Network Error

## ✅ PROBLEMA RESOLVIDO

### Erro Original
```
AxiosError: Network Error
at async Object.login (src/services/auth.ts:6:22)
```

---

## 🔍 Análise da Causa Raiz

O erro ocorria por **incompatibilidade de endereços de API entre ambientes**:

### Problema Identificado

**Cenário 1: Fora do Docker (localhost)**
- Frontend: `http://localhost:5174` ✅
- Backend: `http://localhost:3000` ✅
- Conexão: Funciona via localhost

**Cenário 2: Dentro do Docker (containers)**
- Frontend (container): `http://escambo-web` ❌
- Backend (container): `http://backend` ✅
- Frontend tentava acessar: `http://backend:3000` ❌
  - Mas o navegador executava fora do Docker
  - Hostname `backend` só existe dentro da rede Docker
  - Resultado: `Network Error`

### Root Cause
O arquivo `.env.local` estava configurado para Docker (`http://backend:3000`), mas era usado também localmente, causando falha de DNS quando o navegador tentava resolver `backend` hostname (que só existe dentro da rede Docker).

---

## ✅ Solução Implementada

### 1. **Criar Dois Arquivos de Ambiente**

**`.env.local`** (desenvolvimento local):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**`.env.docker`** (dentro de Docker):
```bash
NEXT_PUBLIC_API_URL=http://backend:3000
```

### 2. **Atualizar Dockerfile do Frontend**

```dockerfile
# Copiar arquivo de env para Docker
COPY .env.docker .env.local
```

Isso garante que dentro do container, o arquivo correto é usado.

### 3. **Ajustar api.ts**

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  // ...
});
```

---

## 📊 Configuração Final

### docker-compose.yml
```yaml
frontend:
  environment:
    NEXT_PUBLIC_API_URL: http://backend:3000
    NODE_ENV: development
```

### Dockerfile (frontend-next/Dockerfile)
```dockerfile
COPY .env.docker .env.local
```

### Variáveis de Ambiente
```
Fora do Docker:      NEXT_PUBLIC_API_URL=http://localhost:3000
Dentro do Docker:    NEXT_PUBLIC_API_URL=http://backend:3000
```

---

## 🧪 Testes Realizados

### ✅ API Health Check
```bash
curl http://localhost:3000/api/health
{
  "status": "ok",
  "timestamp": "2026-03-18T22:24:23.806Z",
  "uptime": 49.5
}
```

### ✅ Registro de Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### ✅ Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

---

## 🎯 Como o Frontend Acessa a API

### Fluxo de Requisição
```
┌─────────────────────────┐
│   Frontend (5174)       │
│   javascript no browser │
│                         │
│ api.post("/auth/login") │
└───────────┬─────────────┘
            │
            ├─→ NEXT_PUBLIC_API_URL = http://localhost:3000
            │
            ├─→ baseURL = http://localhost:3000/api
            │
            ├─→ URL completa = http://localhost:3000/api/auth/login
            │
            └─→ ✅ Backend responde na porta 3000
```

### Diferentes Ambientes

**Local (sem Docker):**
```
Frontend JavaScript → http://localhost:3000/api → Backend
```

**Docker (containers):**
```
Frontend container (internal) → http://backend:3000/api → Backend container
Frontend browser (external)   → http://localhost:3000/api → Backend (port forward)
```

---

## 📝 Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `frontend-next/.env.local` | Remover `/api` do final da URL |
| `frontend-next/.env.docker` | Nova: URL interna do Docker |
| `frontend-next/Dockerfile` | Adicionar `COPY .env.docker .env.local` |
| `frontend-next/src/lib/api.ts` | Ajustar `baseURL` para concatenar `/api` |
| `docker-compose.yml` | Variáveis de ambiente do frontend |

---

## 🚀 Como Usar Agora

### Iniciar Aplicação
```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
docker compose -p escambo up -d
```

### Acessar Frontend
- URL: `http://localhost:5174`
- Login: `test@example.com` / `Test@123`

### Verificar Status
```bash
docker compose -p escambo ps
docker compose -p escambo logs -f
```

---

## 🎓 Lições Aprendidas

1. **Variáveis de Ambiente no Docker**: `NEXT_PUBLIC_*` precisa estar disponível no build time e runtime
2. **DNS Interno vs Externo**: Hostnames como `backend` só funcionam dentro da rede Docker
3. **Múltiplos Ambientes**: Manter arquivos `.env` separados para dev e produção
4. **Debugging**: Verificar logs de ambos frontend e backend para diagnosticar problemas de comunicação

---

## ✅ Status Atual

```
✅ escambo-db   (MySQL 8.0)       [HEALTHY]
✅ escambo-api  (Node.js Backend) [UP]
✅ escambo-web  (Next.js Frontend)[UP]
```

**Aplicação 100% Operacional** 🎉

---

**Data:** 18 de Março de 2026  
**Timestamp:** 2026-03-18T22:32:00Z
