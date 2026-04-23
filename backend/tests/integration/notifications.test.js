const request = require('supertest');
const dbHelper = require('../helpers/dbHelper');
const app = require('../../src/app');

describe('Notifications API (integração com DB real)', () => {
  let testUser = null;
  let token = null;

  beforeAll(async () => {
    testUser = await dbHelper.createTestUser();
    await dbHelper.createNotificationForUser(testUser.id, { title: 'Teste integração' });
    token = dbHelper.generateTokenForUser(testUser);
  });

  afterAll(async () => {
    try {
      await dbHelper.cleanupTestUser(testUser.id);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Erro no cleanup do teste de notificações:', err.message);
    } finally {
      await dbHelper.destroyDb();
    }
  });

  test('GET /api/notifications should return list for authenticated user', async () => {
    const res = await request(app).get('/api/notifications?limit=20').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find((n) => n.user_id === testUser.id || n.userId === testUser.id);
    expect(found).toBeTruthy();
  });

  test('PUT /api/notifications/:id/read should mark as read', async () => {
    const [notif] = await require('../../src/config/database')('notifications').where({ user_id: testUser.id }).select('id');
    const res = await request(app).put(`/api/notifications/${notif.id}/read`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /api/notifications/:id should delete notification', async () => {
    const [newId] = await require('../../src/config/database')('notifications').insert({
      user_id: testUser.id,
      type: 'like',
      title: 'To delete',
      message: 'Delete me',
      created_at: new Date(),
    });

    const res = await request(app).delete(`/api/notifications/${newId}`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
