import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Registrar novo chamado
export async function registrarChamado(req: Request, res: Response) {
  const { titulo, descricao, prioridade } = req.body

  if (!titulo || !descricao) {
    return res.status(400).json({ erro: 'Título e descrição são obrigatórios.' })
  }

  try {
    const chamado = await prisma.chamado.create({
      data: {
        titulo,
        descricao,
        prioridade: prioridade || 'média',
        usuarioId: req.user?.id || 0,
        status: 'aberto'
      }
    })

    return res.status(201).json(chamado)
  } catch (erro) {
    console.error('Erro ao registrar chamado:', erro)
    return res.status(500).json({ erro: 'Erro ao registrar chamado.' })
  }
}

// Listar chamados do usuário
export async function listarChamados(req: Request, res: Response) {
  try {
    const chamados = await prisma.chamado.findMany({
      where: { usuarioId: req.user?.id || 0 }
    })

    return res.json(chamados)
  } catch (erro) {
    console.error('Erro ao listar chamados:', erro)
    return res.status(500).json({ erro: 'Erro ao listar chamados.' })
  }
}

// Responder chamado
export async function responderChamado(req: Request, res: Response) {
  const { id } = req.params
  const { resposta } = req.body

  if (!resposta) {
    return res.status(400).json({ erro: 'Resposta é obrigatória.' })
  }

  try {
    const chamado = await prisma.chamado.update({
      where: { id: Number(id) },
      data: {
        resposta,
        status: 'respondido'
      }
    })

    return res.json(chamado)
  } catch (erro) {
    console.error('Erro ao responder chamado:', erro)
    return res.status(500).json({ erro: 'Erro ao responder chamado.' })
  }
}

// Fechar chamado
export async function fecharChamado(req: Request, res: Response) {
  const { id } = req.params

  try {
    const chamado = await prisma.chamado.update({
      where: { id: Number(id) },
      data: { status: 'fechado' }
    })

    return res.json({ mensagem: 'Chamado fechado com sucesso.', chamado })
  } catch (erro) {
    console.error('Erro ao fechar chamado:', erro)
    return res.status(500).json({ erro: 'Erro ao fechar chamado.' })
  }
}
