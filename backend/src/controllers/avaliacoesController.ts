import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client' // Enum importado
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Avaliações — Registrar avaliação de um pedido
export async function registrarAvaliacao(req: Request, res: Response) {
  const { pedidoId, nota, comentario } = req.body

  try {
    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } })

    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' })
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        pedidoId,
        nota,
        comentario: comentario?.trim() || null
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email ?? 'cliente',
        funcionarioId: req.user?.id ?? 0,
        acao: 'Registro de avaliação',
        entidade: 'Avaliacao',
        entidadeId: avaliacao.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip ?? 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Avaliação registrada com sucesso.',
      avaliacao
    })
  } catch (erro) {
    console.error('Erro ao registrar avaliação:', erro)
    return res.status(500).json(erroPadrao('Erro ao registrar avaliação.', erro))
  }
}

// Avaliações — Listar avaliações
export async function listarAvaliacoes(req: Request, res: Response) {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        pedido: {
          include: {
            cliente: true
          }
        }
      },
      orderBy: { id: 'desc' },
      take: 50
    })

    return res.json(avaliacoes)
  } catch (erro) {
    console.error('Erro ao listar avaliações:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar avaliações.', erro))
  }
}
