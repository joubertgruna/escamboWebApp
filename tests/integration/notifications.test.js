const request = require('supertest');

// Mock database module used by controllers
const mockNotifications = [
  { id: 1, user_id: 1, type: 'like', title: 'Teste', message: 'Mensagem', created_at: new Date() }
];

const dbMock = jest.fn((table) => {
  if (table === 'notifications') {
    return {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnValue(Promise.resolve(mockNotifications)),
      update: jest.fn().mockReturnValue(Promise.resolve(1)),
      del: jest.fn().mockReturnValue(Promise.resolve(1)),
    };
  }
  // default fallback for other tables
  return {
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(undefined),
    insert: jest.fn().mockResolvedValue([1]),
    del: jest.fn().mockResolvedValue(1),
    select: jest.fn().mockResolvedValue([]),
  };
});

jest.mock('../../src/config/database', () => dbMock);

// Mock auth middleware to inject userId
jest.mock('../../src/middlewares/authMiddleware', () => (req, res, next) => {
  req.userId = 1;
  return next();
});

const app = require('../../src/app');

describe('Notifications API', () => {
  test('GET /api/notifications should return list for authenticated user', async () => {
    const res = await request(app).get('/api/notifications?limit=20');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('PUT /api/notifications/:id/read should mark as read', async () => {
    const res = await request(app).put('/api/notifications/1/read');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /api/notifications/:id should delete notification', async () => {
    const res = await request(app).delete('/api/notifications/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
