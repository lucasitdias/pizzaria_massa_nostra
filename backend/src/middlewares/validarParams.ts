import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'
import { ZodSchema } from 'zod'
import { ParamsDictionary } from 'express-serve-static-core'

// Middleware para validar os parâmetros da URL com Zod.
// Utilizado em rotas que usam req.params (exemplo: /usuarios/:id)

export function validarParams<T extends ParamsDictionary>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.params)

    if (!resultado.success) {
      return res.status(400).json({
        erro: 'Parâmetros inválidos na URL.',
        detalhes: resultado.error.format(),
      })
    }

    // Cast explícito para ParamsDictionary
    req.params = resultado.data as ParamsDictionary
    next()
  }
}
