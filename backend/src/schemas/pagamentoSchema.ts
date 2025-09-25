import { z } from 'zod'

export const pagamentoSchema = z.object({
  pedidoId: z.number().int({ message: 'ID do pedido inválido' }),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  formaPagamento: z.string().min(3, 'Forma de pagamento obrigatória'),
  status: z.enum(['pendente', 'aprovado', 'recusado'] as const),
  data: z.string().datetime({ message: 'Data inválida' }).optional()
})
