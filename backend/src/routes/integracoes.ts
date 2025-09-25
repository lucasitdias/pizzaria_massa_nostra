import { Router } from 'express'
import {
  sincronizarEstoqueComERP,
  enviarMensagemWhatsApp
} from '../controllers/integracoesController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Sincronizar estoque com ERP
router.post('/erp/sincronizar', verificarAdmin, sincronizarEstoqueComERP)

// Enviar mensagem via WhatsApp
router.post('/whatsapp/mensagem', enviarMensagemWhatsApp)

router.use(tratamentoErros)

export default router
