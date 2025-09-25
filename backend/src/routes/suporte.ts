import { Router } from 'express'
import {
  registrarChamado,
  listarChamados,
  responderChamado,
  fecharChamado
} from '../controllers/suporteController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Registrar novo chamado de suporte
router.post('/', registrarChamado)

// Listar chamados do usuário
router.get('/', listarChamados)

// Responder chamado (admin ou atendente)
router.patch('/:id/responder', verificarAdmin, responderChamado)

// Fechar chamado (admin)
router.patch('/:id/fechar', verificarAdmin, fecharChamado)

router.use(tratamentoErros)

export default router
