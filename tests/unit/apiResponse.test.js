const { ApiResponse } = require('../../src/utils/apiResponse');

describe('ApiResponse', () => {
  test('success retorna formato correto', () => {
    const res = ApiResponse.success({ id: 1, name: 'Teste' }, 'Sucesso');

    expect(res).toEqual({
      success: true,
      message: 'Sucesso',
      data: { id: 1, name: 'Teste' },
    });
  });

  test('error retorna formato correto', () => {
    const res = ApiResponse.error('Algo deu errado', 400);

    expect(res).toEqual({
      success: false,
      message: 'Algo deu errado',
      statusCode: 400,
    });
  });

  test('error com código padrão 500', () => {
    const res = ApiResponse.error('Erro interno');

    expect(res.statusCode).toBe(500);
  });

  test('paginated retorna formato com paginação', () => {
    const items = [{ id: 1 }, { id: 2 }];
    const res = ApiResponse.paginated(items, 10, 1, 5);

    expect(res.success).toBe(true);
    expect(res.data).toEqual(items);
    expect(res.pagination).toEqual({
      total: 10,
      page: 1,
      limit: 5,
      totalPages: 2,
    });
  });
});
