import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { ZodError } from 'zod'
import { usuarioSchema } from 'schemas/usuarioSchema'
import { Usuario } from 'types/usuario'

const prisma = new PrismaClient()

export const usuarioService = {
  criar: async (dados: Usuario) => {
    try {
      usuarioSchema.parse(dados)

      const existe = await prisma.usuario.findUnique({
        where: { email: dados.email }
      })

      if (existe) {
        throw {
          status: 409,
          erro: 'Usuário já existe'
        }
      }

      const senhaCriptografada = await bcrypt.hash(dados.senha, 10)

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          senha: senhaCriptografada,
          perfil: dados.perfil,
          setor: dados.setor,
          cargo: dados.cargo,
          ativo: true
        }
      })

      return {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        perfil: novoUsuario.perfil
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw {
          status: 400,
          erro: 'Dados inválidos',
          detalhes: error.issues
        }
      }

      if (typeof error === 'object' && error !== null && 'status' in error) {
        throw error
      }

      throw { status: 500, erro: 'Erro ao criar usuário' }
    }
  }
}

export async function autenticarUsuario(email: string, senha: string): Promise<string> {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !usuario.ativo) {
      throw {
        status: 401,
        erro: 'Credenciais inválidas ou usuário inativo'
      }
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      throw {
        status: 401,
        erro: 'Credenciais inválidas'
      }
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        perfil: usuario.perfil,
        setor: usuario.setor,
        cargo: usuario.cargo
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )

    return token
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      throw error
    }

    throw { status: 500, erro: 'Erro ao autenticar usuário' }
  }
}
