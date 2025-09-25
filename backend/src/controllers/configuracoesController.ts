import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Lista todas as configurações
export async function listarConfiguracoes(req: Request, res: Response) {
  try {
    const configuracoes = await prisma.configuracao.findMany({
      orderBy: { chave: 'asc' }
    })

    const resultado = configuracoes.reduce((acc, item) => {
      acc[item.chave] = item.valor
      return acc
    }, {} as Record<string, string>)

    return res.json(resultado)
  } catch (erro) {
    console.error('Erro ao listar configurações:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar configurações.', erro))
  }
}

// Atualiza configurações por chave
export async function atualizarConfiguracoes(req: Request, res: Response) {
  const dados = req.body

  try {
    const atualizadas = []

    for (const chave in dados) {
      const valor = String(dados[chave])

      const config = await prisma.configuracao.upsert({
        where: { chave },
        update: { valor },
        create: { chave, valor }
      })

      atualizadas.push(config)
    }

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'admin',
        funcionarioId: req.user?.id || 0,
        acao: 'Atualização de configurações',
        entidade: 'Configuracao',
        entidadeId: 0,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Configurações atualizadas com sucesso.',
      configuracoes: atualizadas
    })
  } catch (erro) {
    console.error('Erro ao atualizar configurações:', erro)
    return res.status(500).json(erroPadrao('Erro ao atualizar configurações.', erro))
  }
}
