const itemService = require('../services/itemService');
const { VALID_CATEGORIES } = require('../validators/itemValidator');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler, parsePagination } = require('../utils/helpers');

const getCategories = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, { categories: VALID_CATEGORIES });
});

const create = asyncHandler(async (req, res) => {
  const item = await itemService.create(req.userId, req.body, req.files || []);
  return ApiResponse.created(res, item, 'Item criado com sucesso.');
});

const findById = asyncHandler(async (req, res) => {
  const item = await itemService.findById(req.params.id);
  return ApiResponse.success(res, item);
});

const findMyItems = asyncHandler(async (req, res) => {
  const items = await itemService.findByUser(req.userId);

  // For consistency with the feed endpoint, transform items to include
  // a `photos` array built from `primary_photo` so frontend can use
  // the same shape (item.photos[0]) when rendering thumbnails.
  const transformed = items.map((item) => ({
    ...item,
    photos: item.primary_photo ? [item.primary_photo] : [],
    primary_photo: undefined,
  }));

  return ApiResponse.success(res, transformed);
});

const feed = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);
  const { items, total } = await itemService.findForFeed(req.userId, pagination);
  
  // Transform items to include photos array
  const transformedItems = items.map((item) => ({
    ...item,
    photos: item.primary_photo ? [item.primary_photo] : [],
    primary_photo: undefined, // Remove primary_photo field
  }));
  
  return ApiResponse.paginated(res, transformedItems, { ...pagination, total });
});

const update = asyncHandler(async (req, res) => {
  const item = await itemService.update(req.userId, req.params.id, req.body);
  return ApiResponse.success(res, item, 'Item atualizado com sucesso.');
});

const remove = asyncHandler(async (req, res) => {
  await itemService.delete(req.userId, req.params.id);
  return ApiResponse.success(res, null, 'Item removido com sucesso.');
});

const addPhotos = asyncHandler(async (req, res) => {
  console.log('[addPhotos] req.files:', req.files);
  console.log('[addPhotos] req.body:', req.body);
  console.log('[addPhotos] Content-Type:', req.headers['content-type']);
  
  if (!req.files || req.files.length === 0) {
    console.log('[addPhotos] No files received!');
    return ApiResponse.badRequest(res, 'Nenhuma foto enviada.');
  }
  const photos = await itemService.addPhotos(req.userId, req.params.id, req.files);
  return ApiResponse.created(res, photos, 'Fotos adicionadas com sucesso.');
});

const deletePhoto = asyncHandler(async (req, res) => {
  const result = await itemService.deletePhoto(req.userId, req.params.id, req.params.photoId);
  return ApiResponse.success(res, result, 'Foto removida com sucesso.');
});

module.exports = { getCategories, create, findById, findMyItems, feed, update, remove, addPhotos, deletePhoto };
