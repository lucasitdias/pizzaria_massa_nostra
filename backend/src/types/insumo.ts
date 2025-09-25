export interface Insumo {
  id: number
  nome: string
  unidadeMedida: string
  precoUnitario: number
  validade: Date | null
  ativo: boolean
}
