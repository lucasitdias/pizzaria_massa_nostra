import { Router } from 'express'
import {
  criarInsumo,
  listarInsumos,
  consultarInsumo,
  atualizarInsumo,
  inativarInsumo,
  ativarInsumo,
  excluirInsumo,
  filtrarInsumos,
  verificarValidade
} from '../controllers/insumoController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { validarBody } from '../middlewares/validarBody'
import { tratamentoErros } from '../middlewares/tratamentoErros'
import { insumoSchema } from '../schemas/insumoSchema'

const router = Router()

router.use(verificarToken)

router.get('/', listarInsumos)
router.get('/:id', consultarInsumo)
router.post('/', verificarAdmin, validarBody(insumoSchema), criarInsumo)
router.put('/:id', verificarAdmin, validarBody(insumoSchema), atualizarInsumo)
router.patch('/:id/inativar', verificarAdmin, inativarInsumo)
router.patch('/:id/ativar', verificarAdmin, ativarInsumo)
router.get('/filtro/avancado', filtrarInsumos)
router.get('/validade/proximos', verificarAdmin, verificarValidade)
router.delete('/admin/:id', verificarAdmin, excluirInsumo)

router.use(tratamentoErros)

export default router
