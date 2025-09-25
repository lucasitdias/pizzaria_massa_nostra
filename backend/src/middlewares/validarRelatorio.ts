import { body } from 'express-validator'

// Validação para geração de relatórios.
// Utilizado em rotas de POST /relatorios

export const validarRelatorio = [
  body('tipo')
    .notEmpty().withMessage('Tipo de relatório é obrigatório')
    .isIn(['vendas', 'estoque', 'financeiro']).withMessage('Tipo de relatório inválido'),

  body('dataInicio')
    .notEmpty().withMessage('Data de início é obrigatória')
    .isISO8601().withMessage('Data de início inválida'),

  body('dataFim')
    .notEmpty().withMessage('Data de fim é obrigatória')
    .isISO8601().withMessage('Data de fim inválida'),

  body('centroDeCustoId')
    .optional()
    .isInt().withMessage('Centro de custo deve ser um número inteiro'),

  body('clienteId')
    .optional()
    .isInt().withMessage('ID do cliente deve ser um número inteiro'),

  body('fornecedorId')
    .optional()
    .isInt().withMessage('ID do fornecedor deve ser um número inteiro'),
]
