const { asyncHandler, parsePagination, generateFileName } = require('../../src/utils/helpers');

describe('Helpers', () => {
  describe('asyncHandler', () => {
    test('executa função async e chama next em caso de erro', async () => {
      const error = new Error('test error');
      const fn = jest.fn().mockRejectedValue(error);
      const handler = asyncHandler(fn);
      const req = {};
      const res = {};
      const next = jest.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test('executa função async sem chamar next quando sucesso', async () => {
      const fn = jest.fn().mockResolvedValue(undefined);
      const handler = asyncHandler(fn);
      const req = {};
      const res = {};
      const next = jest.fn();

      await handler(req, res, next);

      expect(fn).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe('parsePagination', () => {
    test('retorna valores padrão quando query vazia', () => {
      const result = parsePagination({});

      expect(result).toEqual({ page: 1, limit: 20, offset: 0 });
    });

    test('calcula offset corretamente', () => {
      const result = parsePagination({ page: 3, limit: 10 });

      expect(result).toEqual({ page: 3, limit: 10, offset: 20 });
    });

    test('limita valores máximos', () => {
      const result = parsePagination({ page: -1, limit: 200 });

      expect(result.page).toBe(1);
      expect(result.limit).toBeLessThanOrEqual(100);
    });
  });

  describe('generateFileName', () => {
    test('gera nome de arquivo com extensão', () => {
      const name = generateFileName('foto.jpg');

      expect(name).toMatch(/\.jpg$/);
      expect(name).not.toBe('foto.jpg');
    });

    test('mantém extensão do arquivo original', () => {
      const name = generateFileName('imagem.png');

      expect(name).toMatch(/\.png$/);
    });
  });
});
