import { z } from 'zod'

// Validação para criação de centro de custo
export const centroDeCustoSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório e deve ter ao menos 2 caracteres'),
  descricao: z.string().optional(),
  ativo: z.boolean().optional()
})
