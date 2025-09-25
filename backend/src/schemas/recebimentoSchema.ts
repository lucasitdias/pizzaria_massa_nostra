import { z } from 'zod'

export const recebimentoSchema = z.object({
  clienteId: z.number().int({ message: 'ID do cliente inválido' }),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  formaRecebimento: z.string().min(3, 'Forma de recebimento obrigatória'),
  data: z.string().datetime('Data inválida').optional(),
  observacoes: z.string().optional()
})
