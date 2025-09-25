import { Router } from 'express'
import {
  listarFornecedores,
  criarFornecedor,
  atualizarFornecedor,
  consultarFornecedor,
  desativarFornecedor,
  reativarFornecedor
} from '../controllers/fornecedorController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { validarFornecedor } from '../middlewares/validarFornecedor'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

router.get('/', listarFornecedores)
router.get('/:id', consultarFornecedor)
router.post('/', verificarAdmin, validarFornecedor, criarFornecedor)
router.put('/:id', verificarAdmin, validarFornecedor, atualizarFornecedor)
router.patch('/:id/desativar', verificarAdmin, desativarFornecedor)
router.patch('/:id/reativar', verificarAdmin, reativarFornecedor)

router.use(tratamentoErros)

export default router
