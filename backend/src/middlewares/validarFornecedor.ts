import { body } from 'express-validator'

// Validação para cadastro e atualização de fornecedor.

export const validarFornecedor = [
  body('nomeCompleto')
    .notEmpty().withMessage('Nome completo é obrigatório'),

  body('cpf')
    .notEmpty().withMessage('CPF é obrigatório'),

  body('rg')
    .notEmpty().withMessage('RG é obrigatório'),

  body('email')
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido'),

  body('telefone')
    .notEmpty().withMessage('Telefone é obrigatório'),

  body('pais')
    .notEmpty().withMessage('País é obrigatório'),

  body('estado')
    .notEmpty().withMessage('Estado é obrigatório'),

  body('cidade')
    .notEmpty().withMessage('Cidade é obrigatória'),

  body('bairro')
    .notEmpty().withMessage('Bairro é obrigatório'),

  body('rua')
    .notEmpty().withMessage('Rua é obrigatória'),

  body('numero')
    .notEmpty().withMessage('Número é obrigatório'),

  body('tipoFornecedor')
    .notEmpty().withMessage('Tipo de fornecedor é obrigatório'),

  body('ativo')
    .optional()
    .isBoolean().withMessage('Campo ativo deve ser booleano'),
]
