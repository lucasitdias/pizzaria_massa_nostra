import { Router } from 'express'
import {
  listarCampanhas,
  criarCampanha,
  atualizarCampanha,
  desativarCampanha,
  buscarCampanhaPorId,
  aplicarCampanhaEmPedido
} from '../controllers/campanhaController'

import { verificarToken, verificarAdmin } from '../middlewares/verificarToken'
import { validarCampanha } from '../middlewares/validarCampanha'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

// Middleware global: exige autenticação para todas as rotas
router.use(verificarToken)

// Rotas públicas (usuário autenticado)
router.get('/', listarCampanhas)
router.get('/:id', buscarCampanhaPorId)
router.post('/aplicar', aplicarCampanhaEmPedido)

// Rotas restritas a administradores
router.post('/', verificarAdmin, validarCampanha, criarCampanha)
router.put('/:id', verificarAdmin, validarCampanha, atualizarCampanha)
router.patch('/:id/desativar', verificarAdmin, desativarCampanha)

// Middleware de tratamento de erros
router.use(tratamentoErros)

export default router
