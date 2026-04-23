jest.mock('../../src/repositories/itemRepository');
jest.mock('../../src/repositories/photoRepository');

const itemService = require('../../src/services/itemService');
const itemRepository = require('../../src/repositories/itemRepository');
const photoRepository = require('../../src/repositories/photoRepository');

describe('ItemService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('deve criar item com fotos', async () => {
      itemRepository.create.mockResolvedValue(1);
      photoRepository.createMany.mockResolvedValue();
      itemRepository.findByIdWithPhotos.mockResolvedValue({
        id: 1,
        title: 'Guitarra',
        photos: [{ id: 1, url: '/test.jpg' }],
      });

      const result = await itemService.create(
        {
          title: 'Guitarra',
          description: 'Guitarra usada',
          category: 'Instrumentos',
          condition: 'usado',
        },
        [{ filename: 'test.jpg' }],
        1
      );

      expect(result.title).toBe('Guitarra');
      expect(itemRepository.create).toHaveBeenCalled();
    });
  });

  describe('getFeed', () => {
    test('deve retornar itens com paginação', async () => {
      itemRepository.findForFeed.mockResolvedValue({
        items: [{ id: 1 }, { id: 2 }],
        total: 10,
      });

      const result = await itemService.getFeed({ page: 1, limit: 20 }, 1);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(10);
    });
  });

  describe('getById', () => {
    test('deve retornar item com fotos', async () => {
      itemRepository.findByIdWithPhotos.mockResolvedValue({
        id: 1,
        title: 'Guitarra',
        photos: [],
      });

      const result = await itemService.getById(1);

      expect(result.id).toBe(1);
    });

    test('deve lançar erro se item não encontrado', async () => {
      itemRepository.findByIdWithPhotos.mockResolvedValue(null);

      await expect(itemService.getById(999)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    test('deve deletar item do próprio usuário', async () => {
      itemRepository.isOwner.mockResolvedValue(true);
      itemRepository.delete.mockResolvedValue();

      await expect(itemService.delete(1, 1)).resolves.not.toThrow();
    });

    test('deve lançar erro ao tentar deletar item de outro usuário', async () => {
      itemRepository.isOwner.mockResolvedValue(false);

      await expect(itemService.delete(1, 2)).rejects.toThrow();
    });
  });
});
