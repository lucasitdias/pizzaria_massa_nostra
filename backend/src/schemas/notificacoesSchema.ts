import { z } from 'zod'

export const notificacaoSchema = z.object({
  titulo: z.string().min(3, { message: 'Título é obrigatório' }),
  mensagem: z.string().min(5, { message: 'Mensagem é obrigatória' }),
  tipo: z.enum(['sistema', 'promocional', 'alerta'] as const),
  destino: z.string().optional(),
  agendadaPara: z.string().datetime({ message: 'Data de agendamento inválida' }).optional()
})
