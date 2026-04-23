jest.mock('../../src/repositories/likeRepository');
jest.mock('../../src/repositories/matchRepository');
jest.mock('../../src/repositories/itemRepository');

const likeService = require('../../src/services/likeService');
const likeRepository = require('../../src/repositories/likeRepository');
const matchRepository = require('../../src/repositories/matchRepository');
const itemRepository = require('../../src/repositories/itemRepository');

describe('LikeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('likeItem', () => {
    test('deve criar like e retornar sem match', async () => {
      itemRepository.findById.mockResolvedValue({ id: 1, user_id: 2 });
      likeRepository.create.mockResolvedValue(1);
      likeRepository.findMutualLike.mockResolvedValue(null);

      const result = await likeService.likeItem(1, 1);

      expect(result).toHaveProperty('like');
      expect(result.match).toBeNull();
    });

    test('deve criar match quando like é mútuo', async () => {
      itemRepository.findById.mockResolvedValue({ id: 1, user_id: 2 });
      likeRepository.create.mockResolvedValue(1);
      likeRepository.findMutualLike.mockResolvedValue({ id: 5, item_id: 3 });
      matchRepository.create.mockResolvedValue(1);
      matchRepository.findById.mockResolvedValue({ id: 1, user1_id: 1, user2_id: 2 });

      const result = await likeService.likeItem(1, 1);

      expect(result.match).not.toBeNull();
      expect(matchRepository.create).toHaveBeenCalled();
    });

    test('não deve permitir curtir próprio item', async () => {
      itemRepository.findById.mockResolvedValue({ id: 1, user_id: 1 });

      await expect(likeService.likeItem(1, 1)).rejects.toThrow();
    });
  });

  describe('getReceivedLikes', () => {
    test('deve retornar curtidas recebidas', async () => {
      likeRepository.findReceivedByUser.mockResolvedValue([
        { id: 1, user: { name: 'Ana' } },
      ]);

      const result = await likeService.getReceivedLikes(1);

      expect(result).toHaveLength(1);
    });
  });
});
