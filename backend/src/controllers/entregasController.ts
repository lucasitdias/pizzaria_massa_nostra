import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao, StatusEntrega } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Lista todas as entregas
export async function listarEntregas(req: Request, res: Response) {
  try {
    const entregas = await prisma.entrega.findMany({
      orderBy: { dataRegistro: 'desc' },
      include: { pedido: true }
    })

    return res.json(entregas)
  } catch (erro) {
    console.error('Erro ao listar entregas:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar entregas.', erro))
  }
}

// Registra entrega de pedido
export async function registrarEntrega(req: Request, res: Response) {
  const { pedidoId, entregador, endereco, observacoes } = req.body

  if (!pedidoId || !entregador || !endereco) {
    return res.status(400).json({ erro: 'Pedido, entregador e endereço são obrigatórios.' })
  }

  try {
    const entrega = await prisma.entrega.create({
      data: {
        pedido: { connect: { id: pedidoId } },
        entregador,
        endereco,
        observacoes,
        status: StatusEntrega.PENDENTE,
        dataRegistro: new Date()
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Registro de entrega',
        entidade: 'Entrega',
        entidadeId: entrega.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({ mensagem: 'Entrega registrada com sucesso.', entrega })
  } catch (erro) {
    console.error('Erro ao registrar entrega:', erro)
    return res.status(500).json(erroPadrao('Erro ao registrar entrega.', erro))
  }
}

// Atualiza status da entrega
export async function atualizarEntrega(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { status } = req.body

  if (isNaN(id) || !status) {
    return res.status(400).json({ erro: 'ID e novo status são obrigatórios.' })
  }

  try {
    const entrega = await prisma.entrega.update({
      where: { id },
      data: { status }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: `Atualização de status para "${status}"`,
        entidade: 'Entrega',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Status atualizado com sucesso.', entrega })
  } catch (erro) {
    console.error('Erro ao atualizar status da entrega:', erro)
    return res.status(500).json(erroPadrao('Erro ao atualizar status da entrega.', erro))
  }
}

// Cancela entrega
export async function cancelarEntrega(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const entrega = await prisma.entrega.update({
      where: { id },
      data: { status: StatusEntrega.CANCELADA }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Cancelamento de entrega',
        entidade: 'Entrega',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Entrega cancelada com sucesso.', entrega })
  } catch (erro) {
    console.error('Erro ao cancelar entrega:', erro)
    return res.status(500).json(erroPadrao('Erro ao cancelar entrega.', erro))
  }
}
