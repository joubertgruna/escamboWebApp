# 🗄️ ESCAMBO - SETUP COMPLETO COM MYSQL REAL

## 🎯 Objetivo

Rodar a aplicação com dados **persistentes** no MySQL, não em mock!

---

## 📋 PRÉ-REQUISITOS

### 1. MySQL Instalado

#### Mac (Homebrew)
```bash
# Instalar MySQL
brew install mysql

# Iniciar MySQL
brew services start mysql

# Verificar se está rodando
mysql -u root
```

#### Docker (Alternativa)
```bash
docker run -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=escambo_dev \
  -e MYSQL_USER=escambo \
  -e MYSQL_PASSWORD=escambo123 \
  mysql:8
```

---

## 🔧 CONFIGURAR USUÁRIO MYSQL

### Criar Usuário 'escambo' (se não existir)

```bash
# Conectar ao MySQL como root
mysql -u root

# Criar usuário e banco
CREATE USER 'escambo'@'localhost' IDENTIFIED BY 'escambo123';
GRANT ALL PRIVILEGES ON escambo_dev.* TO 'escambo'@'localhost';
GRANT ALL PRIVILEGES ON escambo_test.* TO 'escambo'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Verificar Conexão

```bash
# Testar conexão
mysql -u escambo -pescambo123 -D escambo_dev

# Se conectar, banco está OK!
# Para sair: EXIT;
```

---

## 🚀 INICIAR APLICAÇÃO COM MYSQL

### 1 Comando

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
bash start-with-mysql.sh
```

### O script vai:

```
✅ Verificar se MySQL está rodando
✅ Criar/Executar migrations (criar tabelas)
✅ Iniciar Backend Real
✅ Iniciar Frontend
✅ Mostrar URLs
```

---

## 📊 VERIFICAR DADOS NO BANCO

### Ver Usuários Criados

```bash
mysql -u escambo -pescambo123 -D escambo_dev
SELECT * FROM users;
```

### Ver Items

```bash
SELECT * FROM items;
```

### Ver Likes

```bash
SELECT * FROM likes;
```

---

## 🧪 TESTAR FLUXO COMPLETO

### 1. Abrir App

```
http://localhost:5174
```

### 2. Registrar Usuário

- Email: `seu@email.com`
- Senha: `123456`
- Nome: Seu Nome

### 3. Verificar no Banco

```bash
mysql -u escambo -pescambo123 -D escambo_dev
SELECT * FROM users WHERE email = 'seu@email.com';
```

### 4. Fazer Login

- Email: `seu@email.com`
- Senha: `123456`

### 5. Criar Items

- Título: "Meu Item"
- Descrição: "Descrição"
- Categoria: Electronics

### 6. Verificar Items

```bash
SELECT * FROM items WHERE user_id = 1;
```

---

## ⚙️ ARQUIVO DE CONFIGURAÇÃO

Arquivo: `.env` (backend)

```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=escambo
DB_PASSWORD=escambo123
DB_NAME=escambo_dev
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Can't connect to MySQL"

```bash
# Verificar se MySQL está rodando
brew services list

# Se não estiver:
brew services start mysql

# Aguardar 5 segundos e tentar de novo
sleep 5
bash start-with-mysql.sh
```

### Erro: "Unknown database 'escambo_dev'"

```bash
# Criar banco manualmente
mysql -u root
CREATE DATABASE escambo_dev;
EXIT;

# Tentar script de novo
bash start-with-mysql.sh
```

### Erro: "Access denied for user 'escambo'"

```bash
# Usuário não existe, criar:
mysql -u root
CREATE USER 'escambo'@'localhost' IDENTIFIED BY 'escambo123';
GRANT ALL PRIVILEGES ON escambo_dev.* TO 'escambo'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Tentar script de novo
bash start-with-mysql.sh
```

### Backend Não Inicia

```bash
# Ver log de erro
cat /tmp/escambo-backend.log

# Verificar migrations
cd backend
npm run migrate

# Tentar iniciar manualmente
npm run dev
```

---

## 📁 ESTRUTURA DO BANCO

### Tabelas Criadas (automaticamente)

```
users
├── id (PK)
├── name
├── email (UNIQUE)
├── phone
├── password_hash
├── avatar_url
├── bio
├── city
├── state
├── created_at
└── updated_at

items
├── id (PK)
├── user_id (FK)
├── title
├── description
├── category
├── condition
├── photos (JSON)
├── created_at
└── updated_at

likes
├── id (PK)
├── user_id (FK)
├── item_id (FK)
├── created_at
└── updated_at

matches
├── id (PK)
├── user_id (FK)
├── item_id (FK)
├── match_item_id (FK)
├── status
├── created_at
└── updated_at

messages
├── id (PK)
├── match_id (FK)
├── sender_id (FK)
├── text
├── created_at
└── updated_at

notifications
├── id (PK)
├── user_id (FK)
├── type
├── title
├── message
├── read
├── created_at
└── updated_at
```

---

## 🔄 FLUXO DE DADOS

```
Frontend (localhost:5174)
    ↓
  Axios API Call
    ↓
Backend (localhost:3000)
    ↓
  Auth Middleware
    ↓
  Business Logic
    ↓
  Knex Query
    ↓
MySQL Database
    ↓
  Response JSON
    ↓
Frontend Store (Zustand)
    ↓
  UI Update
```

---

## 💾 DADOS PERSISTENTES

✅ Todos os dados salvos no MySQL são **permanentes**
✅ Recarregar página = dados continuam
✅ Desligar app = dados permanecem
✅ Backup fácil (mysqldump)

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Instalar MySQL
2. ✅ Criar usuário 'escambo'
3. ✅ Executar: `bash start-with-mysql.sh`
4. ✅ Testar em http://localhost:5174
5. ✅ Criar usuários e items
6. ✅ Verificar dados no banco

---

## 📞 SUPORTE

| Problema | Solução |
|----------|---------|
| MySQL não encontrado | `brew install mysql` |
| MySQL não rodando | `brew services start mysql` |
| Usuário não existe | Criar com comandos SQL acima |
| Banco não existe | `CREATE DATABASE escambo_dev;` |
| Erro 500 no login | Ver `/tmp/escambo-backend.log` |
| Dados não salvam | Verificar conexão com MySQL |

---

## ✅ CHECKLIST

```
☑️ MySQL instalado
☑️ MySQL rodando
☑️ Usuário 'escambo' criado
☑️ Banco 'escambo_dev' existe
☑️ Script start-with-mysql.sh executável
☑️ Backend iniciando
☑️ Frontend iniciando
☑️ Login funcionando
☑️ Items salvando no banco
☑️ Dados persistindo
```

---

**Data:** 26 de março de 2026  
**Status:** 🟢 PRONTO PARA DADOS REAIS  
**Banco:** MySQL 8.0+

Bora rodar com dados reais! 🚀
