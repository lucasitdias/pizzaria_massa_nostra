import { body } from 'express-validator'

// Validação para criação e atualização de pizza.
// Utilizado em rotas de POST e PUT /pizzas

export const validarPizza = [
  body('nome')
    .notEmpty().withMessage('Nome da pizza é obrigatório')
    .isString().withMessage('Nome deve ser uma string'),

  body('ingredientes')
    .isArray({ min: 1 }).withMessage('Ingredientes devem ser uma lista com pelo menos um item'),

  body('ingredientes.*')
    .isString().withMessage('Cada ingrediente deve ser uma string'),

  body('tamanho')
    .notEmpty().withMessage('Tamanho é obrigatório')
    .isIn(['broto', 'média', 'grande', 'família']).withMessage('Tamanho inválido'),

  body('preco')
    .notEmpty().withMessage('Preço é obrigatório')
    .isFloat({ gt: 0 }).withMessage('Preço deve ser um número maior que zero'),

  body('tipo')
    .notEmpty().withMessage('Tipo é obrigatório')
    .isIn(['tradicional', 'especial', 'doce']).withMessage('Tipo inválido')
]
