import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'

// Middleware global para tratamento de erros.
// Captura exceções e envia resposta padronizada.

export function tratamentoErros(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Erro capturado:', err)

  const status = err.status || 500
  const mensagem = err.message || 'Erro interno no servidor'

  res.status(status).json({
    erro: mensagem,
    detalhes: err.detalhes || null,
  })
}
