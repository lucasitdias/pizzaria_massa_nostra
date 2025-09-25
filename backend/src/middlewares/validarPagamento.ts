import { body } from 'express-validator'

// Validação para registro de pagamento de pedido.
// Utilizado em rotas de POST /pagamentos

export const validarPagamento = [
  body('pedidoId')
    .notEmpty().withMessage('ID do pedido é obrigatório')
    .isInt().withMessage('ID do pedido deve ser um número inteiro'),

  body('formaPagamento')
    .notEmpty().withMessage('Forma de pagamento é obrigatória')
    .isString().withMessage('Forma de pagamento deve ser uma string'),

  body('valorPago')
    .notEmpty().withMessage('Valor pago é obrigatório')
    .isFloat({ gt: 0 }).withMessage('Valor pago deve ser maior que zero'),

  body('dataPagamento')
    .optional()
    .isISO8601().withMessage('Data de pagamento inválida'),

  body('observacoes')
    .optional()
    .isString().withMessage('Observações devem ser texto'),
]
