const bcrypt = require('bcryptjs');

// Mock das dependências
jest.mock('../../src/repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-jwt-token'),
}));

const authService = require('../../src/services/authService');
const userRepository = require('../../src/repositories/userRepository');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('deve registrar um novo usuário', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(1);
      userRepository.findById.mockResolvedValue({
        id: 1,
        name: 'João',
        email: 'joao@test.com',
      });

      const result = await authService.register({
        name: 'João',
        email: 'joao@test.com',
        password: '123456',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('joao@test.com');
      expect(userRepository.findByEmail).toHaveBeenCalledWith('joao@test.com');
    });

    test('deve lançar erro se e-mail já existe', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'joao@test.com' });

      await expect(
        authService.register({
          name: 'João',
          email: 'joao@test.com',
          password: '123456',
        })
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    test('deve fazer login com credenciais válidas', async () => {
      userRepository.findByEmailWithPassword.mockResolvedValue({
        id: 1,
        name: 'João',
        email: 'joao@test.com',
        password: 'hashed-password',
      });
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.login({
        email: 'joao@test.com',
        password: '123456',
      });

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('joao@test.com');
    });

    test('deve lançar erro com credenciais inválidas', async () => {
      userRepository.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'naoexiste@test.com',
          password: '123456',
        })
      ).rejects.toThrow();
    });
  });
});
