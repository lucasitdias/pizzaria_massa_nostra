import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao, TipoFidelidade } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Acumula pontos por pedido
export async function acumularPontos(req: Request, res: Response) {
  const { clienteId, pedidoId, valorTotal } = req.body

  if (!clienteId || !pedidoId || !valorTotal) {
    return res.status(400).json({ erro: 'Cliente, pedido e valor são obrigatórios.' })
  }

  try {
    const pontos = Math.floor(valorTotal / 10)

    let fidelidade = await prisma.fidelidade.findFirst({
      where: { clienteId }
    })

    if (fidelidade) {
      fidelidade = await prisma.fidelidade.update({
        where: { id: fidelidade.id },
        data: { pontos: { increment: pontos } }
      })
    } else {
      fidelidade = await prisma.fidelidade.create({
        data: {
          cliente: { connect: { id: clienteId } },
          pontos,
          tipo: TipoFidelidade.ACUMULADO
        }
      })
    }

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: `Acúmulo de ${pontos} pontos`,
        entidade: 'Fidelidade',
        entidadeId: fidelidade.id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Pontos acumulados com sucesso.', fidelidade })
  } catch (erro) {
    console.error('Erro ao acumular pontos:', erro)
    return res.status(500).json(erroPadrao('Erro ao acumular pontos.', erro))
  }
}

// Consulta saldo de pontos
export async function consultarPontos(req: Request, res: Response) {
  const clienteId = Number(req.params.clienteId)
  if (isNaN(clienteId)) return res.status(400).json({ erro: 'ID do cliente inválido.' })

  try {
    const fidelidade = await prisma.fidelidade.findFirst({ where: { clienteId } })

    if (!fidelidade) return res.status(404).json({ erro: 'Cliente não possui pontos acumulados.' })

    return res.json({ pontos: fidelidade.pontos })
  } catch (erro) {
    console.error('Erro ao consultar pontos:', erro)
    return res.status(500).json(erroPadrao('Erro ao consultar pontos.', erro))
  }
}

// Resgata pontos por benefício
export async function resgatarPontos(req: Request, res: Response) {
  const { clienteId, pontosResgate } = req.body

  if (!clienteId || !pontosResgate || pontosResgate <= 0) {
    return res.status(400).json({ erro: 'Cliente e quantidade de pontos são obrigatórios.' })
  }

  try {
    const fidelidade = await prisma.fidelidade.findFirst({ where: { clienteId } })

    if (!fidelidade || fidelidade.pontos < pontosResgate) {
      return res.status(400).json({ erro: 'Pontos insuficientes para resgate.' })
    }

    const atualizado = await prisma.fidelidade.update({
      where: { id: fidelidade.id },
      data: { pontos: { decrement: pontosResgate } }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: `Resgate de ${pontosResgate} pontos`,
        entidade: 'Fidelidade',
        entidadeId: atualizado.id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Pontos resgatados com sucesso.', fidelidade: atualizado })
  } catch (erro) {
    console.error('Erro ao resgatar pontos:', erro)
    return res.status(500).json(erroPadrao('Erro ao resgatar pontos.', erro))
  }
}

// Lista recompensas disponíveis
export async function listarRecompensas(req: Request, res: Response) {
  try {
    const recompensas = await prisma.recompensa.findMany({
      where: { ativo: true },
      orderBy: { valorMinimo: 'asc' }
    })

    return res.json(recompensas)
  } catch (erro) {
    console.error('Erro ao listar recompensas:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar recompensas.', erro))
  }
}
