import { Usuario } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: Pick<
        Usuario,
        'id' | 'email' | 'perfil' | 'nome' | 'setor' | 'cargo'
      > & {
        ativo?: boolean
        permissoes?: string[]
      }
    }
  }
}
