import { z } from 'zod'

export const comprovanteSchema = z.object({
  pedidoId: z.number().int({ message: 'ID do pedido inválido' }),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  formaPagamento: z.string().min(3, 'Forma de pagamento obrigatória'),
  imagemUrl: z.string().url('URL da imagem inválida').optional()
})
