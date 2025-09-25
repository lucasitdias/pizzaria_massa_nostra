import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'
import fs from 'fs'
import path from 'path'

// Middleware de auditoria.
// Registra ações sensíveis realizadas por usuários autenticados.
// Pode ser usado em rotas de DELETE, PUT, POST ou qualquer operação crítica.

export function auditoria(acao: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.user
    const timestamp = new Date().toISOString()

    // Monta o log da ação
    const log = {
      timestamp,
      usuario: {
        id: usuario?.id,
        nome: usuario?.nome,
        email: usuario?.email,
        perfil: usuario?.perfil,
      },
      acao,
      metodo: req.method,
      rota: req.originalUrl,
      ip: req.ip,
      body: req.body,
      params: req.params,
      query: req.query,
    }

    // Define o caminho do arquivo de log
    const logPath = path.resolve(__dirname, '../../logs/auditoria.log')

    // Garante que o diretório exista
    fs.mkdirSync(path.dirname(logPath), { recursive: true })

    // Escreve o log no arquivo
    fs.appendFile(logPath, JSON.stringify(log) + '\n', err => {
      if (err) {
        console.error('Erro ao registrar auditoria:', err)
      }
    })

    next()
  }
}
