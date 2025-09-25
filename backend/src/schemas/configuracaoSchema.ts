import { z } from 'zod'

export const configuracaoSchema = z.object({
  chave: z.string().min(2, 'Chave é obrigatória'),
  valor: z.union([
    z.string(),
    z.number(),
    z.boolean()
  ]),
  descricao: z.string().optional()
})
