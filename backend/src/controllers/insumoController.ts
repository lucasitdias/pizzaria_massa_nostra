import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { InsumoService } from '../services/insumoService'
import { validarInsumo } from '../validations/validadoresInsumo'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()
const insumoService = new InsumoService()

// Cria novo insumo com validação e auditoria
export async function criarInsumo(req: Request, res: Response) {
  const dados = req.body

  const erroValidacao = validarInsumo(dados)
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao })
  }

  try {
    const duplicado = await insumoService.verificarDuplicado(dados.nome, dados.unidadeMedida)
    if (duplicado) {
      return res.status(409).json({ erro: 'Insumo já cadastrado com este nome e unidade.' })
    }

    const insumoCriado = await insumoService.criar(dados)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Criação de insumo',
        entidade: 'Insumo',
        entidadeId: insumoCriado.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Insumo criado com sucesso.',
      insumo: insumoCriado
    })
  } catch (erro) {
    console.error('Erro ao criar insumo:', erro)
    return res.status(500).json(erroPadrao('Erro ao criar insumo.', erro))
  }
}

// Lista todos os insumos
export async function listarInsumos(_req: Request, res: Response) {
  try {
    const insumos = await insumoService.listar()
    return res.json(insumos)
  } catch (erro) {
    console.error('Erro ao listar insumos:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar insumos.', erro))
  }
}

// Consulta insumo por ID
export async function consultarInsumo(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const insumo = await insumoService.buscarPorId(id)
    if (!insumo) return res.status(404).json({ erro: 'Insumo não encontrado.' })

    return res.json(insumo)
  } catch (erro) {
    console.error('Erro ao consultar insumo:', erro)
    return res.status(500).json(erroPadrao('Erro ao consultar insumo.', erro))
  }
}

// Atualiza insumo com validação e auditoria
export async function atualizarInsumo(req: Request, res: Response) {
  const id = Number(req.params.id)
  const dados = req.body

  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  const erroValidacao = validarInsumo(dados)
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao })
  }

  try {
    const insumoAtualizado = await insumoService.atualizar(id, dados)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Atualização de insumo',
        entidade: 'Insumo',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Insumo atualizado com sucesso.',
      insumo: insumoAtualizado
    })
  } catch (erro) {
    console.error('Erro ao atualizar insumo:', erro)
    return res.status(500).json(erroPadrao('Erro ao atualizar insumo.', erro))
  }
}

// Inativa insumo com registro de auditoria
export async function inativarInsumo(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const insumo = await insumoService.inativar(id)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Inativação de insumo',
        entidade: 'Insumo',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Insumo inativado com sucesso.',
      insumo
    })
  } catch (erro) {
    console.error('Erro ao inativar insumo:', erro)
    return res.status(500).json(erroPadrao('Erro ao inativar insumo.', erro))
  }
}

// Reativa insumo com registro de auditoria
export async function ativarInsumo(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const insumo = await insumoService.ativar(id)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Reativação de insumo',
        entidade: 'Insumo',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Insumo reativado com sucesso.',
      insumo
    })
  } catch (erro) {
    console.error('Erro ao reativar insumo:', erro)
    return res.status(500).json(erroPadrao('Erro ao reativar insumo.', erro))
  }
}
// Exclui insumo com registro de auditoria
export async function excluirInsumo(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    await insumoService.excluir(id)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Exclusão de insumo',
        entidade: 'Insumo',
        entidadeId: id,
        tipoOperacao: TipoOperacao.EXCLUSAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({ mensagem: 'Insumo excluído com sucesso.' })
  } catch (erro) {
    console.error('Erro ao excluir insumo:', erro)
    return res.status(500).json(erroPadrao('Erro ao excluir insumo.', erro))
  }
}

// Filtra insumos por critérios avançados
export async function filtrarInsumos(req: Request, res: Response) {
  try {
    const filtros = req.query
    const resultado = await insumoService.filtrarAvancado(filtros)
    return res.json(resultado)
  } catch (erro) {
    console.error('Erro ao filtrar insumos:', erro)
    return res.status(500).json(erroPadrao('Erro ao filtrar insumos.', erro))
  }
}

// Lista insumos com validade próxima e envia alertas
export async function verificarValidade(_req: Request, res: Response) {
  try {
    const proximos = await insumoService.verificarValidadeProxima()

    await prisma.auditoria.create({
      data: {
        usuario: 'sistema',
        funcionarioId: 0,
        acao: 'Verificação de validade de insumos',
        entidade: 'Insumo',
        entidadeId: 0,
        tipoOperacao: TipoOperacao.LEITURA,
        ipOrigem: 'sistema',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Alertas enviados para insumos com validade próxima.',
      insumos: proximos
    })
  } catch (erro) {
    console.error('Erro ao verificar validade de insumos:', erro)
    return res.status(500).json(erroPadrao('Erro ao verificar validade.', erro))
  }
}
