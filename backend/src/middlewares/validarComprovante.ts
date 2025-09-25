import { body } from 'express-validator'

// Validação para registro de comprovantes de pagamento.

export const validarComprovante = [
  body('pedidoId')
    .notEmpty().withMessage('ID do pedido é obrigatório')
    .isInt().withMessage('ID do pedido deve ser um número inteiro'),

  body('valor')
    .notEmpty().withMessage('Valor do comprovante é obrigatório')
    .isFloat({ gt: 0 }).withMessage('Valor deve ser maior que zero'),

  body('data')
    .notEmpty().withMessage('Data do comprovante é obrigatória')
    .isISO8601().withMessage('Data inválida'),

  body('observacoes')
    .optional()
    .isString().withMessage('Observações devem ser texto'),
]
