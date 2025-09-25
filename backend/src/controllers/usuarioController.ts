import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import bcrypt from 'bcrypt'
import { validarEmail, erroPadrao } from '../validations/validadores'
import { usuarioSchema } from '../schemas/usuarioSchema'
import { z } from 'zod'

const prisma = new PrismaClient()

// Cria novo usuário (funcionário) com validação e auditoria
export async function criarUsuario(req: Request, res: Response) {
  try {
    const resultado = usuarioSchema.safeParse(req.body)
    if (!resultado.success) {
      return res.status(400).json({ erro: resultado.error.issues })
    }

    const { senha, email, ...dados } = resultado.data

    if (!validarEmail(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' })
    }

    const existente = await prisma.usuario.findUnique({ where: { email } })
    if (existente) {
      return res.status(409).json({ erro: 'Usuário com este e-mail já existe.' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const novoUsuario = await prisma.usuario.create({
      data: {
        ...dados,
        email,
        senha: senhaCriptografada
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Criação de usuário',
        entidade: 'Usuario',
        entidadeId: novoUsuario.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    const { senha: _, ...usuarioSemSenha } = novoUsuario
    res.status(201).json(usuarioSemSenha)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    res.status(500).json(erroPadrao('Erro ao criar usuário.', error))
  }
}

// Atualiza dados do usuário com auditoria
export async function atualizarUsuario(req: Request, res: Response) {
  const { id } = req.params
  const dadosAtualizados = req.body

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dadosAtualizados
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Atualização de usuário',
        entidade: 'Usuario',
        entidadeId: usuario.id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    const { senha, ...usuarioSemSenha } = usuario
    res.json(usuarioSemSenha)
  } catch (erro) {
    console.error('Erro ao atualizar usuário:', erro)
    res.status(500).json(erroPadrao('Erro ao atualizar usuário:', erro))
  }
}

// Inativa usuário com auditoria
export async function inativarUsuario(req: Request, res: Response) {
  const { id } = req.params

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { ativo: false }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Inativação de usuário',
        entidade: 'Usuario',
        entidadeId: usuario.id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    const { senha, ...usuarioSemSenha } = usuario
    res.json(usuarioSemSenha)
  } catch (erro) {
    console.error('Erro ao inativar usuário:', erro)
    res.status(500).json(erroPadrao('Erro ao inativar usuário:', erro))
  }
}

// Lista todos os usuários (sem campo de senha)
export async function listarUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await prisma.usuario.findMany()
    const usuariosSemSenha = usuarios.map(({ senha, ...resto }) => resto)
    res.json(usuariosSemSenha)
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro)
    res.status(500).json(erroPadrao('Erro ao listar usuários:', erro))
  }
}
// Busca usuário por ID (sem campo de senha)
export async function buscarUsuarioPorId(req: Request, res: Response) {
  const { id } = req.params

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) }
    })

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' })
    }

    const { senha, ...usuarioSemSenha } = usuario
    res.json(usuarioSemSenha)
  } catch (erro) {
    console.error('Erro ao buscar usuário:', erro)
    res.status(500).json(erroPadrao('Erro ao buscar usuário:', erro))
  }
}

// Reativa usuário com auditoria
export async function ativarUsuario(req: Request, res: Response) {
  const { id } = req.params

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { ativo: true }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Reativação de usuário',
        entidade: 'Usuario',
        entidadeId: usuario.id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    const { senha, ...usuarioSemSenha } = usuario
    res.json(usuarioSemSenha)
  } catch (erro) {
    console.error('Erro ao reativar usuário:', erro)
    res.status(500).json(erroPadrao('Erro ao reativar usuário:', erro))
  }
}

// Altera perfil do usuário com auditoria
const perfilSchema = z.object({
  perfil: z.enum(['admin', 'gerente', 'atendente', 'garçom']).refine(val => !!val, {
    message: 'Perfil inválido'
  })
})

export async function alterarPerfilUsuario(req: Request, res: Response) {
  const { id } = req.params
  const resultado = perfilSchema.safeParse(req.body)

  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.error.issues })
  }

  const { perfil } = resultado.data

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { perfil }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: `Alteração de perfil para ${perfil}`,
        entidade: 'Usuario',
        entidadeId: usuario.id,
        tipoOperacao: TipoOperacao.ATUALIZACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    const { senha, ...usuarioSemSenha } = usuario
    res.json(usuarioSemSenha)
  } catch (erro) {
    console.error('Erro ao alterar perfil do usuário:', erro)
    res.status(500).json(erroPadrao('Erro ao alterar perfil do usuário:', erro))
  }
}

// Exclui usuário com auditoria
export async function excluirUsuario(req: Request, res: Response) {
  const { id } = req.params

  try {
    await prisma.usuario.delete({ where: { id: Number(id) } })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Exclusão de usuário',
        entidade: 'Usuario',
        entidadeId: Number(id),
        tipoOperacao: TipoOperacao.EXCLUSAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    res.json({ mensagem: 'Usuário excluído com sucesso.' })
  } catch (erro) {
    console.error('Erro ao excluir usuário:', erro)
    res.status(500).json(erroPadrao('Erro ao excluir usuário:', erro))
  }
}
