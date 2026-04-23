# 🐳 ESCAMBO COM DOCKER - GUIA COMPLETO

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║     🐳 ESCAMBO - RODANDO COM DOCKER (MySQL + Backend + Frontend) ║
║                                                                   ║
║               Build e Start de Uma Vez - Bem Simples!            ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 🚀 INICIAR TUDO EM UM COMANDO

### Opção 1: Script Automático (RECOMENDADO)

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
bash docker-build-start.sh
```

✅ Isso vai:
- Fazer **build** das imagens Docker
- **Parar** containers antigos
- **Iniciar** MySQL + Backend + Frontend
- Mostrar **status** de tudo
- URLs para acessar

### Opção 2: Docker Compose Direto

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
docker-compose up -d --build
```

---

## 📱 ACESSAR A APLICAÇÃO

### No Computador
```
http://localhost:5174
```

### No Celular (Mesma WiFi)
```
http://192.168.15.10:5174
```

### Backend (API)
```
http://localhost:3000
```

### MySQL (Banco de Dados)
```
Host: localhost
Port: 3306
User: escambo
Password: escambo123
Database: escambo_dev
```

---

## 📊 MONITORAR CONTAINERS

### Ver Status de Todos

```bash
docker-compose ps
```

**Resultado esperado:**
```
NAME              COMMAND                  STATUS
escambo-db        "docker-entrypoint.s…"   Up 2 minutes
escambo-api       "sh -c 'npm run migr…"   Up 2 minutes
escambo-web       "npm start"              Up 2 minutes
```

### Ver Logs

```bash
# Todos os logs (em tempo real)
docker-compose logs -f

# Só backend
docker-compose logs -f backend

# Só frontend
docker-compose logs -f frontend

# Só MySQL
docker-compose logs -f mysql

# Últimas 20 linhas
docker-compose logs --tail=20
```

---

## 🛑 CONTROLAR CONTAINERS

### Parar Tudo

```bash
docker-compose down
```

### Reiniciar Tudo

```bash
docker-compose restart
```

### Reconstrói Imagens e Inicia

```bash
docker-compose up -d --build
```

---

## 🧹 LIMPEZA

### Remover Containers e Volumes

```bash
docker-compose down -v
```

⚠️ **AVISO:** Isso **apaga o banco de dados!**

### Remover Imagens

```bash
docker rmi escambowebapp-backend escambowebapp-frontend
```

---

## 🔍 VERIFICAR DADOS NO BANCO

### Conectar ao MySQL

```bash
docker-compose exec mysql mysql -u escambo -pescambo123 -D escambo_dev
```

### Ver Tabelas

```bash
SHOW TABLES;
```

### Ver Usuários

```bash
SELECT * FROM users;
```

### Ver Items

```bash
SELECT * FROM items;
```

### Sair

```bash
exit
```

---

## 🐚 SHELL DOS CONTAINERS

### Acessar Backend

```bash
docker-compose exec backend sh
```

### Acessar Frontend

```bash
docker-compose exec frontend sh
```

### Executar Comando no Backend

```bash
docker-compose exec backend npm run migrate
```

---

## ❌ PROBLEMAS COMUNS

### 1. Port Already In Use (Porta 5174 Ocupada)

```bash
# Liberar a porta
lsof -ti:5174 | xargs kill -9

# Ou mudar a porta no docker-compose.yml
# Linha: - '5174:5174'
# Para: - '5175:5174'
```

### 2. Port Already In Use (Porta 3000 Ocupada)

```bash
# Liberar a porta
lsof -ti:3000 | xargs kill -9
```

### 3. Port Already In Use (Porta 3306 Ocupada)

```bash
# Liberar a porta
lsof -ti:3306 | xargs kill -9

# Ou parar MySQL local
brew services stop mysql
```

### 4. Docker Daemon Não Está Rodando

```bash
# Abra o Docker Desktop ou execute:
open /Applications/Docker.app
```

### 5. Backend não Conecta ao MySQL

```bash
# Verificar logs do backend
docker-compose logs backend

# Esperar mais tempo e reiniciar
docker-compose restart backend
```

### 6. Frontend Mostra Erro de Conexão

```bash
# Verificar logs do frontend
docker-compose logs frontend

# Reiniciar
docker-compose restart frontend
```

---

## 📋 ARQUITETURA DOCKER

```
┌────────────────────────────────────────────────────────┐
│                   Docker Compose                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐ │
│  │   MySQL 8    │   │   Backend    │   │ Frontend   │ │
│  │              │   │   Node.js    │   │ Next.js    │ │
│  │ Port: 3306   │   │ Port: 3000   │   │ Port: 5174 │ │
│  │ Container:   │   │ Container:   │   │ Container: │ │
│  │ escambo-db   │   │ escambo-api  │   │escambo-web │ │
│  └──────────────┘   └──────────────┘   └────────────┘ │
│         ▲                   ▲                   ▲       │
│         └───────────────────┴───────────────────┘       │
│            Network: escambo-net (bridge)               │
└────────────────────────────────────────────────────────┘
```

### Comunicação Entre Containers

```
Frontend (localhost:5174)
    ↓
Backend (localhost:3000)
    ↓
MySQL (localhost:3306)
```

---

## ✅ CHECKLIST DE INICIALIZAÇÃO

```
☑️ Docker instalado e rodando
☑️ Docker Compose instalado
☑️ docker-compose.yml existe no projeto
☑️ Dockerfiles existem (backend e frontend)
☑️ Executar: bash docker-build-start.sh
☑️ Aguardar 15 segundos
☑️ Verificar: docker-compose ps
☑️ Abrir: http://localhost:5174
☑️ Testar: Registrar usuário, criar item
☑️ Verificar dados no MySQL
```

---

## 🎯 PRÓXIMAS ETAPAS

### 1. Testar Aplicação
- Registre um usuário
- Crie um item
- Curta um item
- Verifique dados no banco

### 2. Desenvolver
```bash
# Os containers têm volumes compartilhados
# Você edita o código local
# As mudanças aparecem automaticamente

# Frontend (Turbopack watch)
# Backend (Nodemon watch)
```

### 3. Deploy (Futuro)
```bash
# Fazer push para um registry Docker
# Fazer deploy em um servidor com Docker
# ECS, Kubernetes, Heroku, etc.
```

---

## 📞 REFERÊNCIA RÁPIDA

| Comando | O que faz |
|---------|-----------|
| `bash docker-build-start.sh` | Build e inicia tudo |
| `docker-compose up -d --build` | Inicia com build |
| `docker-compose ps` | Ver status |
| `docker-compose logs -f` | Ver logs em tempo real |
| `docker-compose down` | Para tudo |
| `docker-compose restart` | Reinicia tudo |
| `docker-compose exec backend sh` | Shell do backend |
| `docker-compose exec mysql mysql -u escambo -pescambo123` | Conecta ao MySQL |

---

## 🎊 RESULTADO FINAL

✅ **Aplicação Completa em Docker:**
- MySQL rodando em container
- Backend rodando em container
- Frontend rodando em container
- Todos comunicando via network bridge
- Dados persistentes
- Pronto para desenvolvimento
- Pronto para produção

**Agora você tem uma aplicação verdadeira pronta para deploy!** 🚀

---

**Data:** 26 de março de 2026  
**Versão:** Docker Compose v1.0  
**Status:** ✅ PRONTO PARA USO

