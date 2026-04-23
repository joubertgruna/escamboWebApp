const userRepository = require('../repositories/userRepository');
const itemService = require('./itemService');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return userRepository.update(userId, data);
  }

  async updateAvatar(userId, avatarUrl) {
    return userRepository.update(userId, { avatar_url: avatarUrl });
  }

  async getPublicProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    // Get user's public items (not ownership-checked)
    const items = await itemService.findByUser(userId);

    // Normalize items similar to feed transform: include photos array
    const transformed = items.map((item) => ({
      ...item,
      photos: item.primary_photo ? [item.primary_photo] : [],
      primary_photo: undefined,
    }));

    return { user, items: transformed };
  }
}

module.exports = new UserService();
