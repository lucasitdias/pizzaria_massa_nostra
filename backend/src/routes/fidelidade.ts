import { Router } from 'express'
import {
  consultarPontos,
  acumularPontos,
  resgatarPontos,
  listarRecompensas
} from '../controllers/fidelidadeController'
import { verificarToken } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

router.use(verificarToken)

// Consultar pontuação do cliente
router.get('/pontuacao/:clienteId', consultarPontos)

// Registrar pontos após pedido
router.post('/pontuar', acumularPontos)

// Resgatar recompensa
router.post('/resgatar', resgatarPontos)

// Listar recompensas disponíveis
router.get('/recompensas', listarRecompensas)

router.use(tratamentoErros)

export default router
