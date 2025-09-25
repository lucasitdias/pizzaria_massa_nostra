import { z } from 'zod'

export const entregaSchema = z.object({
  pedidoId: z.number().int({ message: 'ID do pedido inválido' }),
  endereco: z.string().min(5, { message: 'Endereço é obrigatório' }),
  status: z.enum(['pendente', 'em_transito', 'entregue', 'cancelada'] as const),
  entregador: z.string().optional(),
  observacoes: z.string().optional()
})
