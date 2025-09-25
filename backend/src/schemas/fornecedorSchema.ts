import { z } from 'zod'

export const fornecedorSchema = z.object({
  nome: z.string().min(2, 'Nome do fornecedor é obrigatório'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  ativo: z.boolean().optional()
})
