import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'
import { pizzaSchema } from '../schemas/pizzaSchema'

const prisma = new PrismaClient()

export async function criarPizza(req: Request, res: Response) {
  const resultado = pizzaSchema.safeParse(req.body)
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  const dados = resultado.data

  try {
    const pizzaCriada = await prisma.pizza.create({
      data: {
        ...dados,
        nome: dados.nome.trim(),
        ativo: true
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Criação de pizza',
        entidade: 'Pizza',
        entidadeId: pizzaCriada.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Pizza criada com sucesso.',
      pizza: pizzaCriada
    })
  } catch (erro) {
    console.error('Erro ao criar pizza:', erro)
    return res.status(500).json(erroPadrao('Erro ao criar pizza.', erro))
  }
}

export async function listarPizzas(_req: Request, res: Response) {
  try {
    const pizzas = await prisma.pizza.findMany({ where: { ativo: true } })
    return res.json(pizzas)
  } catch (erro) {
    console.error('Erro ao listar pizzas:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar pizzas.', erro))
  }
}

export async function consultarPizza(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const pizza = await prisma.pizza.findUnique({ where: { id } })
    if (!pizza) return res.status(404).json({ erro: 'Pizza não encontrada.' })

    return res.json(pizza)
  } catch (erro) {
    console.error('Erro ao consultar pizza:', erro)
    return res.status(500).json(erroPadrao('Erro ao consultar pizza.', erro))
  }
}

export async function atualizarPizza(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  const resultado = pizzaSchema.safeParse(req.body)
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  const dados = resultado.data

  try {
    const pizzaAtualizada = await prisma.pizza.update({
      where: { id },
      data: {
        ...dados,
        nome: dados.nome.trim()
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Atualização de pizza',
        entidade: 'Pizza',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Pizza atualizada com sucesso.',
      pizza: pizzaAtualizada
    })
  } catch (erro) {
    console.error('Erro ao atualizar pizza:', erro)
    return res.status(500).json(erroPadrao('Erro ao atualizar pizza.', erro))
  }
}

export async function desativarPizza(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const pizza = await prisma.pizza.update({
      where: { id },
      data: { ativo: false }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Desativação de pizza',
        entidade: 'Pizza',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Pizza desativada com sucesso.',
      pizza
    })
  } catch (erro) {
    console.error('Erro ao desativar pizza:', erro)
    return res.status(500).json(erroPadrao('Erro ao desativar pizza.', erro))
  }
}

export async function reativarPizza(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const pizza = await prisma.pizza.update({
      where: { id },
      data: { ativo: true }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Reativação de pizza',
        entidade: 'Pizza',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Pizza reativada com sucesso.',
      pizza
    })
  } catch (erro) {
    console.error('Erro ao reativar pizza:', erro)
    return res.status(500).json(erroPadrao('Erro ao reativar pizza.', erro))
  }
}

export async function excluirPizza(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    await prisma.pizza.delete({ where: { id } })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Exclusão de pizza',
        entidade: 'Pizza',
        entidadeId: id,
        tipoOperacao: TipoOperacao.EXCLUSAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Pizza excluída com sucesso.' })
  } catch (erro) {
    console.error('Erro ao excluir pizza:', erro)
    return res.status(500).json(erroPadrao('Erro ao excluir pizza.', erro))
  }
}

export async function filtrarPizzas(req: Request, res: Response) {
  const { tipo, tamanho, ingrediente } = req.query

  try {
    const pizzas = await prisma.pizza.findMany({
      where: {
        ativo: true,
        ...(tipo && { tipo: { equals: String(tipo) } }),
        ...(tamanho && { tamanho: { equals: String(tamanho) } }),
        ...(ingrediente && {
          ingredientes: {
            has: String(ingrediente)
          }
        })
      }
    })

    return res.json(pizzas)
  } catch (erro) {
    console.error('Erro ao filtrar pizzas:', erro)
    return res.status(500).json(erroPadrao('Erro ao filtrar pizzas.', erro))
  }
}
