import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'

// Middleware para validar os dados de um chamado.
// Utilizado em rotas de POST ou PUT /chamados

export function validarChamado(req: Request, res: Response, next: NextFunction) {
  const { titulo, descricao, prioridade } = req.body

  // Validação de campos obrigatórios
  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ erro: 'Título é obrigatório e deve ser uma string.' })
  }

  if (typeof descricao !== 'string' || descricao.trim() === '') {
    return res.status(400).json({ erro: 'Descrição é obrigatória e deve ser uma string.' })
  }

  // Validação de prioridade (se fornecida)
  const prioridadesValidas = ['baixa', 'média', 'alta']
  if (prioridade && !prioridadesValidas.includes(prioridade)) {
    return res.status(400).json({ erro: 'Prioridade inválida. Use: baixa, média ou alta.' })
  }

  next()
}
