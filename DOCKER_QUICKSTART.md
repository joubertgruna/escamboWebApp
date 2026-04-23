# 🐳 ESCAMBO - Quick Start Docker

## ⚡ Opção 1: Mais Rápido (Apenas 3 linhas)

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
docker-compose up -d
# Aguardar 30 segundos... pronto!
```

**Acessar em:**
- 🌐 Frontend: http://localhost:5174
- 🔌 Backend: http://localhost:3000
- 🗄️ MySQL: localhost:3306

---

## ⚡ Opção 2: Usando Makefile (Recomendado)

```bash
# Ver todos os comandos
make

# Iniciar
make start

# Ver logs
make logs

# Parar
make stop
```

---

## ⚡ Opção 3: Usando Script Interativo

```bash
chmod +x docker-start.sh
./docker-start.sh
# Escolher opção 1 (start)
```

---

## 📱 Verificar Status

```bash
# Ver se está rodando
docker-compose ps

# Deve mostrar:
# mysql      | running | (healthy)
# backend    | running | (healthy)
# frontend   | running | (healthy)
```

---

## 🛑 Parar Aplicação

```bash
docker-compose down
```

---

## 📊 Ver Logs em Tempo Real

```bash
# Todos os logs
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

---

## 🔄 Reiniciar

```bash
docker-compose restart
```

---

## 🧹 Limpar Tudo

```bash
docker-compose down -v
```

---

## 🆘 Problemas?

**Porta em uso:**
```bash
lsof -i :5174  # Frontend
lsof -i :3000  # Backend
lsof -i :3306  # MySQL
```

**Rebuild tudo:**
```bash
docker-compose down -v
docker-compose up -d --build
```

---

**Pronto para usar! 🎉**
