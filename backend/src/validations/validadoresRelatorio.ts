// src/validations/validadoresRelatorio.ts
import { z } from 'zod'

export const relatorioVendasSchema = z.object({
  dataInicio: z.string().min(1, 'Data de início é obrigatória.'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória.')
})
