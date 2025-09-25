import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, StatusPedido, TipoOperacao } from '@prisma/client'
import { pedidoSchema } from '../validations/validadoresPedido'
import { criarPedido as criarPedidoService } from '../services/pedidoService'
import { calcularPrecoPizza } from '../services/regraPrecosPizzas'
import logger from '../config/logger'

const prisma = new PrismaClient()

// Cria pedido com dados fixos (para testes internos)
export const criarPedido = async (_req: Request, res: Response) => {
  try {
    const novoPedido = await prisma.pedido.create({
      data: {
        clienteId: 1,
        centroDeCustoId: 1,
        formaPagamento: "PIX",
        status: StatusPedido.SOLICITADO,
        valorTotal: 0
      }
    })
    res.json(novoPedido)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao criar pedido" })
  }
}

// Registra novo pedido com validação completa
export async function registrarPedido(req: Request, res: Response) {
  const parse = pedidoSchema.safeParse(req.body)

  if (!parse.success) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: parse.error.format()
    })
  }

  const { clienteId, itens, observacoes, formaPagamento, centroDeCustoId } = parse.data

  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } })
  if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' })

  for (const item of itens) {
    if (item.tipo === 'pizza') {
      const pizza = await prisma.pizza.findUnique({ where: { id: item.pizzaId } })
      if (!pizza) return res.status(404).json({ erro: `Pizza com ID ${item.pizzaId} não encontrada` })
    }

    if (item.tipo === 'bebida') {
      const bebida = await prisma.bebida.findUnique({ where: { id: item.bebidaId } })
      if (!bebida) return res.status(404).json({ erro: `Bebida com ID ${item.bebidaId} não encontrada` })
    }
  }

  try {
    const itensComQuantidade = itens.map((item: any) => ({
      ...item,
      quantidade: typeof item.quantidade === 'number' ? item.quantidade : 1
    }))

    let totalPedido = 0

    for (const item of itensComQuantidade) {
      if (item.tipo === 'pizza') {
        const precoPizza = calcularPrecoPizza({
          tipo: item.tipoPizza,
          tamanho: item.tamanho,
          sabores: item.sabores,
          borda: item.borda,
          recheioBorda: item.recheioBorda
        })
        totalPedido += precoPizza * item.quantidade
      }

      if (item.tipo === 'bebida') {
        const bebida = await prisma.bebida.findUnique({ where: { id: item.bebidaId } })
        if (bebida) totalPedido += bebida.precoFinal * item.quantidade
      }
    }

    const resultado = await criarPedidoService(
      {
        clienteId,
        centroDeCustoId,
        formaPagamento: formaPagamento || 'PIX',
        observacoes: observacoes || undefined,
        status: StatusPedido.SOLICITADO,
        itens: itensComQuantidade
      },
      req.user?.id || 0,
      req.ip || 'IP não identificado'
    )

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Registro de pedido',
        entidade: 'Pedido',
        entidadeId: resultado.pedido.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    logger.info('Pedido criado com sucesso')

    return res.status(201).json({
      mensagem: `Pedido registrado com sucesso por ${req.user?.perfil || 'sistema'}.`,
      pedido: resultado.pedido,
      total: totalPedido
    })
  } catch (erro) {
    logger.error('Erro ao registrar pedido:', erro)
    return res.status(500).json({ erro: 'Erro ao registrar pedido.', detalhes: erro })
  }
}

// Lista todos os pedidos (admin)
export async function listarPedidos(_req: Request, res: Response) {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        pizzas: {
          include: {
            insumos: {
              include: {
                insumo: true
              }
            }
          }
        },
        cliente: true,
        centroDeCusto: true
      }
    })
    return res.json(pedidos)
  } catch (erro) {
    console.error('Erro ao listar pedidos:', erro)
    return res.status(500).json({ erro: 'Erro ao listar pedidos.' })
  }
}

// Histórico do cliente autenticado
export async function listarPedidosDoCliente(req: Request, res: Response) {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        clienteId: req.user?.id,
        cliente: { ativo: true }
      },
      include: {
        pizzas: {
          include: {
            insumos: {
              include: {
                insumo: true
              }
            }
          }
        },
        centroDeCusto: true
      },
      orderBy: { criadoEm: 'desc' }
    })
    return res.json(pedidos)
  } catch (erro) {
    console.error('Erro ao listar pedidos do cliente:', erro)
    return res.status(500).json({ erro: 'Erro ao buscar seus pedidos.' })
  }
}
// Detalha pedido por ID
export async function detalharPedido(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        pizzas: {
          include: {
            insumos: {
              include: {
                insumo: true
              }
            }
          }
        },
        cliente: true,
        centroDeCusto: true
      }
    })

    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' })

    if (req.user?.perfil === 'cliente' && pedido.clienteId !== req.user?.id) {
      return res.status(403).json({ erro: 'Acesso negado ao pedido.' })
    }

    return res.json(pedido)
  } catch (erro) {
    console.error('Erro ao detalhar pedido:', erro)
    return res.status(500).json({ erro: 'Erro ao buscar pedido.' })
  }
}

// Atualiza status do pedido com auditoria
export async function atualizarStatusPedido(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { status } = req.body

  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })
  if (!Object.values(StatusPedido).includes(status)) {
    return res.status(400).json({ erro: 'Status inválido.' })
  }

  try {
    const pedido = await prisma.pedido.update({
      where: { id },
      data: { status }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: `Atualização de status para ${status}`,
        entidade: 'Pedido',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Status do pedido atualizado com sucesso.',
      pedido
    })
  } catch (erro) {
    console.error('Erro ao atualizar status do pedido:', erro)
    return res.status(500).json({ erro: 'Erro ao atualizar status.' })
  }
}

// Exclui pedido com auditoria
export async function excluirPedido(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    await prisma.pizzaPedido.deleteMany({ where: { pedidoId: id } })
    await prisma.bebidaPedido.deleteMany({ where: { pedidoId: id } })
    await prisma.pagamento.deleteMany({ where: { pedidoId: id } })
    await prisma.comprovante.deleteMany({ where: { pedidoId: id } })
    await prisma.entrega.deleteMany({ where: { pedidoId: id } })
    await prisma.avaliacao.deleteMany({ where: { pedidoId: id } })
    await prisma.movimentacaoFinanceira.deleteMany({ where: { pedidoId: id } })
    await prisma.pedidoItem.deleteMany({ where: { pedidoId: id } })
    await prisma.pedido.delete({ where: { id } })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Exclusão de pedido',
        entidade: 'Pedido',
        entidadeId: id,
        tipoOperacao: TipoOperacao.EXCLUSAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Pedido excluído com sucesso.' })
  } catch (erro) {
    console.error('Erro ao excluir pedido:', erro)
    return res.status(500).json({ erro: 'Erro ao excluir pedido.' })
  }
}
