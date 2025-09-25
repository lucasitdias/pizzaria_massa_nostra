import { z } from 'zod'

export const cotacaoSchema = z.object({
  fornecedorId: z.number().int({ message: 'ID do fornecedor inválido' }),
  insumos: z.array(z.object({
    insumoId: z.number().int({ message: 'ID do insumo inválido' }),
    quantidade: z.number().min(1, 'Quantidade deve ser maior que zero')
  })),
  prazoEntrega: z.string().datetime('Data inválida').optional(),
  observacoes: z.string().optional()
})
