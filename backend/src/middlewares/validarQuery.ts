import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'
import { ZodSchema } from 'zod'
import { ParsedQs } from 'qs'

// Middleware para validar os parâmetros de consulta (query string) com Zod.
// Utilizado em rotas que usam req.query

export function validarQuery<T extends ParsedQs>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.query)

    if (!resultado.success) {
      return res.status(400).json({
        erro: 'Parâmetros inválidos na query string.',
        detalhes: resultado.error.format(),
      })
    }

    // Cast explícito para ParsedQs
    req.query = resultado.data as ParsedQs
    next()
  }
}
