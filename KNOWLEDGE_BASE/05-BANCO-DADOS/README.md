# 🗄️ BANCO DE DADOS - Knowledge Base

**Categoria**: MySQL, Migrations e Schema  
**Status**: ✅ Inicializado  
**Última Atualização**: 17 de Março de 2026

---

## 📋 Documentos Nesta Pasta

| Documento | Descrição | Status |
|-----------|-----------|--------|
| `SCHEMA.md` | Estrutura das tabelas | 📝 Rascunho |
| `MIGRATIONS.md` | Como criar migrations | 📝 Rascunho |
| `QUERIES_COMUNS.md` | Queries frequentes | 📝 Rascunho |
| `BACKUP_RESTORE.md` | Backup e restore | 📝 Rascunho |

---

## 📊 Database Info

**Nome**: escambo_dev  
**Host**: localhost:3306  
**Usuário**: escambo  
**Senha**: escambo123  

---

## 📋 Tabelas Principais

- `users` - Usuários do sistema
- `items` - Produtos a trocar
- `matches` - Matches entre usuários
- `messages` - Mensagens de chat
- `likes` - Likes em items
- `categories` - Categorias de items

---

## 🔄 Migrations

**Status**: 10 migrations executadas ✅

```bash
# Ver migrations
npm run migrate:latest

# Rollback
npm run migrate:rollback
```

---

## 🔗 Documentos Relacionados

- [GUIA_MIGRACAO_BACKEND_REAL.md](../../GUIA_MIGRACAO_BACKEND_REAL.md)
- [backend/migrations/](../../backend/migrations/)

---

📚 Próximas atualizações: Documentação completa de schema e queries
