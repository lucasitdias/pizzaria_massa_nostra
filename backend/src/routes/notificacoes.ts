import { Router } from 'express'
import {
  enviarNotificacao,
  listarNotificacoes,
  marcarComoLida
} from '../controllers/notificacoesController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Enviar notificação (admin)
router.post('/', verificarAdmin, enviarNotificacao)

// Listar notificações do usuário
router.get('/', listarNotificacoes)

// Marcar como lida
router.patch('/:id/lida', marcarComoLida)

router.use(tratamentoErros)

export default router
