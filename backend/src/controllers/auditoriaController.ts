import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import prisma from '../config/prisma'

export async function listarAuditorias(req: Request, res: Response) {
  const { entidade, tipoOperacao, usuario, de, ate } = req.query

  try {
    const auditorias = await prisma.auditoria.findMany({
      where: {
        entidade: entidade ? String(entidade) : undefined,
        tipoOperacao: tipoOperacao
          ? { equals: tipoOperacao as any }
          : undefined,
        usuario: usuario ? String(usuario) : undefined,
        dataHora: {
          gte: de ? new Date(String(de)) : undefined,
          lte: ate ? new Date(String(ate)) : undefined
        }
      },
      orderBy: { dataHora: 'desc' }
    })

    res.json(auditorias)
  } catch (erro) {
    console.error('Erro ao listar auditorias:', erro)
    res.status(500).json({ erro: 'Erro ao buscar auditorias.' })
  }
}
