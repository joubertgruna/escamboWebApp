const Joi = require('joi');

// Valid categories for trading items (synchronized with frontend)
const VALID_CATEGORIES = [
  'eletrônicos',
  'electronics',
  'roupas',
  'livros',
  'móveis',
  'esportes',
  'jogos',
  'games',
  'beleza',
  'casa',
  'animais',
  'jardim',
  'carro',
  'veículos',
  'bicicleta',
  'música',
  'arte',
  'brinquedos',
  'outros'
];

const createItemSchema = {
  body: Joi.object({
    title: Joi.string().min(2).max(200).required()
      .messages({ 'any.required': 'Título é obrigatório.' }),
    description: Joi.string().max(2000).allow('', null),
    category: Joi.string().valid(...VALID_CATEGORIES).required()
      .messages({ 
        'any.required': 'Categoria é obrigatória.',
        'any.only': `Categoria inválida. Categorias válidas: ${VALID_CATEGORIES.join(', ')}`
      }),
    condition: Joi.string().valid('novo', 'seminovo', 'usado', 'desgastado', 'antigo').required()
      .messages({ 'any.required': 'Condição é obrigatória.' }),
    trade_for: Joi.string().max(255).allow('', null),
  }),
};

const updateItemSchema = {
  body: Joi.object({
    title: Joi.string().min(2).max(200),
    description: Joi.string().max(2000).allow('', null),
    category: Joi.string().valid(...VALID_CATEGORIES)
      .messages({ 
        'any.only': `Categoria inválida. Categorias válidas: ${VALID_CATEGORIES.join(', ')}`
      }),
    condition: Joi.string().valid('novo', 'seminovo', 'usado', 'desgastado', 'antigo'),
    trade_for: Joi.string().max(255).allow('', null),
    status: Joi.string().valid('active', 'traded', 'inactive'),
  }).min(1),
  params: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
};

module.exports = { createItemSchema, updateItemSchema, VALID_CATEGORIES };
