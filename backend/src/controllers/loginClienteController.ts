import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma'

export async function loginClienteController(req: Request, res: Response) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
    }

    const cliente = await prisma.cliente.findUnique({ where: { email } })

    if (!cliente || !cliente.ativo) {
      return res.status(401).json({ erro: 'Cliente não encontrado ou inativo' })
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha)
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' })
    }

    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      console.error('JWT_SECRET não definido no .env')
      return res.status(500).json({ erro: 'Erro de configuração no servidor' })
    }

    const token = jwt.sign(
      { id: cliente.id, perfil: 'cliente' },
      JWT_SECRET,
      { expiresIn: '2d' }
    )

    res.json({ token })
  } catch (erro) {
    console.error('Erro no login do cliente:', erro)
    res.status(500).json({ erro: 'Erro interno no login do cliente' })
  }
}
