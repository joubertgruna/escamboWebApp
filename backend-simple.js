const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Mock data
let mockItems = [
  {
    id: 1,
    title: 'PS5 Controle',
    description: 'Controle original do PS5',
    category: 'electronics',
    condition: 'like-new',
    photos: [],
    userId: 1,
  },
  {
    id: 2,
    title: 'Livro Clean Code',
    description: 'Livro Clean Code - Robert Martin',
    category: 'books',
    condition: 'good',
    photos: [],
    userId: 1,
  },
];

// Store original items for resetting
const originalMockItems = JSON.parse(JSON.stringify(mockItems));

let mockMatches = [
  {
    id: 1,
    userId: 2,
    itemId: 1,
    matchItemId: 5,
    status: 'pending',
  },
];

let mockMessages = [
  {
    id: 1,
    matchId: 1,
    senderId: 2,
    text: 'Oi, tudo bem com esse controle?',
    createdAt: new Date().toISOString(),
  },
];

const mockCategories = [
  { id: 1, name: 'electronics', label: 'Eletrônicos' },
  { id: 2, name: 'books', label: 'Livros' },
  { id: 3, name: 'furniture', label: 'Móveis' },
  { id: 4, name: 'sports', label: 'Esportes' },
  { id: 5, name: 'toys', label: 'Brinquedos' },
  { id: 6, name: 'clothing', label: 'Roupas' },
];

