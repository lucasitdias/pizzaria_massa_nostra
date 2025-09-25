import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Registra comprovante de pagamento
export async function registrarComprovante(req: Request, res: Response) {
  const pedidoId = Number(req.body.pedidoId)
  if (isNaN(pedidoId)) return res.status(400).json({ erro: 'ID do pedido inválido.' })

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        cliente: true,
        itens: {
          include: {
            pizza: true,
            bebida: true
          }
        }
      }
    })

    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' })

    const comprovante = {
      pedidoId: pedido.id,
      cliente: pedido.cliente?.nomeCompleto || 'Cliente não identificado',
      data: pedido.criadoEm,
      formaPagamento: pedido.formaPagamento,
      observacoes: pedido.observacoes,
      valorOriginal: Number(pedido.valorFinal),
      valorTotal: Number(pedido.valorTotal),
      itens: pedido.itens.map((item: any) => ({
        quantidade: item.quantidade,
        produto: item.pizza?.nome || item.bebida?.nome || 'Item desconhecido',
        tipo: item.pizza ? 'Pizza' : item.bebida ? 'Bebida' : 'Outro'
      }))
    }

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Emissão de comprovante',
        entidade: 'Pedido',
        entidadeId: pedidoId,
        tipoOperacao: TipoOperacao.LEITURA,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({ mensagem: 'Comprovante registrado com sucesso.', comprovante })
  } catch (erro) {
    console.error('Erro ao registrar comprovante:', erro)
    return res.status(500).json(erroPadrao('Erro ao registrar comprovante.', erro))
  }
}

// Lista comprovantes por pedido
export async function listarComprovantesPorPedido(req: Request, res: Response) {
  const pedidoId = Number(req.params.pedidoId)
  if (isNaN(pedidoId)) return res.status(400).json({ erro: 'ID do pedido inválido.' })

  try {
    const auditorias = await prisma.auditoria.findMany({
      where: {
        entidade: 'Pedido',
        entidadeId: pedidoId,
        acao: 'Emissão de comprovante'
      },
      orderBy: { dataHora: 'desc' }
    })

    return res.json({ comprovantes: auditorias })
  } catch (erro) {
    console.error('Erro ao listar comprovantes por pedido:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar comprovantes por pedido.', erro))
  }
}

// Exclui comprovante (admin)
export async function excluirComprovante(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID do comprovante inválido.' })

  try {
    const excluido = await prisma.auditoria.delete({
      where: { id }
    })

    return res.json({ mensagem: 'Comprovante excluído com sucesso.', comprovante: excluido })
  } catch (erro) {
    console.error('Erro ao excluir comprovante:', erro)
    return res.status(500).json(erroPadrao('Erro ao excluir comprovante.', erro))
  }
}
