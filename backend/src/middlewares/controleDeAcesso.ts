import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'

// Middleware para verificar se o usuário possui perfil permitido.
// Exemplo de uso: permitirPerfis('admin', 'gerente')

export function permitirPerfis(...perfisPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const perfil = req.user?.perfil

    if (!perfil || !perfisPermitidos.includes(perfil)) {
      return res.status(403).json({
        erro: 'Acesso negado. Perfil não autorizado.',
        detalhes: { perfilAtual: perfil, perfisPermitidos }
      })
    }

    next()
  }
}

// Middleware para verificar se o usuário possui permissão específica.
// Exemplo de uso: verificarPermissao('editar_pedido')

export function verificarPermissao(...permissoesNecessarias: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissoesUsuario = req.user?.permissoes || []

    const possuiTodas = permissoesNecessarias.every(p => permissoesUsuario.includes(p))

    if (!possuiTodas) {
      return res.status(403).json({
        erro: 'Acesso negado. Permissão insuficiente.',
        detalhes: { permissoesNecessarias, permissoesUsuario }
      })
    }

    next()
  }
}

// Middleware genérico para controle de acesso.
// Permite configurar perfis e permissões simultaneamente.
// Exemplo de uso:
// controleDeAcesso({ perfis: ['admin'], permissoes: ['remover_usuario'] })

export function controleDeAcesso(config: {
  perfis?: string[]
  permissoes?: string[]
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const perfil = req.user?.perfil
    const permissoesUsuario = req.user?.permissoes || []

    if (config.perfis && (!perfil || !config.perfis.includes(perfil))) {
      return res.status(403).json({
        erro: 'Acesso negado. Perfil não autorizado.',
        detalhes: { perfilAtual: perfil, perfisPermitidos: config.perfis }
      })
    }

    if (config.permissoes) {
      const possuiTodas = config.permissoes.every(p => permissoesUsuario.includes(p))
      if (!possuiTodas) {
        return res.status(403).json({
          erro: 'Acesso negado. Permissão insuficiente.',
          detalhes: { permissoesNecessarias: config.permissoes, permissoesUsuario }
        })
      }
    }

    next()
  }
}

// Exporta autorizarPerfis como alias de permitirPerfis
export const autorizarPerfis = permitirPerfis
