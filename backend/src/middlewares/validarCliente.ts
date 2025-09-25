import { body } from 'express-validator'

// Validação para cadastro e atualização de cliente.

export const validarCliente = [
  body('nome')
    .notEmpty().withMessage('Nome do cliente é obrigatório'),

  body('email')
    .optional()
    .isEmail().withMessage('E-mail inválido'),

  body('telefone')
    .optional()
    .isString().withMessage('Telefone deve ser uma string'),

  body('cpf')
    .optional()
    .isString().withMessage('CPF deve ser uma string'),

  body('ativo')
    .optional()
    .isBoolean().withMessage('Campo ativo deve ser booleano'),
]
