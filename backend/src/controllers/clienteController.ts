import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client' // Enum importado
import { ClienteService } from '../services/clienteService'
import { validarCPF, validarEmail, erroPadrao } from '../validations/validadores'
import { clienteSchema } from '../schemas/clienteSchema'

const prisma = new PrismaClient()
const clienteService = new ClienteService()

// Cria novo cliente com validação e auditoria
export async function criarCliente(req: Request, res: Response) {
  const dados = req.body

  const resultado = clienteSchema.safeParse(dados)
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  if (!validarCPF(dados.cpf)) {
    return res.status(400).json({ erro: 'CPF inválido.' })
  }

  if (!validarEmail(dados.email)) {
    return res.status(400).json({ erro: 'E-mail inválido.' })
  }

  const duplicado = await clienteService.verificarDuplicidade(dados.cpf, dados.email, dados.telefone)
  if (duplicado) {
    return res.status(409).json({ erro: 'Cliente já cadastrado com CPF, e-mail ou telefone informado.' })
  }

  try {
    const novoCliente = await clienteService.criarCliente(dados)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Criação de cliente',
        entidade: 'Cliente',
        entidadeId: novoCliente.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Cliente criado com sucesso.',
      cliente: novoCliente
    })
  } catch (erro) {
    console.error('Erro ao criar cliente:', erro)
    return res.status(500).json(erroPadrao('Erro ao criar cliente.', erro))
  }
}

// Consulta cliente por ID com endereço
export async function consultarCliente(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const cliente = await clienteService.buscarPorId(id)
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' })

    return res.json(cliente)
  } catch (erro) {
    console.error('Erro ao consultar cliente:', erro)
    return res.status(500).json(erroPadrao('Erro ao consultar cliente.', erro))
  }
}

// Atualiza dados do cliente e endereço com auditoria
export async function atualizarCliente(req: Request, res: Response) {
  const id = Number(req.params.id)
  const dados = req.body

  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  const resultado = clienteSchema.safeParse(dados)
  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  if (!validarCPF(dados.cpf)) {
    return res.status(400).json({ erro: 'CPF inválido.' })
  }

  if (!validarEmail(dados.email)) {
    return res.status(400).json({ erro: 'E-mail inválido.' })
  }

  try {
    const clienteAtualizado = await clienteService.atualizarCliente(id, dados)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Atualização de cliente',
        entidade: 'Cliente',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Cliente atualizado com sucesso.',
      cliente: clienteAtualizado
    })
  } catch (erro) {
    console.error('Erro ao atualizar cliente:', erro)
    return res.status(500).json(erroPadrao('Erro ao atualizar cliente.', erro))
  }
}

// Desativa cliente com registro de auditoria
export async function desativarCliente(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const cliente = await clienteService.desativarCliente(id)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Desativação de cliente',
        entidade: 'Cliente',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Cliente desativado com sucesso.',
      cliente
    })
  } catch (erro) {
    console.error('Erro ao desativar cliente:', erro)
    return res.status(500).json(erroPadrao('Erro ao desativar cliente.', erro))
  }
}

// Reativa cliente com registro de auditoria
export async function reativarCliente(req: Request, res: Response) {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' })

  try {
    const cliente = await clienteService.reativarCliente(id)

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'desconhecido',
        funcionarioId: req.user?.id || 0,
        acao: 'Reativação de cliente',
        entidade: 'Cliente',
        entidadeId: id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.json({
      mensagem: 'Cliente reativado com sucesso.',
      cliente
    })
  } catch (erro) {
    console.error('Erro ao reativar cliente:', erro)
    return res.status(500).json(erroPadrao('Erro ao reativar cliente.', erro))
  }
}
