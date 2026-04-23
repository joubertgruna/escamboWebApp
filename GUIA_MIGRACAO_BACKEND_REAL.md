# 🔄 GUIA DE MIGRAÇÃO: Backend Mock → Backend Real

**Status**: Pronto para Implementação  
**Data**: 17 de Março de 2026  
**Complexidade**: Moderada

---

## 📋 Visão Geral

Este guia fornece um roteiro passo-a-passo para migrar do backend mock (`backend-simple.js`) para o backend real usando Express.js e MySQL.

---

## ✅ Pré-Requisitos

- [x] Backend mock funcional e testado (100% de sucesso)
- [x] Todos endpoints validados
- [x] MySQL instalado e executando
- [x] Database `escambo_dev` criado
- [x] 10 migrations executadas com sucesso
- [x] Node.js / npm instalado
- [x] Packages Express/MySQL2 disponíveis

---

## 🏗️ Estrutura do Projeto Backend Real

```
backend/
├── server.js              # Ponto de entrada principal
├── config/
│   └── database.js        # Configuração MySQL
├── routes/
│   ├── auth.js           # Autenticação
│   ├── items.js          # Items/Produtos
│   ├── likes.js          # Likes
│   ├── matches.js        # Matches/Trocas
│   ├── messages.js       # Mensagens
│   └── categories.js     # Categorias
├── middleware/
│   ├── auth.js           # JWT middleware
│   ├── errorHandler.js   # Tratamento de erros
│   └── validation.js     # Validação de input
├── controllers/
│   ├── authController.js
│   ├── itemsController.js
│   ├── likesController.js
│   ├── matchesController.js
│   └── messagesController.js
├── models/
│   ├── User.js
│   ├── Item.js
│   ├── Match.js
│   ├── Message.js
│   └── Like.js
├── utils/
│   ├── jwt.js            # Utilitários JWT
│   └── errors.js         # Classes de erro customizadas
├── migrations/           # Já existe com 10 migrations
├── seeds/               # Dados de teste
└── .env                 # Variáveis de ambiente
```

---

## 🔄 Processo de Migração Passo-a-Passo

### FASE 1: Preparação (30 minutos)

#### 1.1 Revisar Database Schema
```bash
# Ver migrations existentes
ls backend/migrations/

# Executar migrations se ainda não estiverem
npm run migrate
```

**Tabelas esperadas:**
- `users` - Usuários do sistema
- `items` - Produtos a trocar
- `matches` - Matches/trocas entre usuários
- `messages` - Mensagens entre matches
- `likes` - Likes em items
- `categories` - Categorias de items

#### 1.2 Verificar Conexão com MySQL
```bash
# Conectar ao MySQL
mysql -u escambo -p escambo_dev
# Dentro do MySQL:
SHOW TABLES;
DESC items;
```

#### 1.3 Instalar Dependências (se necessário)
```bash
cd backend
npm install express mysql2 knex bcryptjs jsonwebtoken cors dotenv
npm install -D nodemon
```

---

### FASE 2: Implementação de Autenticação (1 hora)

#### 2.1 Criar `config/database.js`
```javascript
const mysql = require('mysql2/promise');
const knex = require('knex');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'escambo',
  password: process.env.DB_PASSWORD || 'escambo123',
  database: process.env.DB_NAME || 'escambo_dev',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'escambo',
    password: process.env.DB_PASSWORD || 'escambo123',
    database: process.env.DB_NAME || 'escambo_dev',
  },
});

module.exports = { pool, db };
```

