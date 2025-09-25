import { z } from 'zod'

// Enum de status permitido
const statusEnum = z.enum(['PENDENTE', 'EM_ROTA', 'ENTREGUE', 'CANCELADA'])

// Esquema de validação para status de entrega
export const entregaStatusSchema = z.object({
  status: statusEnum
    .refine(val => ['PENDENTE', 'EM_ROTA', 'ENTREGUE', 'CANCELADA'].includes(val), {
      message: 'Status de entrega inválido.'
    })
})
