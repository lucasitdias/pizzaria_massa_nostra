import { Router } from 'express'
import { criarPedido } from '../services/pedidoService'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/pedido-demo', async (_req, res) => {
  try {
    // Buscar dados da pizza e bebida no banco
    const pizza = await prisma.pizza.findUnique({ where: { id: 3 } })
    const bebida = await prisma.bebida.findUnique({ where: { id: 5 } })

    if (!pizza || !bebida) {
      return res.status(404).json({ erro: 'Pizza ou bebida não encontrada no banco.' })
    }

    const resultado = await criarPedido(
      {
        clienteId: 1,
        centroDeCustoId: 1,
        formaPagamento: 'PIX',
        observacoes: 'Pedido de demonstração',
        status: 'SOLICITADO',
        itens: [
          {
            tipo: 'pizza',
            pizzaId: pizza.id,
            nome: pizza.nome,
            quantidade: 1,
            tamanho: 'grande',
            tipoPizza: 'salgada',
            sabores: [
              { nome: pizza.nome, precoBase: pizza.preco }
            ],
            borda: 'tradicional',
            recheioBorda: 'catupiry',
            insumos: []
          },
          {
            tipo: 'bebida',
            bebidaId: bebida.id,
            nome: bebida.nome,
            volume: bebida.volume,
            quantidade: 2
          }
        ]
      },
      1,
      '127.0.0.1'
    )

    return res.status(201).json({
      mensagem: 'Pedido de demonstração criado com sucesso!',
      pedido: resultado.pedido,
      total: resultado.total
    })
  } catch (erro) {
    console.error('Erro no pedido-demo:', erro)
    return res.status(500).json({ erro: 'Erro na demonstração', detalhes: erro })
  }
})

export default router
