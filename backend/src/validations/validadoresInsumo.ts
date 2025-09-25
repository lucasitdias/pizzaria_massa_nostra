import { z } from 'zod'

export const insumoSchema = z.object({
  nome: z.string().min(1, 'Nome do insumo é obrigatório.'),
  unidadeMedida: z.string().min(1, 'Unidade de medida é obrigatória.'),
  precoUnitario: z.number().positive('Preço unitário deve ser positivo.'),
  quantidade: z.number().positive('Quantidade deve ser positiva.').optional(),
  taxaExtra: z.number().optional()
})

export function validarInsumo(dados: any): string | null {
  const resultado = insumoSchema.safeParse(dados)
  return resultado.success ? null : resultado.error.issues[0].message
}

export function calcularPrecoFinal(insumo: {
  precoUnitario?: number
  quantidade?: number
  taxaExtra?: number
}): number {
  const precoUnitario = insumo.precoUnitario ?? 0
  const quantidade = insumo.quantidade ?? 1
  const taxaExtra = insumo.taxaExtra ?? 0

  return precoUnitario * quantidade + taxaExtra
}
