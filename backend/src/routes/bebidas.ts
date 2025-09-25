import express, { Router } from 'express'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { bebidasFixas } from '../data/bebidasFixas'
import { classificarBebida, calcularPrecoFinal } from '../services/regraPrecosBebidas'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()
const router = Router()
router.use(express.json())

// Cadastro inicial das bebidas fixas com auditoria
async function cadastrarBebidasFixas(): Promise<void> {
  try {
    for (const bebida of bebidasFixas) {
      const bebidaExistente = await prisma.bebida.findFirst({
        where: { nome: bebida.nome, volume: bebida.volume }
      })

      if (bebidaExistente) continue

      const classificada = classificarBebida(bebida)
      const precoFinal = calcularPrecoFinal(classificada, 30)

      const nova = await prisma.bebida.create({
        data: {
          nome: bebida.nome.trim(),
          volume: bebida.volume.trim(),
          tipo: classificada.tipo,
          embalagem: classificada.embalagem,
          precoFinal,
          ativo: true
        }
      })

      await prisma.auditoria.create({
        data: {
          usuario: 'sistema',
          funcionarioId: 0,
          acao: 'Cadastro inicial de bebida',
          entidade: 'Bebida',
          entidadeId: nova.id,
          tipoOperacao: TipoOperacao.CRIACAO,
          ipOrigem: '127.0.0.1',
          ativo: true
        }
      })
    }
  } catch (erro) {
    console.error('Erro ao cadastrar bebidas fixas:', erro)
  }
}

cadastrarBebidasFixas()

// Listar bebidas ativas
router.get('/bebidas', verificarToken, async (req, res) => {
  try {
    const bebidasAtivas = await prisma.bebida.findMany({ where: { ativo: true } })
    return res.json(bebidasAtivas)
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao listar bebidas.', erro))
  }
})

// Listar bebidas inativas (admin)
router.get('/inativas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const bebidasInativas = await prisma.bebida.findMany({ where: { ativo: false } })
    return res.json(bebidasInativas)
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao listar bebidas inativas.', erro))
  }
})

// Consultar bebida por ID
router.get('/bebidas/:id', verificarToken, async (req, res) => {
  const { id } = req.params
  try {
    const bebida = await prisma.bebida.findFirst({
      where: { id: Number(id), ativo: true }
    })

    if (!bebida) {
      return res.status(404).json({ erro: 'Bebida não encontrada ou inativa.' })
    }

    return res.json(bebida)
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao consultar bebida.', erro))
  }
})

// Atualizar bebida por ID com auditoria
router.put('/bebidas/:id', verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params
  const { nome, volume } = req.body

  if (!nome || !volume) {
    return res.status(400).json({ erro: 'Nome e volume são obrigatórios para atualização.' })
  }

  try {
    const bebidaExistente = await prisma.bebida.findUnique({ where: { id: Number(id) } })

    if (!bebidaExistente) {
      return res.status(404).json({ erro: 'Bebida não encontrada.' })
    }

    const bebidaAtualizada = await prisma.bebida.update({
      where: { id: Number(id) },
      data: {
        nome: nome.trim(),
        volume: volume.trim()
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email ?? 'sistema',
        funcionarioId: req.user?.id ?? 0,
        acao: 'Atualização de bebida',
        entidade: 'Bebida',
        entidadeId: bebidaAtualizada.id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip ?? 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Bebida atualizada com sucesso.',
      bebida: bebidaAtualizada
    })
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao atualizar bebida.', erro))
  }
})


// Desativar bebida com auditoria
router.patch('/bebidas/:id/desativar', verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const bebida = await prisma.bebida.findFirst({
      where: { id: Number(id), ativo: true }
    })

    if (!bebida) {
      return res.status(404).json({ erro: 'Bebida não encontrada ou já inativa.' })
    }

    await prisma.bebida.update({
      where: { id: Number(id) },
      data: { ativo: false }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email ?? 'sistema',
        funcionarioId: req.user?.id ?? 0,
        acao: 'Desativação de bebida',
        entidade: 'Bebida',
        entidadeId: Number(id),
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip ?? 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Bebida desativada com sucesso.',
      bebida: await prisma.bebida.findUnique({ where: { id: Number(id) } })
    })
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao desativar bebida.', erro))
  }
})

