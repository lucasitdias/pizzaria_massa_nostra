import { z } from 'zod'

export const relatorioSchema = z.object({
  tipo: z.enum([
    'vendas',
    'clientes',
    'financeiro',
    'produtos',
    'campanhas',
    'entregas'
  ] as const),
  dataInicio: z.string().datetime({ message: 'Data de início inválida' }),
  dataFim: z.string().datetime({ message: 'Data de fim inválida' }),
  filtros: z.record(z.string(), z.any()).optional()
})
