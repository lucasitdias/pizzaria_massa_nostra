import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Registra pagamento de pedido
export async function registrarPagamento(req: Request, res: Response) {
  const { pedidoId, formaPagamento, valorPago } = req.body

  if (!pedidoId || !formaPagamento || typeof valorPago !== 'number') {
    return res.status(400).json({ erro: 'Pedido, forma de pagamento e valor são obrigatórios.' })
  }

  try {
    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } })
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' })

    const pagamento = await prisma.pagamento.create({
      data: {
        pedidoId,
        formaPagamento,
        valorPago,
        valor: pedido.valorTotal || valorPago,
        status: 'APROVADO', // valor do enum StatusPagamento
        pagoEm: new Date()
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Registro de pagamento',
        entidade: 'Pagamento',
        entidadeId: pagamento.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Pagamento registrado com sucesso.',
      pagamento
    })
  } catch (erro) {
    console.error('Erro ao registrar pagamento:', erro)
    return res.status(500).json(erroPadrao('Erro ao registrar pagamento.', erro))
  }
}

// Consulta pagamento por pedido
export async function consultarPagamento(req: Request, res: Response) {
  const pedidoId = Number(req.params.pedidoId)
  if (isNaN(pedidoId)) return res.status(400).json({ erro: 'ID do pedido inválido.' })

  try {
    const pagamento = await prisma.pagamento.findFirst({
      where: { pedidoId }
    })

    if (!pagamento) return res.status(404).json({ erro: 'Pagamento não encontrado para este pedido.' })

    return res.json(pagamento)
  } catch (erro) {
    console.error('Erro ao consultar pagamento:', erro)
    return res.status(500).json(erroPadrao('Erro ao consultar pagamento.', erro))
  }
}
