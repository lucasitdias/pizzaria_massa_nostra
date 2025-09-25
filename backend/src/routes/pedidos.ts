import { Router, Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, StatusPedido } from '@prisma/client'
import { verificarToken, verificarAdmin } from '../middlewares/verificarToken'
import { pedidoSchema } from '../schemas/pedidoSchema'
import { criarPedido } from '../services/pedidoService'
import { tratamentoErros } from '../middlewares/tratamentoErros'
import { CriarPedidoDTO } from '../entidades/CriarPedidoDTO'

const prisma = new PrismaClient()
const router = Router()

router.use(verificarToken)

// Listar todos os pedidos
router.get('/', async (req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        pizzas: true,
        bebidas: true,
        cliente: true,
        centroDeCusto: true
      }
    })
    return res.json(pedidos)
  } catch (erro) {
    console.error('Erro ao listar pedidos:', erro)
    return res.status(500).json({ erro: 'Erro ao listar pedidos.' })
  }
})

// Buscar pedido por ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        pizzas: true,
        bebidas: true,
        cliente: true,
        centroDeCusto: true
      }
    })
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' })
    return res.json(pedido)
  } catch (erro) {
    console.error('Erro ao buscar pedido:', erro)
    return res.status(500).json({ erro: 'Erro ao buscar pedido.' })
  }
})

// Registrar novo pedido
router.post('/', async (req: Request, res: Response) => {
  try {
    const bordasValidas = ['tradicional', 'simples', 'vulcao'] as const
    type BordaLiteral = typeof bordasValidas[number]

    req.body.itens = req.body.itens.map((item: any) => {
      if (item.tipo === 'pizza') {
        const bordaCorrigida: BordaLiteral | undefined = bordasValidas.includes(item.borda)
          ? item.borda as BordaLiteral
          : undefined

        const insumosCorrigidos = Array.isArray(item.insumos)
          ? item.insumos.map((i: any) => ({
              insumoId: Number(i.insumoId),
              quantidadeUtilizada: Number(i.quantidadeUtilizada)
            }))
          : []

        return {
          ...item,
          borda: bordaCorrigida,
          insumos: insumosCorrigidos
        }
      }

      return item
    })

    const dados = pedidoSchema.parse(req.body) as CriarPedidoDTO

    const resultado = await criarPedido(dados, req.user?.id ?? 0, req.ip ?? 'IP não identificado')

    return res.status(201).json({
      mensagem: 'Pedido criado com sucesso!',
      pedido: resultado.pedido,
      total: resultado.total
    })
  } catch (erro) {
    console.error('Erro ao registrar pedido:', erro)
    return res.status(400).json({
      erro: 'Erro ao registrar pedido.',
      detalhes: erro instanceof Error ? erro.message : String(erro)
    })
  }
})

// Atualizar status do pedido
router.patch('/:id/status', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { status } = req.body

  if (
    isNaN(id) ||
    typeof status !== 'string' ||
    !Object.values(StatusPedido).includes(status as StatusPedido)
  ) {
    return res.status(400).json({ erro: `Status '${status}' é inválido.` })
  }

  try {
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: {
        status: { set: status as StatusPedido }
      }
    })
    return res.json(pedidoAtualizado)
  } catch (erro) {
    console.error('Erro ao atualizar status:', erro)
    return res.status(500).json({ erro: 'Erro ao atualizar status.' })
  }
})

// Excluir pedido (admin)
router.delete('/:id', verificarAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    await prisma.pedido.delete({ where: { id } })
    return res.json({ mensagem: 'Pedido excluído com sucesso.' })
  } catch (erro) {
    console.error('Erro ao excluir pedido:', erro)
    return res.status(500).json({ erro: 'Erro ao excluir pedido.' })
  }
})

// Buscar IDs para debug (admin)
router.get('/debug/ids', verificarAdmin, async (_req: Request, res: Response) => {
  try {
    const ids = await prisma.pedido.findMany({ select: { id: true } })
    return res.json(ids.map(p => p.id))
  } catch (erro) {
    console.error('Erro ao buscar IDs de debug:', erro)
    return res.status(500).json({ erro: 'Erro ao buscar IDs.' })
  }
})

// Tratamento de erros
router.use(tratamentoErros)

export default router
