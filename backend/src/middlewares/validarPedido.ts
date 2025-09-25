import { body } from 'express-validator'

// Validação para criação de pedido.
// Utilizado em rotas de POST /pedidos

export const validarPedido = [
  body('clienteId')
    .notEmpty().withMessage('ID do cliente é obrigatório')
    .isInt().withMessage('ID do cliente deve ser um número inteiro'),

  body('centroDeCustoId')
    .notEmpty().withMessage('ID do centro de custo é obrigatório')
    .isInt().withMessage('ID do centro de custo deve ser um número inteiro'),

  body('formaPagamento')
    .optional()
    .isString().withMessage('Forma de pagamento deve ser uma string'),

  body('observacoes')
    .optional()
    .isString().withMessage('Observações devem ser texto'),

  body('status')
    .optional()
    .isString().withMessage('Status deve ser uma string'),

  body('pizzas')
    .isArray({ min: 1 }).withMessage('É necessário informar ao menos uma pizza'),

  body('pizzas.*.pizzaId')
    .notEmpty().withMessage('ID da pizza é obrigatório')
    .isInt().withMessage('ID da pizza deve ser um número inteiro'),

  body('pizzas.*.nome')
    .notEmpty().withMessage('Nome da pizza é obrigatório'),

  body('pizzas.*.precoVenda')
    .notEmpty().withMessage('Preço de venda é obrigatório')
    .isFloat({ gt: 0 }).withMessage('Preço de venda deve ser maior que zero'),

  body('pizzas.*.quantidade')
    .notEmpty().withMessage('Quantidade é obrigatória')
    .isInt({ gt: 0 }).withMessage('Quantidade deve ser maior que zero'),

  body('pizzas.*.insumos')
    .isArray().withMessage('Insumos devem ser uma lista'),

  body('pizzas.*.insumos.*.insumoId')
    .notEmpty().withMessage('ID do insumo é obrigatório')
    .isInt().withMessage('ID do insumo deve ser um número inteiro'),

  body('pizzas.*.insumos.*.quantidadeUtilizada')
    .notEmpty().withMessage('Quantidade utilizada é obrigatória')
    .isFloat({ gt: 0 }).withMessage('Quantidade utilizada deve ser maior que zero'),
]
