import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import prisma from '../prisma/prisma'
import { TipoOperacao } from '@prisma/client'

// Listar Campanhas
export async function listarCampanhas(req: Request, res: Response) {
  try {
    const campanhas = await prisma.campanha.findMany({
      where: { ativo: true },
      orderBy: { dataInicio: 'desc' }
    })
    res.json(campanhas)
  } catch (erro) {
    console.error('Erro ao listar campanhas:', erro)
    res.status(500).json({ erro: 'Erro ao listar campanhas.' })
  }
}

// Buscar Campanhas/:id
export async function buscarCampanhaPorId(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const campanha = await prisma.campanha.findUnique({ where: { id } })
    if (!campanha) return res.status(404).json({ erro: 'Campanha não encontrada.' })
    res.json(campanha)
  } catch (erro) {
    console.error('Erro ao buscar campanha:', erro)
    res.status(500).json({ erro: 'Erro ao buscar campanha.' })
  }
}

// Criar Campanhas
export async function criarCampanha(req: Request, res: Response) {
  try {
    const novaCampanha = await prisma.campanha.create({
      data: req.body
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'admin',
        funcionarioId: req.user?.id || 0,
        entidade: 'Campanha',
        entidadeId: novaCampanha.id,
        acao: 'Criação de campanha',
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    res.status(201).json(novaCampanha)
  } catch (erro) {
    console.error('Erro ao criar campanha:', erro)
    res.status(500).json({ erro: 'Erro ao criar campanha.' })
  }
}

// Atualizar campanhas/:id
export async function atualizarCampanha(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const campanhaAtualizada = await prisma.campanha.update({
      where: { id },
      data: req.body
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'admin',
        funcionarioId: req.user?.id || 0,
        entidade: 'Campanha',
        entidadeId: id,
        acao: 'Atualização de campanha',
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    res.json(campanhaAtualizada)
  } catch (erro) {
    console.error('Erro ao atualizar campanha:', erro)
    res.status(500).json({ erro: 'Erro ao atualizar campanha.' })
  }
}

// Desativar campanhas/:id/desativar
export async function desativarCampanha(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const campanha = await prisma.campanha.update({
      where: { id },
      data: { ativo: false }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'admin',
        funcionarioId: req.user?.id || 0,
        entidade: 'Campanha',
        entidadeId: id,
        acao: 'Desativação de campanha',
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    res.json({ mensagem: 'Campanha desativada com sucesso.', campanha })
  } catch (erro) {
    console.error('Erro ao desativar campanha:', erro)
    res.status(500).json({ erro: 'Erro ao desativar campanha.' })
  }
}

// Aplicar campanhas/aplicar
export async function aplicarCampanhaEmPedido(req: Request, res: Response) {
  try {
    const { campanhaId, pedidoId } = req.body
    const hoje = new Date()

    const campanha = await prisma.campanha.findUnique({ where: { id: campanhaId } })
    if (!campanha || !campanha.ativo) {
      return res.status(400).json({ erro: 'Campanha inválida ou inativa.' })
    }

    if (hoje < campanha.dataInicio || hoje > campanha.dataFim) {
      return res.status(400).json({ erro: 'Campanha fora do período válido.' })
    }

    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } })
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' })

    const valorFinal = campanha.percentual
      ? pedido.valorTotal * (1 - campanha.percentual / 100)
      : pedido.valorTotal - (campanha.valor ?? 0)

    await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        valorFinal,
        campanhaId
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        entidade: 'Pedido',
        entidadeId: pedido.id,
        acao: `Aplicou campanha ${campanha.nome} no pedido ${pedido.id}`,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    res.json({ sucesso: true, valorFinal })
  } catch (erro) {
    console.error('Erro ao aplicar campanha:', erro)
    res.status(500).json({ erro: 'Erro ao aplicar campanha.' })
  }
}