// Reativar bebida com auditoria
router.patch('/bebidas/:id/reativar', verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const bebida = await prisma.bebida.findUnique({ where: { id: Number(id) } })

    if (!bebida || bebida.ativo) {
      return res.status(404).json({ erro: 'Bebida não encontrada ou já ativa.' })
    }

    await prisma.bebida.update({
      where: { id: Number(id) },
      data: { ativo: true }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email ?? 'sistema',
        funcionarioId: req.user?.id ?? 0,
        acao: 'Reativação de bebida',
        entidade: 'Bebida',
        entidadeId: Number(id),
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip ?? 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Bebida reativada com sucesso.',
      bebida: await prisma.bebida.findUnique({ where: { id: Number(id) } })
    })
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao reativar bebida.', erro))
  }
})

// Excluir bebida com auditoria
router.delete('/bebidas/:id', verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const bebida = await prisma.bebida.findUnique({ where: { id: Number(id) } })

    if (!bebida) {
      return res.status(404).json({ erro: 'Bebida não encontrada.' })
    }

    await prisma.bebida.delete({ where: { id: Number(id) } })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email ?? 'sistema',
        funcionarioId: req.user?.id ?? 0,
        acao: 'Exclusão de bebida',
        entidade: 'Bebida',
        entidadeId: Number(id),
        tipoOperacao: TipoOperacao.EXCLUSAO,
        ipOrigem: req.ip ?? 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Bebida excluída com sucesso.' })
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao excluir bebida.', erro))
  }
})

// Filtrar bebidas por tipo, nome ou embalagem
router.get('/filtro', verificarToken, async (req, res) => {
  const { tipo, nome, embalagem } = req.query

  try {
    const bebidas = await prisma.bebida.findMany({
      where: {
        ativo: true,
        ...(tipo && { tipo: { equals: String(tipo) } }),
        ...(embalagem && { embalagem: { equals: String(embalagem) } }),
        ...(nome && { nome: { contains: String(nome), mode: 'insensitive' } })
      }
    })

    return res.json(bebidas)
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao filtrar bebidas.', erro))
  }
})

// Atualizar preços das bebidas com auditoria
router.put('/atualizar-precos', verificarToken, verificarAdmin, async (req, res) => {
  const margemLucroPadrao = 30

  try {
    const bebidas = await prisma.bebida.findMany({ where: { ativo: true } })

    for (const bebida of bebidas) {
      const classificada = classificarBebida({
        nome: bebida.nome,
        volume: bebida.volume
      })

      const novoPreco = calcularPrecoFinal(classificada, margemLucroPadrao)

      await prisma.bebida.update({
        where: { id: bebida.id },
        data: { precoFinal: novoPreco }
      })

      await prisma.auditoria.create({
        data: {
          usuario: req.user?.email ?? 'sistema',
          funcionarioId: req.user?.id ?? 0,
          acao: 'Atualização de preço de bebida',
          entidade: 'Bebida',
          entidadeId: bebida.id,
          tipoOperacao: TipoOperacao.ATUALIZACAO,
          ipOrigem: req.ip ?? 'IP não identificado',
          ativo: true
        }
      })
    }

    return res.json({ mensagem: 'Preços atualizados com sucesso!' })
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao atualizar preços.', erro))
  }
})

// Aplicar promoção por tipo com auditoria
router.put('/promocao', verificarToken, verificarAdmin, async (req, res) => {
  const { tipo, desconto } = req.body

  if (!tipo || !desconto) {
    return res.status(400).json({ erro: 'Tipo e desconto são obrigatórios.' })
  }

  try {
    const bebidas = await prisma.bebida.findMany({ where: { tipo, ativo: true } })

    for (const bebida of bebidas) {
      const novoPreco = +(bebida.precoFinal * (1 - desconto / 100)).toFixed(2)

      await prisma.bebida.update({
        where: { id: bebida.id },
        data: { precoFinal: novoPreco }
      })

      await prisma.auditoria.create({
        data: {
          usuario: req.user?.email ?? 'sistema',
          funcionarioId: req.user?.id ?? 0,
          acao: `Aplicação de promoção (${desconto}% off)`,
          entidade: 'Bebida',
          entidadeId: bebida.id,
          tipoOperacao: TipoOperacao.ATUALIZACAO,
          ipOrigem: req.ip ?? 'IP não identificado',
          ativo: true
        }
      })
    }

    return res.json({ mensagem: `Promoção aplicada: ${desconto}% off em ${tipo}` })
  } catch (erro) {
    return res.status(500).json(erroPadrao('Erro ao aplicar promoção.', erro))
  }
})

export default router
