import { Router, Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient } from '@prisma/client'
import { verificarToken } from '../middlewares/verificarToken'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()
const prisma = new PrismaClient()

// Protege todas as rotas com autenticação
router.use(verificarToken)

// Retorna dados básicos para debug e testes de seed

router.get('/debug/ids', async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({ select: { id: true, nomeCompleto: true } })
    const pizzas = await prisma.pizza.findMany({ select: { id: true, nome: true } })
    const centros = await prisma.centroDeCusto.findMany({ select: { id: true, nome: true } })

    res.json({ clientes, pizzas, centros })
  } catch (erro) {
    console.error('Erro ao buscar dados do seed:', erro)
    res.status(500).json({ erro: 'Erro ao buscar dados do seed.' })
  }
})

// Tratamento de erros
router.use(tratamentoErros)

export default router
