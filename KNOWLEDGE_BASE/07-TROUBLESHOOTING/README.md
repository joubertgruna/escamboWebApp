# 🔧 TROUBLESHOOTING - Knowledge Base

**Categoria**: Problemas Comuns e Soluções  
**Status**: 🔄 Em Progresso  
**Última Atualização**: 17 de Março de 2026

---

## 📋 Documentos Nesta Pasta

| Documento | Descrição | Status |
|-----------|-----------|--------|
| `ERROS_COMUNS.md` | Problemas mais frequentes | 📝 Rascunho |
| `DEBUG.md` | Técnicas de debug | 📝 Rascunho |
| `PERFORMANCE.md` | Otimização | 📝 Rascunho |
| `LOGS.md` | Como ler logs | 📝 Rascunho |

---

## 🆘 Problemas Rápidos

### Erro 404 em endpoints
**Solução**: Verifique se backend está rodando
```bash
bash TEST_SUITE.sh
```

### Frontend não conecta ao backend
**Solução**: Verifique CORS e porto
```bash
curl http://localhost:3000/api/health
```

### Testes falhando
**Solução**: Reset de dados
```bash
pkill -f "node backend-simple.js"
node backend-simple.js
bash TEST_SUITE.sh
```

### Banco de dados não conecta
**Solução**: Verifique MySQL
```bash
mysql -u escambo -p escambo_dev
SHOW TABLES;
```

---

## 🔍 Debug Tips

1. Use `console.log` para rastrear valores
2. Inspecione Network Tab no DevTools
3. Verifique logs em `/tmp/backend.log`
4. Execute testes para validar

---

## 🔗 Documentos Relacionados

- [TESTES_QUICK_REFERENCE.md](../../TESTES_QUICK_REFERENCE.md)
- [STATUS.md](../../STATUS.md)

---

🔧 Próximas atualizações: Soluções mais específicas
