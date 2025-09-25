import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoNotificacao, TipoOperacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Enviar notificação (admin)
// Requer: titulo, mensagem, destinatario Id

export async function enviarNotificacao(req: Request, res: Response) {
  const { titulo, mensagem, destinatarioId, tipo } = req.body

  if (!titulo || !mensagem || !destinatarioId) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: titulo, mensagem, destinatarioId.'
    })
  }

  try {
    const notificacao = await prisma.notificacao.create({
      data: {
        titulo: titulo.trim(),
        mensagem: mensagem.trim(),
        tipo: tipo || TipoNotificacao.sistema,
        destino: null,
        agendadaPara: null,
        criadoEm: new Date(),
        destinatarioId,
        lida: false
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Envio de notificacao',
        entidade: 'Notificacao',
        entidadeId: notificacao.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Notificação enviada com sucesso.',
      notificacao
    })
  } catch (erro) {
    console.error('Erro ao enviar notificação:', erro)
    return res.status(500).json(erroPadrao('Erro ao enviar notificação.', erro))
  }
}

// Listar notificações do usuário autenticado

export async function listarNotificacoes(req: Request, res: Response) {
  const usuarioId = req.user?.id

  try {
    const notificacoes = await prisma.notificacao.findMany({
      where: { destinatarioId: usuarioId },
      orderBy: { criadoEm: 'desc' }
    })

    return res.json(notificacoes)
  } catch (erro) {
    console.error('Erro ao listar notificações:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar notificações.', erro))
  }
}

// Marcar notificação como lida

export async function marcarComoLida(req: Request, res: Response) {
  const id = Number(req.params.id)
  const usuarioId = req.user?.id

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' })
  }

  try {
    const notificacao = await prisma.notificacao.findUnique({ where: { id } })

    if (!notificacao || notificacao.destinatarioId !== usuarioId) {
      return res.status(404).json({ erro: 'Notificação não encontrada ou acesso negado.' })
    }

    const atualizada = await prisma.notificacao.update({
      where: { id },
      data: { lida: true }
    })

    return res.json({
      mensagem: 'Notificação marcada como lida.',
      notificacao: atualizada
    })
  } catch (erro) {
    console.error('Erro ao marcar notificação como lida:', erro)
    return res.status(500).json(erroPadrao('Erro ao marcar notificação como lida.', erro))
  }
}
