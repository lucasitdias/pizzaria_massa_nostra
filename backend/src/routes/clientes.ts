import { Router } from 'express'
import {
  criarCliente,
  consultarCliente,
  atualizarCliente,
  desativarCliente,
  reativarCliente
} from '../controllers/clienteController'

import { verificarToken } from '../middlewares/verificarToken'
import { validarCliente } from '../middlewares/validarCliente'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

// Cadastro público — sem token
router.post('/', validarCliente, criarCliente)

// Rotas protegidas
router.get('/:id', verificarToken, consultarCliente)
router.put('/:id', verificarToken, validarCliente, atualizarCliente)
router.patch('/:id/desativar', verificarToken, desativarCliente)
router.patch('/:id/reativar', verificarToken, reativarCliente)

router.use(tratamentoErros)

export default router
