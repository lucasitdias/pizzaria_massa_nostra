import { Router } from 'express'
import {
  listarEntregas,
  registrarEntrega,
  atualizarEntrega,
  cancelarEntrega
} from '../controllers/entregasController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Listar entregas (admin ou atendente)
router.get('/', listarEntregas)

// Registrar entrega de pedido
router.post('/', registrarEntrega)

// Atualizar status da entrega (exemplo: saiu para entrega, entregue)
router.put('/:id', atualizarEntrega)

// Cancelar entrega (admin)
router.patch('/:id/cancelar', verificarAdmin, cancelarEntrega)

router.use(tratamentoErros)

export default router
