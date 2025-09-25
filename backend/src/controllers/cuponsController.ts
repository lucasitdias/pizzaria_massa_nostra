import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

export async function criarCupom(req: Request, res: Response) {
  const { codigo, desconto, dataValidade } = req.body

  if (!codigo || !desconto) {
    return res.status(400).json({ erro: 'Código e desconto são obrigatórios.' })
  }

  try {
    const cupom = await prisma.cupom.create({
      data: {
        codigo,
        desconto,
        dataValidade: new Date(dataValidade),
        ativo: true
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Criação de cupom',
        entidade: 'Cupom',
        entidadeId: cupom.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({ mensagem: 'Cupom criado com sucesso.', cupom })
  } catch (erro) {
    console.error('Erro ao criar cupom:', erro)
    return res.status(500).json(erroPadrao('Erro ao criar cupom.', erro))
  }
}

export async function listarCupons(req: Request, res: Response) {
  try {
    const cupons = await prisma.cupom.findMany({
      where: { ativo: true },
      orderBy: { dataValidade: 'asc' }
    })

    return res.json({ cupons })
  } catch (erro) {
    console.error('Erro ao listar cupons:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar cupons.', erro))
  }
}

export async function desativarCupom(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const cupom = await prisma.cupom.update({
      where: { id },
      data: { ativo: false }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Desativação de cupom',
        entidade: 'Cupom',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Cupom desativado com sucesso.', cupom })
  } catch (erro) {
    console.error('Erro ao desativar cupom:', erro)
    return res.status(500).json(erroPadrao('Erro ao desativar cupom.', erro))
  }
}

export async function aplicarCupom(req: Request, res: Response) {
  const { codigo, pedidoId } = req.body

  if (!codigo || !pedidoId) {
    return res.status(400).json({ erro: 'Código do cupom e ID do pedido são obrigatórios.' })
  }

  try {
    const cupom = await prisma.cupom.findUnique({ where: { codigo } })

    if (!cupom || !cupom.ativo || new Date(cupom.dataValidade) < new Date()) {
      return res.status(400).json({ erro: 'Cupom inválido ou expirado.' })
    }

    const pedido = await prisma.pedido.update({
      where: { id: pedidoId },
      data: { cupomId: cupom.id }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: `Aplicação do cupom "${codigo}"`,
        entidade: 'Pedido',
        entidadeId: pedidoId,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Cupom aplicado com sucesso.', pedido })
  } catch (erro) {
    console.error('Erro ao aplicar cupom:', erro)
    return res.status(500).json(erroPadrao('Erro ao aplicar cupom.', erro))
  }
}
