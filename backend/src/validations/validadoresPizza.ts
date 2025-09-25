import { z } from 'zod'

export const pizzaSchema = z.object({
  nome: z.string().min(1, 'O nome da pizza é obrigatório.'),
  ingredientes: z.array(z.string()).min(1, 'A pizza deve ter pelo menos um ingrediente.'),
  tamanho: z.enum(['pequena', 'media', 'grande'], 'Tamanho inválido.'),
  tipo: z.enum(['salgada', 'doce'], 'Tipo inválido.'),
  preco: z.number().positive('O preço da pizza deve ser um número positivo.')
})
