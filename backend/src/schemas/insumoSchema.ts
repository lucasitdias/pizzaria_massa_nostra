import { z } from 'zod'

export const insumoSchema = z.object({
  nome: z.string().min(2, 'Nome do insumo é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  unidadeMedida: z.string().min(1, 'Unidade de medida é obrigatória'),
  precoUnitario: z.number().min(0, 'Preço unitário deve ser positivo'),
  quantidadeEstoque: z.number().min(0, 'Quantidade deve ser positiva'),
  precoCusto: z.number().min(0, 'Preço de custo deve ser positivo').nullable().optional(),
  margemLucro: z.number().nullable().optional(),
  estoqueMinimo: z.number().nullable().optional(),
  validade: z.union([
    z.string().datetime('Data de validade inválida'),
    z.null()
  ]).optional(),
  fornecedorId: z.number().nullable().optional(),
  ativo: z.boolean().optional()
})
