import { body } from 'express-validator'

// Validação para criação ou edição de campanhas promocionais.

export const validarCampanha = [
  body('titulo')
    .notEmpty().withMessage('Título da campanha é obrigatório'),

  body('descricao')
    .optional()
    .isString().withMessage('Descrição deve ser uma string'),

  body('dataInicio')
    .notEmpty().withMessage('Data de início é obrigatória')
    .isISO8601().withMessage('Data de início inválida'),

  body('dataFim')
    .notEmpty().withMessage('Data de fim é obrigatória')
    .isISO8601().withMessage('Data de fim inválida'),

  body('ativo')
    .optional()
    .isBoolean().withMessage('Campo ativo deve ser booleano'),
]
