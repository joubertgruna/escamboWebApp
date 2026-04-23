const db = require('../../src/config/database');
const jwt = require('jsonwebtoken');
const authConfig = require('../../src/config/auth');

async function createTestUser(overrides = {}) {
  const userData = {
    name: overrides.name || 'Test User',
    email: overrides.email || `test-notif-${Date.now()}@example.com`,
    phone: overrides.phone || '0000000000',
    password_hash: overrides.password_hash || 'test-hash',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const [id] = await db('users').insert(userData);
  const user = await db('users').where({ id }).first();
  return user;
}

async function createNotificationForUser(userId, attrs = {}) {
  const notification = {
    user_id: userId,
    type: attrs.type || 'like',
    title: attrs.title || 'Test notification',
    message: attrs.message || 'Message',
    created_at: new Date(),
  };

  const [id] = await db('notifications').insert(notification);
  return { id, ...notification };
}

function generateTokenForUser(user) {
  return jwt.sign({ id: user.id, email: user.email }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
}

async function cleanupTestUser(userId) {
  await db('notifications').where({ user_id: userId }).del();
  await db('users').where({ id: userId }).del();
}

async function destroyDb() {
  await db.destroy();
}

module.exports = {
  createTestUser,
  createNotificationForUser,
  generateTokenForUser,
  cleanupTestUser,
  destroyDb,
};