const mockUser = {
  id: 1,
  name: 'Usuário Teste',
  email: 'teste@escambo.com',
  avatar: null,
  stats: {
    likes: 5,
    matches: 2,
    items: 2,
  },
};

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Health check
    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', message: 'Backend rodando!' }));
      return;
    }

    // Reset data (for testing purposes)
    if (pathname === '/api/reset' && method === 'POST') {
      mockItems = JSON.parse(JSON.stringify(originalMockItems));
      res.writeHead(200);
      res.end(JSON.stringify({ data: { success: true, message: 'Data reset successful' } }));
      return;
    }

    // ==================== AUTH ENDPOINTS ====================
    if (pathname === '/api/auth/login' && method === 'POST') {
      res.writeHead(200);
      res.end(JSON.stringify({
        data: {
          token: 'mock-token-' + Date.now(),
          user: mockUser,
        },
      }));
      return;
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      res.writeHead(201);
      res.end(JSON.stringify({
        data: {
          token: 'mock-token-' + Date.now(),
          user: mockUser,
        },
      }));
      return;
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: mockUser }));
      return;
    }

    if (pathname === '/api/auth/profile' && method === 'PUT') {
      const body = await parseBody(req);
      const updated = { ...mockUser, ...body };
      res.writeHead(200);
      res.end(JSON.stringify({ data: updated }));
      return;
    }

    if (pathname === '/api/auth/avatar' && method === 'POST') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: { avatar: 'https://via.placeholder.com/150' } }));
      return;
    }

    // ==================== ITEMS ENDPOINTS ====================
    if (pathname === '/api/items' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: mockItems }));
      return;
    }

    if (pathname === '/api/items/feed' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: mockItems }));
      return;
    }

    if (pathname === '/api/items/mine' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: mockItems }));
      return;
    }

    // GET /api/items/:id
    const itemMatch = pathname.match(/^\/api\/items\/([^/]+)$/);
    if (itemMatch && method === 'GET') {
      const id = parseInt(itemMatch[1]);
      const item = mockItems.find((i) => i.id === id);
      if (!item) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Item not found' }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify({ data: item }));
      return;
    }

    // POST /api/items
    if (pathname === '/api/items' && method === 'POST') {
      const body = await parseBody(req);
      const newItem = {
        id: Math.max(...mockItems.map((i) => i.id), 0) + 1,
        ...body,
        userId: mockUser.id,
      };
      mockItems.push(newItem);
      res.writeHead(201);
      res.end(JSON.stringify({ data: newItem }));
      return;
    }

    // PUT /api/items/:id
    if (itemMatch && method === 'PUT') {
      const id = parseInt(itemMatch[1]);
      const body = await parseBody(req);
      const itemIndex = mockItems.findIndex((i) => i.id === id);
      if (itemIndex === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Item not found' }));
        return;
      }
      const updated = { ...mockItems[itemIndex], ...body };
      mockItems[itemIndex] = updated;
      res.writeHead(200);
      res.end(JSON.stringify({ data: updated }));
      return;
    }

    // DELETE /api/items/:id
    if (itemMatch && method === 'DELETE') {
      const id = parseInt(itemMatch[1]);
      const itemIndex = mockItems.findIndex((i) => i.id === id);
      if (itemIndex === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Item not found' }));
        return;
      }
      mockItems.splice(itemIndex, 1);
      res.writeHead(200);
      res.end(JSON.stringify({ data: { success: true } }));
      return;
    }

    // POST /api/items/:id/photos
    const photoMatch = pathname.match(/^\/api\/items\/(\d+)\/photos$/);
    if (photoMatch && method === 'POST') {
      res.writeHead(201);
      res.end(JSON.stringify({ data: { id: 1, url: 'https://via.placeholder.com/300' } }));
      return;
    }

    // DELETE /api/items/:itemId/photos/:photoId
    const deletePhotoMatch = pathname.match(/^\/api\/items\/(\d+)\/photos\/(\d+)$/);
    if (deletePhotoMatch && method === 'DELETE') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: { success: true } }));
      return;
    }

    // ==================== MATCHES ENDPOINTS ====================
    if (pathname === '/api/matches' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: mockMatches }));
      return;
    }

    // GET /api/matches/:id
    const matchMatch = pathname.match(/^\/api\/matches\/([^/]+)$/);
    if (matchMatch && method === 'GET') {
      const id = parseInt(matchMatch[1]);
      const match = mockMatches.find((m) => m.id === id);
      if (!match) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Match not found' }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify({ data: match }));
      return;
    }

    if (pathname === '/api/matches' && method === 'POST') {
      const body = await parseBody(req);
      const newMatch = {
        id: Math.max(...mockMatches.map((m) => m.id), 0) + 1,
        ...body,
      };
      mockMatches.push(newMatch);
      res.writeHead(201);
      res.end(JSON.stringify({ data: newMatch }));
      return;
    }

    // PUT /api/matches/:id
    if (matchMatch && method === 'PUT') {
      const id = parseInt(matchMatch[1]);
      const body = await parseBody(req);
      const matchIndex = mockMatches.findIndex((m) => m.id === id);
      if (matchIndex === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Match not found' }));
        return;
      }
      const updated = { ...mockMatches[matchIndex], ...body };
      mockMatches[matchIndex] = updated;
      res.writeHead(200);
      res.end(JSON.stringify({ data: updated }));
      return;
    }

    // ==================== MESSAGES ENDPOINTS ====================
    // GET /api/matches/:matchId/messages
    const messagesMatch = pathname.match(/^\/api\/matches\/(\d+)\/messages$/);
    if (messagesMatch && method === 'GET') {
      const matchId = parseInt(messagesMatch[1]);
      const messages = mockMessages.filter((m) => m.matchId === matchId);
      res.writeHead(200);
      res.end(JSON.stringify({ data: messages }));
      return;
    }

    // POST /api/matches/:matchId/messages
    if (messagesMatch && method === 'POST') {
      const matchId = parseInt(messagesMatch[1]);
      const body = await parseBody(req);
      const newMessage = {
        id: Math.max(...mockMessages.map((m) => m.id), 0) + 1,
        matchId,
        ...body,
        createdAt: new Date().toISOString(),
      };
      mockMessages.push(newMessage);
      res.writeHead(201);
      res.end(JSON.stringify({ data: newMessage }));
      return;
    }

    // ==================== LIKES ENDPOINTS ====================
    if (pathname === '/api/likes/my' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        data: [
          { id: 1, itemId: 1, likedAt: new Date().toISOString() },
          { id: 2, itemId: 2, likedAt: new Date().toISOString() },
        ] 
      }));
      return;
    }

    if (pathname === '/api/likes/received' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        data: [
          { id: 3, fromUserId: 2, itemId: 1, likedAt: new Date().toISOString() },
          { id: 4, fromUserId: 3, itemId: 2, likedAt: new Date().toISOString() },
        ] 
      }));
      return;
    }

    // POST /api/likes/:itemId
    const likePostMatch = pathname.match(/^\/api\/likes\/(\d+)$/);
    if (likePostMatch && method === 'POST') {
      const itemId = parseInt(likePostMatch[1]);
      res.writeHead(201);
      res.end(JSON.stringify({ 
        data: { 
          id: Math.random(), 
          itemId,
          likedAt: new Date().toISOString()
        } 
      }));
      return;
    }

    // DELETE /api/likes/:itemId
    if (likePostMatch && method === 'DELETE') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: { success: true } }));
      return;
    }

    // ==================== CATEGORIES ENDPOINTS ====================
    if (pathname === '/api/categories' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ data: mockCategories }));
      return;
    }

    // Default 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found', path: pathname }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`💡 This is a simple HTTP server for testing`);
});
