# 🚀 Guia Rápido - Escambo em Docker

## 📍 Localização
```
/Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
```

## 🎯 URLs
- 🏠 **Frontend:** http://localhost:5174
- 🔗 **Backend API:** http://localhost:3000/api
- 🗄️ **MySQL:** localhost:3306

## 👤 Login de Teste
```
Email:  test@example.com
Senha:  Test@123
```

## 🔧 Comandos Essenciais

### Iniciar Tudo
```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
docker compose -p escambo up -d
```

### Ver Status
```bash
docker compose -p escambo ps
```

### Ver Logs
```bash
# Todos os serviços
docker compose -p escambo logs -f

# Apenas frontend
docker compose -p escambo logs -f escambo-web

# Apenas backend
docker compose -p escambo logs -f escambo-api

# Apenas MySQL
docker compose -p escambo logs -f escambo-db
```

### Parar Tudo
```bash
docker compose -p escambo down
```

### Parar e Limpar Volumes
```bash
docker compose -p escambo down -v
```

### Reconstruir (depois de mudanças no código)
```bash
docker compose -p escambo up -d --build
```

### Reiniciar Serviço Específico
```bash
docker compose -p escambo restart escambo-web
docker compose -p escambo restart escambo-api
docker compose -p escambo restart escambo-db
```

## 🧪 Testes Rápidos

### Health Check API
```bash
curl http://localhost:3000/api/health
```

### Testar Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

### Registrar Novo Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Seu Nome",
    "email":"novo@email.com",
    "password":"Senha@123"
  }'
```

## 📝 Estrutura do Projeto

```
EscamboWebApp/
├── docker-compose.yml          # Configuração de containers
├── backend/
│   ├── Dockerfile
│   ├── src/
│   ├── migrations/
│   └── server-simple.js
├── frontend-next/
│   ├── Dockerfile
│   ├── start.sh                # Script de inicialização ⭐
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api.ts          # Configuração Axios
│   │   └── services/
│   │       └── auth.ts
│   └── .env.local
└── .env.docker
```

## ⚙️ Como Funciona a Magia

### O Problema (Antes)
```
Frontend tentava acessar http://backend:3000
Mas "backend" é só um hostname interno do Docker
Browser não conseguia resolver
❌ Network Error
```

### A Solução (Agora)
```
1. docker-compose passa DOCKER_ENV=true
2. start.sh detecta DOCKER_ENV
3. Seta NEXT_PUBLIC_API_URL=http://backend:3000
4. DNS Docker resolve "backend" → escambo-api
5. ✅ Funciona!
```

## 🐛 Troubleshooting

### "Port 5174 already in use"
```bash
# Encontrar processo usando porta
lsof -i :5174

# Ou usar porta diferente
docker compose -p escambo up -d --port 5175:5174
```

### "Connection refused" ao fazer login
```bash
# Verificar se backend está rodando
docker ps

# Ver logs do backend
docker logs escambo-api

# Reiniciar backend
docker compose -p escambo restart escambo-api
```

### "Database doesn't exist"
```bash
# Rodar migrations manualmente
docker exec escambo-api npm run migrate

# Ou reiniciar tudo
docker compose -p escambo down -v && docker compose -p escambo up -d
```

### Erro de Hydration no console
```
Normal se tiver extensão Dark Reader instalada
Não afeta funcionamento da aplicação
Pode ignorar ou desativar a extensão
```

## 📊 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Seu Computador                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Browser: http://localhost:5174                     │   │
│  │                                                     │   │
│  │ JavaScript → http://localhost:3000/api             │   │
│  │ (resolvido via port forward)                       │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                       │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │ Docker Desktop                                      │   │
│  │                                                     │   │
│  │ ┌─────────────────────────────────────────────┐    │   │
│  │ │ Docker Network: escambo-net                 │    │   │
│  │ │                                             │    │   │
│  │ │ escambo-web (5174)                          │    │   │
│  │ │   ↓ http://backend:3000                     │    │   │
│  │ │ escambo-api (3000)                          │    │   │
│  │ │   ↓ mysql host                              │    │   │
│  │ │ escambo-db (3306)                           │    │   │
│  │ │                                             │    │   │
│  │ └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentação Relacionada

- `TODOS_ERROS_RESOLVIDOS.md` - Detalhes de cada erro e solução
- `SOLUCAO_NETWORK_ERROR.md` - Deep dive no problema de Network Error
- `APLICACAO_RODANDO_DOCKER.md` - Setup completo do Docker
- `RESPONSIVIDADE_GUIDE.md` - Guia de design responsivo

## ✅ Checklist de Desenvolvimento

- [x] Frontend rodando em Docker
- [x] Backend rodando em Docker
- [x] MySQL rodando em Docker
- [x] Migrations automáticas
- [x] API conectada ao Frontend
- [x] Login funcionando
- [x] Sem warnings de hydration
- [ ] Testar em múltiplos dispositivos
- [ ] Aplicar responsividade em outras páginas
- [ ] Implementar features adicionais

## 🎓 Lições Aprendidas

1. **Variáveis de Ambiente em Docker**: `NEXT_PUBLIC_*` precisa estar disponível em runtime, não só build time
2. **DNS Interno**: Use nomes de serviço (backend) dentro de Docker, localhost fora
3. **Hydration Mismatch**: Usar `suppressHydrationWarning` para casos onde browser extensions modificam HTML
4. **Scripts de Inicialização**: Úteis para lógica condicional baseada em variáveis de ambiente

---

**Última atualização:** 18 de Março de 2026  
**Status:** ✅ Operacional e Pronto para Deploy
