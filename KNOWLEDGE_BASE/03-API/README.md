# 🔌 API - Knowledge Base

**Categoria**: Endpoints, Documentação e Integração  
**Status**: ✅ Completo  
**Última Atualização**: 17 de Março de 2026

---

## 📋 Documentos Nesta Pasta

| Documento | Descrição | Status |
|-----------|-----------|--------|
| `00-INTRODUCAO.md` | Introdução e visão geral | ✅ Completo |
| `ENDPOINTS.md` | Lista completa de endpoints | ✅ Completo |
| `AUTENTICACAO.md` | JWT e segurança | 📝 Rascunho |
| `EXEMPLOS_REQUISICOES.md` | Exemplos práticos | ✅ Disponível |

---

## 📊 API Overview

- **Base URL**: `http://localhost:3000`
- **Autenticação**: JWT (Bearer Token)
- **Formato**: JSON
- **CORS**: Habilitado

---

## 🎯 Endpoints Principais

### Autenticação (5 endpoints)
- POST `/api/auth/login`
- POST `/api/auth/register`
- GET `/api/auth/me`
- PUT `/api/auth/profile`
- POST `/api/auth/avatar`

### Items (9 endpoints)
- GET `/api/items`
- GET `/api/items/feed`
- GET `/api/items/:id`
- GET `/api/items/mine`
- POST `/api/items`
- PUT `/api/items/:id`
- DELETE `/api/items/:id`
- POST `/api/items/:id/photos`
- DELETE `/api/items/:id/photos/:photoId`

### Likes (4 endpoints)
- GET `/api/likes/my`
- GET `/api/likes/received`
- POST `/api/likes/:itemId`
- DELETE `/api/likes/:itemId`

### Matches (4 endpoints)
- GET `/api/matches`
- GET `/api/matches/:id`
- POST `/api/matches`
- PUT `/api/matches/:id`

### Messages (2 endpoints)
- GET `/api/matches/:matchId/messages`
- POST `/api/matches/:matchId/messages`

### System (1 endpoint)
- GET `/api/health`

---

## 🔗 Documentos Relacionados

- [RELATORIO_TESTES_FINAL.md](../../RELATORIO_TESTES_FINAL.md)
- [backend-simple.js](../../backend-simple.js)

---

✅ API está 100% testada e pronta para migração
