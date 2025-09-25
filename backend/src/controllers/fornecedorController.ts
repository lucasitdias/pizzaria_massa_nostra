import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { erroPadrao, validarEmail } from '../validations/validadores'
import { fornecedorSchema } from '../schemas/fornecedorSchema'

const prisma = new PrismaClient()

// Lista todos os fornecedores ativos
export async function listarFornecedores(req: Request, res: Response) {
  try {
    const fornecedores = await prisma.fornecedor.findMany({
      where: { ativo: true },
      orderBy: { nomeCompleto: 'asc' } // campo de ordenação
    })

    return res.json(fornecedores)
  } catch (erro) {
    console.error('Erro ao listar fornecedores:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar fornecedores.', erro))
  }
}

// Cria novo fornecedor
export async function criarFornecedor(req: Request, res: Response) {
  const dados = req.body

  const resultado = fornecedorSchema.safeParse(dados)
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  if (!validarEmail(dados.email)) {
    return res.status(400).json({ erro: 'E-mail inválido.' })
  }

  const duplicado = await prisma.fornecedor.findFirst({
    where: {
      OR: [
        { cnpj: dados.cnpj },
        { email: dados.email }
      ]
    }
  })

  if (duplicado) {
    return res.status(409).json({ erro: 'Fornecedor já cadastrado com este CNPJ ou e-mail.' })
  }

  try {
    const novoFornecedor = await prisma.fornecedor.create({ data: dados })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Criação de fornecedor',
        entidade: 'Fornecedor',
        entidadeId: novoFornecedor.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Fornecedor criado com sucesso.',
      fornecedor: novoFornecedor
    })
  } catch (erro) {
    console.error('Erro ao criar fornecedor:', erro)
    return res.status(500).json(erroPadrao('Erro ao criar fornecedor.', erro))
  }
}

// Consulta fornecedor por ID
export async function consultarFornecedor(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const fornecedor = await prisma.fornecedor.findUnique({ where: { id } })
    if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado.' })

    return res.json(fornecedor)
  } catch (erro) {
    console.error('Erro ao consultar fornecedor:', erro)
    return res.status(500).json(erroPadrao('Erro ao consultar fornecedor.', erro))
  }
}

// Atualiza dados do fornecedor
export async function atualizarFornecedor(req: Request, res: Response) {
  const id = Number(req.params.id)
  const dados = req.body

  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  const resultado = fornecedorSchema.safeParse(dados)
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  if (!validarEmail(dados.email)) {
    return res.status(400).json({ erro: 'E-mail inválido.' })
  }

  try {
    const fornecedorAtualizado = await prisma.fornecedor.update({
      where: { id },
      data: dados
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Atualização de fornecedor',
        entidade: 'Fornecedor',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Fornecedor atualizado com sucesso.',
      fornecedor: fornecedorAtualizado
    })
  } catch (erro) {
    console.error('Erro ao atualizar fornecedor:', erro)
    return res.status(500).json(erroPadrao('Erro ao atualizar fornecedor.', erro))
  }
}

// ✅ Desativa fornecedor
export async function desativarFornecedor(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const fornecedor = await prisma.fornecedor.update({
      where: { id },
      data: { ativo: false }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Desativação de fornecedor',
        entidade: 'Fornecedor',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Fornecedor desativado com sucesso.',
      fornecedor
    })
  } catch (erro) {
    console.error('Erro ao desativar fornecedor:', erro)
    return res.status(500).json(erroPadrao('Erro ao desativar fornecedor.', erro))
  }
}

// Reativa fornecedor
export async function reativarFornecedor(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const fornecedor = await prisma.fornecedor.update({
      where: { id },
      data: { ativo: true }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Reativação de fornecedor',
        entidade: 'Fornecedor',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Fornecedor reativado com sucesso.',
      fornecedor
    })
  } catch (erro) {
    console.error('Erro ao reativar fornecedor:', erro)
    return res.status(500).json(erroPadrao('Erro ao reativar fornecedor.', erro))
  }
}
