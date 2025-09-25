import { Router } from 'express'
import {
  listarCupons,
  criarCupom,
  aplicarCupom,
  desativarCupom
} from '../controllers/cuponsController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Listar cupons disponíveis
router.get('/', listarCupons)

// Aplicar cupom em pedido
router.post('/aplicar', aplicarCupom)

// Criar cupom (admin)
router.post('/', verificarAdmin, criarCupom)

// Desativar cupom (admin)
router.patch('/:id/desativar', verificarAdmin, desativarCupom)

router.use(tratamentoErros)

export default router
