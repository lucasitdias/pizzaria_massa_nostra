import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { centroDeCustoSchema } from '../schemas/centroDeCustoSchema'
import { erroPadrao } from '../validations/validadores'
import { CentroDeCustoService } from '../services/centroDeCustoService'

const prisma = new PrismaClient()
const service = new CentroDeCustoService()

// Cria novo centro de custo com validação e auditoria
export async function criarCentroDeCusto(req: Request, res: Response) {
  const dados = req.body

  const resultado = centroDeCustoSchema.safeParse(dados)
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  try {
    const novoCentro = await service.criar(dados)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Criação de centro de custo',
        entidade: 'CentroDeCusto',
        entidadeId: novoCentro.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({ mensagem: 'Centro de custo criado com sucesso.', centro: novoCentro })
  } catch (erro) {
    console.error('Erro ao criar centro de custo:', erro)
    return res.status(500).json(erroPadrao('Erro ao criar centro de custo.', erro))
  }
}

// Lista todos os centros de custo ativos
export async function listarCentrosDeCusto(req: Request, res: Response) {
  try {
    const centros = await service.listarAtivos()
    return res.json(centros)
  } catch (erro) {
    console.error('Erro ao listar centros de custo:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar centros de custo.', erro))
  }
}
