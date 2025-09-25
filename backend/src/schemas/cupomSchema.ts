import { z } from 'zod'

export const cupomSchema = z.object({
  codigo: z.string().min(3, { message: 'Código do cupom é obrigatório' }),
  desconto: z.number()
    .min(0, { message: 'Desconto deve ser positivo' })
    .max(100, { message: 'Desconto máximo é 100%' }),
  tipo: z.enum(['porcentagem', 'valor'] as const),
  validade: z.string().datetime({ message: 'Data de validade inválida' }),
  ativo: z.boolean().optional()
})
