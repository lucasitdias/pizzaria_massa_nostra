import { z } from 'zod'

const saborSchema = z.object({
  nome: z.string(),
  precoBase: z.number()
})

const itemPizzaSchema = z.object({
  tipo: z.literal('pizza'),
  pizzaId: z.number(),
  nome: z.string(),
  quantidade: z.number().min(1),
  tipoPizza: z.enum(['salgada', 'doce']),
  tamanho: z.enum(['pequena', 'media', 'grande']),
  sabores: z.array(saborSchema).min(1),
  borda: z.string().optional(),
  recheioBorda: z.string().optional(),
  insumos: z.array(z.any()).optional()
})

const itemBebidaSchema = z.object({
  tipo: z.literal('bebida'),
  bebidaId: z.number(),
  nome: z.string(),
  volume: z.string(),
  quantidade: z.number().min(1)
})

export const pedidoSchema = z.object({
  clienteId: z.number(),
  centroDeCustoId: z.number(),
  formaPagamento: z.string(),
  observacoes: z.string().optional(),
  itens: z.array(z.discriminatedUnion('tipo', [itemPizzaSchema, itemBebidaSchema]))
})
