import { Router } from 'express'
import {
  listarMovimentacoes,
  registrarRecebimento,
  registrarPagamento,
  gerarResumoFinanceiro
} from '../controllers/financeiroController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Listar movimentações financeiras
router.get('/movimentacoes', verificarAdmin, listarMovimentacoes)

// Registrar recebimento (exemplo: pagamento de pedido)
router.post('/receber', registrarRecebimento)

// Registrar pagamento (exemplo: fornecedor, despesa)
router.post('/pagar', verificarAdmin, registrarPagamento)

// Gerar resumo financeiro (fluxo de caixa, lucro, etc.)
router.get('/resumo', verificarAdmin, gerarResumoFinanceiro)

router.use(tratamentoErros)

export default router
