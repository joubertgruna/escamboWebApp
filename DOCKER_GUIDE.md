# 🐳 ESCAMBO - Guia Completo Docker

## Visão Geral

A aplicação Escambo foi configurada para rodar completamente em **Docker**, com:
- **Frontend**: Next.js (porta 5174)
- **Backend**: Node.js + Express (porta 3000)
- **Database**: MySQL 8.0 (porta 3306)
- **Network**: Rede Docker isolada (`escambo-network`)

---

## 📋 Pré-requisitos

1. **Docker** instalado ([Download](https://www.docker.com/products/docker-desktop))
2. **Docker Compose** instalado (geralmente vem com Docker Desktop)
3. Portas 5174, 3000 e 3306 disponíveis

### Verificar instalação:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Como Começar

### Opção 1: Usando o Script (Recomendado)

```bash
# Tornar o script executável
chmod +x docker-start.sh

# Executar o script
./docker-start.sh

# Escolher opção 1 (start)
```

### Opção 2: Comandos Diretos

```bash
# Iniciar aplicação
docker-compose up -d

# Aguardar 30 segundos para inicialização
sleep 30

# Acessar a aplicação
# Frontend: http://localhost:5174
# Backend: http://localhost:3000
```

---

## 📱 URLs de Acesso

| Serviço | URL | Função |
|---------|-----|--------|
| **Frontend** | http://localhost:5174 | App principal (Next.js) |
| **Backend** | http://localhost:3000 | API REST |
| **MySQL** | localhost:3306 | Database |

### Credenciais MySQL (Development)
```
Usuário: escambo
Senha: escambo123
Database: escambo_dev
Host: localhost
Port: 3306
```

---

## 🛠️ Comandos Úteis

### Iniciar/Parar

```bash
# Iniciar todos os containers
docker-compose up -d

# Parar todos os containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reiniciar containers
docker-compose restart
```

### Logs

```bash
# Ver logs de todos os containers (tempo real)
docker-compose logs -f

# Ver logs do frontend apenas
docker-compose logs -f frontend

# Ver logs do backend apenas
docker-compose logs -f backend

# Ver logs do MySQL apenas
docker-compose logs -f mysql

# Últimas 100 linhas
docker-compose logs --tail=100
```

### Status

```bash
# Ver status dos containers
docker-compose ps

# Listar imagens
docker images

# Listar containers (rodando)
docker ps

# Listar containers (todos)
docker ps -a
```

### Acessar Containers

```bash
# Shell do backend
docker-compose exec backend sh

# Shell do frontend
docker-compose exec frontend sh

# Shell do MySQL
docker-compose exec mysql bash

# Executar comando no backend
docker-compose exec backend npm test

# Executar npm install no frontend
docker-compose exec frontend npm install
```

### Build

```bash
# Reconstruir imagens
docker-compose build

# Reconstruir sem cache
docker-compose build --no-cache

# Rebuild e reiniciar
docker-compose up -d --build
```

---

## 📊 Fluxo de Inicialização

```
1. Docker Compose inicia os containers
   ↓
2. MySQL inicia e aguarda estar pronto (healthcheck)
   ↓
3. Backend inicia após MySQL estar saudável
   - Conecta ao MySQL
   - Executa migrações automáticas
   - Inicia servidor na porta 3000
   ↓
4. Frontend inicia após Backend estar pronto
   - Conecta ao Backend via NEXT_PUBLIC_API_URL
   - Inicia dev server na porta 5174
   ↓
5. Aplicação pronta para uso!
```

---

## 🔍 Troubleshooting

### Problema: Porta 5174 já em uso

```bash
# Encontrar processo usando porta 5174
lsof -i :5174

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
docker-compose up -d -e FRONTEND_PORT=5175
```

### Problema: Porta 3000 já em uso

```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### Problema: Erro de conexão MySQL

```bash
# Reiniciar MySQL
docker-compose restart mysql

# Ou reconstruir tudo
docker-compose down -v
docker-compose up -d --build
```

### Problema: Frontend não conecta ao Backend

```bash
# Verificar logs
docker-compose logs -f frontend

# Verificar se backend está rodando
docker-compose ps

# Verificar conectividade
docker-compose exec frontend wget http://backend:3000/health
```

### Problema: Volumes não atualizando

```bash
# Remover volumes
docker volume prune

# Reconstruir
docker-compose down -v
docker-compose up -d --build
```

---

## 📁 Estrutura de Arquivos

```
EscamboWebApp/
├── docker-compose.yml          # Configuração do Docker Compose
├── docker-start.sh             # Script de inicialização
├── backend/
│   ├── Dockerfile              # Dockerfile do backend
│   ├── package.json
│   ├── src/
│   └── ...
├── frontend-next/
│   ├── Dockerfile              # Dockerfile do frontend
│   ├── package.json
│   ├── src/
│   └── ...
└── ...
```

---

## 🔒 Segurança (Development vs Production)

### Development (atual)
- Hot reload habilitado
- Volumes compartilhados
- Credenciais em variáveis
- JWT_SECRET simples

### Para Production
```bash
# 1. Criar arquivo .env.production
DB_PASSWORD=senha-forte-aleatoria
JWT_SECRET=jwt-secret-muititoforte

# 2. Usar docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d

# 3. Usar imagens multi-stage otimizadas
# Verificar Dockerfile.prod nos respectivos diretórios
```

---

## 📈 Performance

### Otimizações aplicadas:
- ✅ Healthchecks para verificar readiness
- ✅ `depends_on` com condition (aguarda saúde)
- ✅ Volumes nomeados para cache
- ✅ Multi-stage builds possíveis
- ✅ Alpine images (base leve)
- ✅ Node 20 (LTS)

### Monitorar uso de recursos:

```bash
# Ver uso de CPU/Memória em tempo real
docker stats

# Ver uso de disco de volumes
docker volume inspect escambowebapp_mysql_data
```

---

## 🚨 Verificação de Saúde

Todos os containers possuem healthchecks:

```bash
# Verificar status de saúde
docker-compose ps

# Status esperado:
# mysql      -> healthy
# backend    -> healthy
# frontend   -> healthy
```

Se algum mostrar `unhealthy`:
```bash
# Ver logs detalhados
docker-compose logs <service_name>

# Reiniciar container específico
docker-compose restart <service_name>
```

---

## 🔄 Ciclo de Desenvolvimento

### Após fazer alterações no código:

```bash
# Alterações em arquivos (hot reload automático)
- Código no backend: reinicia automaticamente
- Código no frontend: hot reload automático
- Dependências: precisa rebuild

# Adicionar nova dependência no backend
docker-compose exec backend npm install package-name
docker-compose down
docker-compose up -d --build

# Mesmo para frontend
docker-compose exec frontend npm install package-name
docker-compose down
docker-compose up -d --build
```

---

## 📊 Monitoramento

### Verificar health dos containers:

```bash
# Listar containers com status
docker-compose ps

# Logs em tempo real (all)
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

## 🎯 Roadmap - Próximas Melhorias

- [ ] Dockerfile.prod para build otimizado
- [ ] docker-compose.prod.yml com SSL
- [ ] Nginx reverse proxy
- [ ] Redis para cache/sessions
- [ ] Backup automático MySQL
- [ ] Monitoramento com Prometheus
- [ ] Logs centralizados com ELK

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Verifique portas: `lsof -i :5174` / `lsof -i :3000`
3. Reinicie tudo: `docker-compose restart`
4. Reconstrua: `docker-compose up -d --build`
5. Clean: `docker-compose down -v && docker-compose up -d --build`

---

## ✅ Checklist de Inicialização

- [ ] Docker Desktop aberto
- [ ] Portas 5174, 3000, 3306 livres
- [ ] Executar `docker-compose up -d`
- [ ] Aguardar 30 segundos
- [ ] Verificar `docker-compose ps` (todos healthy)
- [ ] Acessar http://localhost:5174
- [ ] Testar backend em http://localhost:3000/health

---

**Status**: ✅ Pronto para desenvolvimento em Docker!
