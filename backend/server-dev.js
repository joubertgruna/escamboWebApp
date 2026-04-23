#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Escambo API is running' });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  res.json({
    data: {
      user: { id: 1, email, name, avatar: '' },
      token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    data: {
      user: { id: 1, email, name: 'Test User', avatar: '' },
      token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    data: {
      user: { id: 1, email: 'test@test.com', name: 'Test User', avatar: '' },
    },
  });
});

// Mock items endpoints
app.get('/api/items', (req, res) => {
  res.json({
    data: [
      { id: 1, title: 'Item 1', description: 'Test item', likes: 5, photos: [] },
      { id: 2, title: 'Item 2', description: 'Another item', likes: 3, photos: [] },
    ],
  });
});

app.post('/api/items', (req, res) => {
  res.json({ data: { id: 3, ...req.body } });
});

// Mock likes
app.get('/api/likes/my', (req, res) => {
  res.json({ data: [] });
});

app.post('/api/likes/:itemId', (req, res) => {
  res.json({ data: { itemId: req.params.itemId, liked: true } });
});

// Mock matches
app.get('/api/matches', (req, res) => {
  res.json({ data: [] });
});

app.post('/api/matches', (req, res) => {
  res.json({ data: { id: 1, status: 'pending' } });
});

// Mock messages
app.get('/api/messages/:matchId', (req, res) => {
  res.json({ data: [] });
});

app.post('/api/messages', (req, res) => {
  res.json({ data: { id: 1, ...req.body } });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ ESCAMBO API RUNNING ON PORT ${PORT}\n`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

module.exports = server;
