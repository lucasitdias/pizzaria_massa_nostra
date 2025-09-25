import { Router } from 'express'
import {
  registrarComprovante,
  listarComprovantesPorPedido,
  excluirComprovante
} from '../controllers/comprovanteController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { validarComprovante } from '../middlewares/validarComprovante'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Registrar comprovante de pagamento
router.post('/', validarComprovante, registrarComprovante)

// Listar comprovantes por pedido
router.get('/pedido/:pedidoId', listarComprovantesPorPedido)

// Excluir comprovante (admin)
router.delete('/:id', verificarAdmin, excluirComprovante)

router.use(tratamentoErros)

export default router
