#!/usr/bin/env node

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockItems = [
  {
    id: 1,
    title: 'PS5 Controle',
    description: 'Controle original do PS5, em perfeito estado',
    category: 'electronics',
    condition: 'like-new',
    photos: ['https://via.placeholder.com/300x300?text=PS5+Controller'],
    userId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Livro Clean Code',
    description: 'Livro Clean Code - Robert Martin',
    category: 'books',
    condition: 'good',
    photos: ['https://via.placeholder.com/300x300?text=Clean+Code'],
    userId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Fone Bluetooth',
    description: 'Fone Bluetooth com cancelamento de ruído',
    category: 'electronics',
    condition: 'excellent',
    photos: ['https://via.placeholder.com/300x300?text=Bluetooth+Headphone'],
    userId: 2,
    createdAt: new Date().toISOString(),
  },
];

const mockUser = {
  id: 1,
  email: 'teste@escambo.com',
  name: 'Usuário Teste',
  avatar: 'https://via.placeholder.com/100x100?text=Avatar',
  bio: 'Usuário de teste da plataforma',
  likes: 5,
  matches: 2,
  city: 'São Paulo',
  state: 'SP',
};

const mockLikes = [
  { id: 1, userId: 1, itemId: 3, createdAt: new Date().toISOString() },
  { id: 2, userId: 1, itemId: 2, createdAt: new Date().toISOString() },
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Mock API funcionando' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Mock API funcionando' });
});

// Auth endpoints - com /api
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  res.json({
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: mockUser,
    },
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  res.status(201).json({
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: { ...mockUser, id: Math.floor(Math.random() * 10000), name, email },
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ data: mockUser });
});

// Items endpoints - com /api
app.get('/api/items/feed', (req, res) => {
  res.json({ data: mockItems });
});

app.get('/api/items', (req, res) => {
  res.json({ data: mockItems });
});

app.get('/api/items/my', (req, res) => {
  res.json({ data: mockItems.filter(i => i.userId === mockUser.id) });
});

app.get('/api/items/:id', (req, res) => {
  const item = mockItems.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ data: item });
});

app.post('/api/items', (req, res) => {
  const newItem = {
    id: Math.floor(Math.random() * 10000),
    ...req.body,
    userId: mockUser.id,
    photos: req.body.photos || ['https://via.placeholder.com/300x300?text=Item'],
    createdAt: new Date().toISOString(),
  };
  mockItems.push(newItem);
  res.status(201).json({ data: newItem });
});

app.put('/api/items/:id', (req, res) => {
  const item = mockItems.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const updated = { ...item, ...req.body };
  const index = mockItems.indexOf(item);
  mockItems[index] = updated;
  res.json({ data: updated });
});

app.delete('/api/items/:id', (req, res) => {
  const index = mockItems.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  mockItems.splice(index, 1);
  res.json({ data: { success: true } });
});

// Likes endpoints - com /api
app.get('/api/likes/my', (req, res) => {
  res.json({ data: mockLikes });
});

app.post('/api/likes', (req, res) => {
  const newLike = {
    id: Math.floor(Math.random() * 10000),
    userId: mockUser.id,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  mockLikes.push(newLike);
  res.status(201).json({ data: newLike });
});

app.delete('/api/likes/:id', (req, res) => {
  const index = mockLikes.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Like not found' });
  }
  mockLikes.splice(index, 1);
  res.json({ data: { success: true } });
});

// Matches endpoints - com /api
app.get('/api/matches', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        userId: 2,
        itemId: 1,
        matchItemId: 5,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

app.post('/api/matches', (req, res) => {
  res.status(201).json({
    data: {
      id: Math.floor(Math.random() * 10000),
      ...req.body,
      createdAt: new Date().toISOString(),
    },
  });
});

// Messages endpoints - com /api
app.get('/api/messages/:matchId', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        matchId: req.params.matchId,
        senderId: mockUser.id,
        text: 'Oi, tudo bem com esse item?',
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

app.post('/api/messages', (req, res) => {
  res.status(201).json({
    data: {
      id: Math.floor(Math.random() * 10000),
      ...req.body,
      createdAt: new Date().toISOString(),
    },
  });
});

// User endpoints - com /api
app.get('/api/users/profile', (req, res) => {
  res.json({ data: mockUser });
});

app.put('/api/users/profile', (req, res) => {
  const updated = { ...mockUser, ...req.body };
  res.json({ data: updated });
});

// Notifications endpoints - com /api
app.get('/api/notifications', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        type: 'match',
        title: 'Nova correspondência!',
        message: 'Usuário João quer trocar itens com você',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Backend Mock API rodando na porta ${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📝 Modo: MOCK (sem banco de dados)`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`� API Base: http://localhost:${PORT}`);
  console.log('');
  console.log('Endpoints disponíveis:');
  console.log('  POST   /auth/login');
  console.log('  POST   /auth/register');
  console.log('  GET    /items/feed');
  console.log('  GET    /items/my');
  console.log('  GET    /likes/my');
  console.log('  GET    /users/profile');
  console.log('');
});