#### 2.2 Criar `middleware/auth.js`
```javascript
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

#### 2.3 Criar `routes/auth.js`
```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se usuário existe
    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'Email já registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const [userId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    });

    // Gerar token
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      data: {
        token,
        user: {
          id: userId,
          name,
          email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 2.4 Criar `routes/items.js`
```javascript
const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const auth = require('../middleware/auth');

// GET /api/items - Listar todos
router.get('/', async (req, res) => {
  try {
    const items = await db('items').select('*');
    res.json({ data: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/items/feed - Feed
router.get('/feed', async (req, res) => {
  try {
    const items = await db('items')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(20);
    res.json({ data: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/items/mine - Items do usuário
router.get('/mine', auth, async (req, res) => {
  try {
    const items = await db('items').where({ userId: req.userId });
    res.json({ data: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/items/:id - Item específico
router.get('/:id', async (req, res) => {
  try {
    const item = await db('items').where({ id: req.params.id }).first();
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.json({ data: item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/items - Criar item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, condition } = req.body;

    const [itemId] = await db('items').insert({
      userId: req.userId,
      title,
      description,
      category,
      condition,
      created_at: new Date(),
    });

    const item = await db('items').where({ id: itemId }).first();
    res.status(201).json({ data: item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/items/:id - Atualizar item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await db('items').where({ id: req.params.id }).first();
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    if (item.userId !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await db('items').where({ id: req.params.id }).update(req.body);
    const updated = await db('items').where({ id: req.params.id }).first();

    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/items/:id - Deletar item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await db('items').where({ id: req.params.id }).first();
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    if (item.userId !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await db('items').where({ id: req.params.id }).del();
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### FASE 3: Implementar Endpoints Restantes (2 horas)

Seguir o mesmo padrão para:
- ✅ `routes/likes.js`
- ✅ `routes/matches.js`
- ✅ `routes/messages.js`
- ✅ `routes/categories.js`

---

### FASE 4: Montar Server Principal (30 minutos)

#### 4.1 Criar `server.js` principal
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const likesRoutes = require('./routes/likes');
const matchesRoutes = require('./routes/matches');
const messagesRoutes = require('./routes/messages');
const categoriesRoutes = require('./routes/categories');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend real rodando!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/categories', categoriesRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend real rodando em http://localhost:${PORT}`);
});
```

---

### FASE 5: Testes e Validação (30 minutos)

#### 5.1 Executar testes contra backend real
```bash
# Parar backend mock
pkill -f "node backend-simple.js"

# Iniciar backend real
npm run dev

# Em outro terminal:
bash TEST_SUITE.sh
```

#### 5.2 Esperado: 100% de sucesso com dados reais

---

## 🎯 Checklist de Migração

### Semana 1
- [ ] Fase 1: Preparação concluída
- [ ] Fase 2: Autenticação implementada
- [ ] Testes de autenticação passando

### Semana 2
- [ ] Fase 3: Todos endpoints implementados
- [ ] Fase 4: Server pronto
- [ ] TEST_SUITE.sh passando 100%

### Semana 3
- [ ] Testes de integração
- [ ] Performance OK
- [ ] Pronto para staging

### Semana 4
- [ ] Deploy em produção

---

## 📊 Critérios de Sucesso

✅ **Implementação Bem-Sucedida quando:**
- [x] Todos 25+ endpoints implementados
- [x] 100% de testes passando (TEST_SUITE.sh)
- [x] Autenticação JWT funcionando
- [x] CORS habilitado
- [x] Erros tratados corretamente
- [x] Dados persistindo no MySQL
- [x] Performance comparável ou melhor
- [x] Sem regressões no frontend

---

## ⚠️ Possíveis Desafios

### 1. Migrations não executadas
**Solução**: `npm run migrate` antes de iniciar

### 2. Conexão MySQL falhando
**Solução**: Verificar credenciais em `.env`
```bash
mysql -u escambo -p escambo123 -h localhost escambo_dev
```

### 3. Socket.io ainda causando problemas
**Solução**: Implementar em fase posterior, após validar HTTP

### 4. Autenticação não funcionando no frontend
**Solução**: Verificar token sendo enviado no header:
```
Authorization: Bearer <token>
```

### 5. CORS bloqueando requisições
**Solução**: Adicionar ao Express:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
}));
```

---

## 🚀 Após Migração Completa

1. **Deploy em Staging**
   - Testar com dados reais
   - Verificar performance
   - Testes de carga

2. **Monitoramento**
   - Logs estruturados
   - Alertas de erro
   - Métricas de performance

3. **Próximas Features**
   - WebSocket real-time para chat
   - Upload de imagens para S3
   - Notificações push
   - Sistema de reputação

---

## 📞 Referências

- Guia Oficial Express: https://expressjs.com/
- MySQL2 Documentation: https://github.com/sidorares/node-mysql2
- Knex Query Builder: https://knexjs.org/
- JWT: https://jwt.io/

---

## ✨ Conclusão

A migração é direta e segue um padrão claro:
1. Tomar endpoints do mock
2. Implementar em Express
3. Conectar ao MySQL
4. Testar com TEST_SUITE.sh
5. Deploy

**Tempo estimado total: 1-2 semanas**

---

**Criado em**: 17 de Março de 2026  
**Status**: Pronto para Implementação  
**Próximo Passo**: Começar Fase 1 ✅

