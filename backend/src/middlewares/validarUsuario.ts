import { body } from 'express-validator'

// Validação para cadastro de usuário.
// Utilizado em rotas de POST /usuarios

export const validarCadastroUsuario = [
  body('nome')
    .notEmpty().withMessage('Nome é obrigatório')
    .isString().withMessage('Nome deve ser uma string'),

  body('email')
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido'),

  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),

  body('setor')
    .notEmpty().withMessage('Setor é obrigatório')
    .isString().withMessage('Setor deve ser uma string'),

  body('cargo')
    .notEmpty().withMessage('Cargo é obrigatório')
    .isString().withMessage('Cargo deve ser uma string'),

  body('perfil')
    .notEmpty().withMessage('Perfil é obrigatório')
    .isIn(['admin', 'gerente', 'atendente', 'garçom']).withMessage('Perfil inválido'),

  body('ativo')
    .optional()
    .isBoolean().withMessage('Campo ativo deve ser booleano'),
]

// Validação para login de usuário.
// Utilizado em rotas de POST /login

export const validarLoginUsuario = [
  body('email')
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido'),

  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isString().withMessage('Senha deve ser uma string'),
]

// Validação para atualização de usuário.
// Utilizado em rotas de PUT /usuarios/:id

export const validarAtualizacaoUsuario = [
  body('nome')
    .optional()
    .isString().withMessage('Nome deve ser uma string'),

  body('email')
    .optional()
    .isEmail().withMessage('E-mail inválido'),

  body('senha')
    .optional()
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),

  body('setor')
    .optional()
    .isString().withMessage('Setor deve ser uma string'),

  body('cargo')
    .optional()
    .isString().withMessage('Cargo deve ser uma string'),

  body('perfil')
    .optional()
    .isIn(['admin', 'gerente', 'atendente', 'garçom']).withMessage('Perfil inválido'),

  body('ativo')
    .optional()
    .isBoolean().withMessage('Campo ativo deve ser booleano'),
]

// Exportação unificada para uso nas rotas
export const validarUsuario = {
  cadastro: validarCadastroUsuario,
  login: validarLoginUsuario,
  atualizacao: validarAtualizacaoUsuario
}
