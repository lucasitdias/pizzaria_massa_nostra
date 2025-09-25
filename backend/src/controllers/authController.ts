import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma'

export async function loginController(req: Request, res: Response) {
  try {
    const { email, senha } = req.body

    // Validação de campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
    }

    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    // Verifica se o usuário existe e está ativo
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário inválido' })
    }

    // Compara a senha fornecida com a senha armazenada
    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' })
    }

    // Verifica se a variável de ambiente JWT_SECRET está definida
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      console.error('JWT_SECRET não definido no .env')
      return res.status(500).json({ erro: 'Erro de configuração no servidor' })
    }

    // Gera o token JWT com ID e perfil do usuário
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: '2d' }
    )

    // Retorna o token para o cliente
    res.json({ token })
  } catch (erro) {
    // Tratamento de erro genérico
    console.error('Erro no login:', erro)
    res.status(500).json({ erro: 'Erro interno no login' })
}
