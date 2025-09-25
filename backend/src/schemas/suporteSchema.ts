import { z } from 'zod'

export const suporteSchema = z.object({
  titulo: z.string().min(3, 'Título é obrigatório'),
  descricao: z.string().min(5, 'Descrição é obrigatória'),
  prioridade: z.enum(['baixa', 'média', 'alta'] as const)
})
