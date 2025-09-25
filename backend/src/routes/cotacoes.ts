import { Router } from 'express'
import {
  listarCotacoes,
  criarCotacao,
  responderCotacao,
  cancelarCotacao
} from '../controllers/cotacoesController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Criar cotação (admin)
router.post('/', verificarAdmin, criarCotacao)

// Listar cotações
router.get('/', listarCotacoes)

// Responder cotação (fornecedor)
router.patch('/:id/responder', responderCotacao)

// Cancelar cotação (admin)
router.patch('/:id/cancelar', verificarAdmin, cancelarCotacao)

router.use(tratamentoErros)

export default router
