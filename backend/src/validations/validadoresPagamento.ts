// src/validations/validadoresPagamento.ts
import { z } from 'zod'

export const pagamentoSchema = z.object({
  pedidoId: z.number(),
  valor: z.number().positive('Valor total deve ser positivo.'),
  valorPago: z.number().min(0, 'Valor pago deve ser zero ou positivo.'),
  formaPagamento: z.string().min(1, 'Forma de pagamento é obrigatória.'),
  status: z.enum(['PENDENTE', 'APROVADO', 'RECUSADO']),
  data: z.string().optional()
})
