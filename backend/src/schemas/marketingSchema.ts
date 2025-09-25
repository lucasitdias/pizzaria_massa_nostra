import { z } from 'zod'

export const marketingSchema = z.object({
  nome: z.string().min(3, { message: 'Nome da campanha é obrigatório' }),
  descricao: z.string().optional(),
  inicio: z.string().datetime({ message: 'Data de início inválida' }),
  fim: z.string().datetime({ message: 'Data de fim inválida' }),
  tipo: z.enum(['desconto', 'brinde', 'combo'] as const),
  ativo: z.boolean().optional()
})
