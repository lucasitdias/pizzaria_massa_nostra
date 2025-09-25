import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao, StatusCotacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Gera cotação de pedido com itens e campanha opcional
export async function criarCotacao(req: Request, res: Response) {
  const { itens, campanhaId } = req.body

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'Itens do pedido são obrigatórios.' })
  }

  try {
    let valorOriginal = 0

    for (const item of itens) {
      if (item.pizzaId) {
        const pizza = await prisma.pizza.findUnique({ where: { id: item.pizzaId } })
        if (!pizza) return res.status(404).json({ erro: `Pizza ID ${item.pizzaId} não encontrada.` })
        valorOriginal += pizza.preco * item.quantidade
      }

      if (item.bebidaId) {
        const bebida = await prisma.bebida.findUnique({ where: { id: item.bebidaId } })
        if (!bebida) return res.status(404).json({ erro: `Bebida ID ${item.bebidaId} não encontrada.` })
        valorOriginal += bebida.precoFinal * item.quantidade
      }
    }

    let valorFinal = valorOriginal
    let campanhaAplicada = null

    if (campanhaId) {
      const campanha = await prisma.campanha.findUnique({ where: { id: campanhaId } })
      if (!campanha || !campanha.ativo) {
        return res.status(400).json({ erro: 'Campanha inválida ou inativa.' })
      }

      campanhaAplicada = campanha

      if (campanha.percentual) {
        valorFinal = valorOriginal * (1 - campanha.percentual / 100)
      } else if (campanha.valor !== null) {
        valorFinal = valorOriginal - campanha.valor
      }

      if (valorFinal < 0) valorFinal = 0
    }

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Cotação de pedido',
        entidade: 'Cotacao',
        entidadeId: 0,
        tipoOperacao: TipoOperacao.LEITURA,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      valorOriginal,
      valorFinal,
      campanha: campanhaAplicada ? {
        id: campanhaAplicada.id,
        nome: campanhaAplicada.nome
      } : null
    })
  } catch (erro) {
    console.error('Erro ao gerar cotação:', erro)
    return res.status(500).json(erroPadrao('Erro ao gerar cotação.', erro))
  }
}

// Lista todas as cotações
export async function listarCotacoes(req: Request, res: Response) {
  try {
    const cotacoes = await prisma.cotacao.findMany({
      orderBy: { dataSolicitacao: 'desc' },
      include: {
        fornecedor: true
      }
    })

    return res.json(cotacoes)
  } catch (erro) {
    console.error('Erro ao listar cotações:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar cotações.', erro))
  }
}

// Fornecedor responde cotação
export async function responderCotacao(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { observacoes } = req.body

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' })
  }

  try {
    const cotacao = await prisma.cotacao.update({
      where: { id },
      data: {
        observacoes,
        dataResposta: new Date(),
        status: StatusCotacao.RESPONDIDA
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'fornecedor',
        funcionarioId: req.user?.id || 0,
        acao: 'Resposta de cotação',
        entidade: 'Cotacao',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Cotação respondida com sucesso.', cotacao })
  } catch (erro) {
    console.error('Erro ao responder cotação:', erro)
    return res.status(500).json(erroPadrao('Erro ao responder cotação.', erro))
  }
}

// Cancela cotação
export async function cancelarCotacao(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const cotacao = await prisma.cotacao.update({
      where: { id },
      data: {
        status: StatusCotacao.CANCELADA
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'admin',
        funcionarioId: req.user?.id || 0,
        acao: 'Cancelamento de cotação',
        entidade: 'Cotacao',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Cotação cancelada com sucesso.', cotacao })
  } catch (erro) {
    console.error('Erro ao cancelar cotação:', erro)
    return res.status(500).json(erroPadrao('Erro ao cancelar cotação.', erro))
  }
}
