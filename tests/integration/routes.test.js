const request = require('supertest');

// Mock do banco de dados
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const app = require('../../src/app');

describe('Health Check', () => {
  test('GET /api/health deve retornar 200', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('Rotas de Auth', () => {
  describe('POST /api/auth/register', () => {
    test('deve retornar 400 sem body', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.statusCode).toBe(400);
    });

    test('deve retornar 400 com email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste',
          email: 'invalido',
          password: '123456',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('deve retornar 400 sem body', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });
});

describe('Rotas protegidas', () => {
  test('GET /api/items deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/items');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/matches deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/matches');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/likes/received deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/likes/received');

    expect(res.statusCode).toBe(401);
  });
});

describe('Rota inexistente', () => {
  test('deve retornar 404', async () => {
    const res = await request(app).get('/api/naoexiste');

    expect(res.statusCode).toBe(404);
  });
});
