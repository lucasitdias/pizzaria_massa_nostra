import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'
import { ZodSchema } from 'zod'

// Middleware para validar o corpo da requisição com Zod.
// Utilizado em rotas que recebem dados via req.body.

export function validarBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body)

    if (!resultado.success) {
      return res.status(400).json({
        erro: 'Dados inválidos no corpo da requisição.',
        detalhes: resultado.error.format(),
      })
    }

    req.body = resultado.data
    next()
  }
}
