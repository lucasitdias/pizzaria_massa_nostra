import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'

export function validarIntegracao(req: Request, res: Response, next: NextFunction) {
  const { numero, mensagem } = req.body

  if (!numero || !mensagem) {
    return res.status(400).json({ erro: 'Número e mensagem são obrigatórios.' })
  }

  next()
}
