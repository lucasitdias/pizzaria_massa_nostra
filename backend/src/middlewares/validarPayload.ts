import { z } from 'zod'

// Schema para validar o payload do token JWT.
// Utilizado em middlewares como verificarToken.

export const payloadSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  perfil: z.enum(['admin', 'gerente', 'atendente', 'garçom']),
  nome: z.string(),
  setor: z.string(),
  cargo: z.string()
})
