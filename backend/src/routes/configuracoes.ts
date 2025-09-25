import { Router } from 'express'
import {
  listarConfiguracoes,
  atualizarConfiguracoes
} from '../controllers/configuracoesController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Listar configurações do sistema
router.get('/', verificarAdmin, listarConfiguracoes)

// Atualizar configurações
router.put('/', verificarAdmin, atualizarConfiguracoes)

router.use(tratamentoErros)

export default router
