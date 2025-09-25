// src/routes/pagamentos.ts
import { Router, Response } from 'express'
import { Request } from 'express-serve-static-core'
import { pagamentoSchema } from '../validations/validadoresPagamento'
import { registrarPagamento } from '../services/pagamentoService'
import { verificarToken } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()
router.use(verificarToken)

// Registrar pagamento
router.post('/', async (req: Request, res: Response) => {
  try {
    const dados = pagamentoSchema.parse(req.body)

    const pagamento = await registrarPagamento(dados)

    return res.status(201).json({
      mensagem: 'Pagamento registrado com sucesso!',
      pagamento
    })
  } catch (erro) {
    console.error('Erro ao registrar pagamento:', erro)
    return res.status(400).json({
      erro: 'Erro ao registrar pagamento.',
      detalhes: erro instanceof Error ? erro.message : String(erro)
    })
  }
})

router.use(tratamentoErros)

export default router
