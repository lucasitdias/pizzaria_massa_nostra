import { Router } from 'express'
import { registrarAvaliacao, listarAvaliacoes } from '../controllers/avaliacoesController'
import { verificarToken } from '../middlewares/verificarToken'
import { validarBody } from '../middlewares/validarBody'
import { tratamentoErros } from '../middlewares/tratamentoErros'
import { z } from 'zod'

const router = Router()

// Schema de validação com Zod
const avaliacaoSchema = z.object({
  pedidoId: z.number(),
  nota: z.number().min(1).max(5),
  comentario: z.string().optional(),
})

// Registrar avaliação de pedido
router.post(
  '/',
  verificarToken,
  validarBody(avaliacaoSchema),
  registrarAvaliacao
)

// Listar avaliações (admin ou gerente)
router.get('/', verificarToken, listarAvaliacoes)

// Tratamento de erros
router.use(tratamentoErros)

export default router
