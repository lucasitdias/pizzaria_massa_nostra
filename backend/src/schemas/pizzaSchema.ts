import { z } from 'zod'

export const pizzaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  ingredientes: z.array(z.string()).min(1, 'Pelo menos um ingrediente'),
  tamanho: z.enum(['pequena', 'média', 'grande'], 'Tamanho inválido'),
  preco: z.number().positive('Preço deve ser positivo'),
  tipo: z.enum(['salgada', 'doce'], 'Tipo inválido')
})
