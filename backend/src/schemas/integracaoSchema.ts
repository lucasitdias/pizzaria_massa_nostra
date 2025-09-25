import { z } from 'zod'

export const integracaoSchema = z.object({
  tipo: z.enum(['whatsapp', 'erp'] as const),
  destino: z.string().min(3, { message: 'Destino é obrigatório' }),
  conteudo: z.string().min(1, { message: 'Conteúdo é obrigatório' })
})
