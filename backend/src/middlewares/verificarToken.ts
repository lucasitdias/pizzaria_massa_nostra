import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'
import jwt, { JwtPayload } from 'jsonwebtoken'

// Middleware para verificar o token JWT e injetar dados do usuário.
// Também inclui verificação de perfil administrativo.

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  // Token ausente
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' }) // <-- alterado
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      console.error('JWT_SECRET não definido no .env')
      return res.status(500).json({ erro: 'Erro de configuração no servidor' }) // <-- alterado
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, JWT_SECRET)

    // Garante que o payload é um objeto válido
    if (typeof payload === 'string') {
      return res.status(403).json({ erro: 'Token inválido: formato inesperado' }) // <-- alterado
    }

    // Injeta os dados do usuário no request com tipagem correta
    req.user = payload as JwtPayload & {
      id: number
      email: string
      perfil: string
      nome: string
      setor: string
      cargo: string
    }

    next()
  } catch (err) {
    console.error('Erro ao verificar token:', err)
    return res.status(403).json({ erro: 'Token inválido ou expirado' }) // <-- alterado
  }
}

// Middleware para verificar se o usuário possui perfil 'admin'.
// Deve ser usado após verificarToken.

export function verificarAdmin(req: Request, res: Response, next: NextFunction) {
  if (
    typeof req.user === 'object' &&
    'perfil' in req.user &&
    req.user.perfil === 'admin'
  ) {
    return next()
  }

  return res.status(403).json({ erro: 'Acesso restrito a administradores.' }) // <-- já estava certo
}
