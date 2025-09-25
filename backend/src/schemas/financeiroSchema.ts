import { z } from 'zod'

export const financeiroSchema = z.object({
  tipo: z.enum(['recebimento', 'pagamento'] as const),
  valor: z.number().min(0, { message: 'Valor deve ser positivo' }),
  descricao: z.string().min(3, { message: 'Descrição é obrigatória' }),
  categoria: z.string().optional(),
  data: z.string().datetime({ message: 'Data inválida' }).optional()
})
