import { z } from 'zod'

export const pedidoSchema = z.object({
  clienteId: z.number().int({ message: 'ID do cliente inválido' }),
  centroDeCustoId: z.number().int({ message: 'ID do centro de custo inválido' }),
  formaPagamento: z.string().min(3, 'Forma de pagamento inválida').optional(),
  observacoes: z.string().optional(),
  status: z.string().optional(),
  email: z.string().email().optional(),

  itens: z.array(
    z.union([
      z.object({
        tipo: z.literal('pizza'),
        pizzaId: z.number(),
        nome: z.string(),
        quantidade: z.number().min(1),
        tipoPizza: z.enum(['salgada', 'doce']),
        tamanho: z.enum(['pequena', 'media', 'grande']),
        sabores: z.array(z.object({
          nome: z.string(),
          precoBase: z.number()
        })),
        borda: z.enum(['tradicional', 'simples', 'vulcao']).optional(),
        recheioBorda: z.string().optional(),
        insumos: z.array(z.object({
          insumoId: z.number(),
          quantidadeUtilizada: z.number()
        })).optional()
      }),
      z.object({
        tipo: z.literal('bebida'),
        nome: z.string(),
        volume: z.string(),
        quantidade: z.number().min(1)
      })
    ])
  ).min(1)
})
