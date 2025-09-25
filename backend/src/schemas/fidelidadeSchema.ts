import { z } from 'zod'

export const fidelidadeSchema = z.object({
  clienteId: z.number().int({ message: 'ID do cliente inválido' }),
  pontos: z.number().int().min(0, { message: 'Pontos devem ser positivos' }),
  tipo: z.enum(['acumulado', 'resgate'] as const),
  recompensaId: z.number().int().optional()
})
