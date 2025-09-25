
// DTO para cadastro de insumo no estoque.
// Utilizado em rotas de POST /insumos

export interface CriarInsumoDTO {
  nome: string
  categoria: string
  unidadeMedida: 'kg' | 'g' | 'l' | 'ml' | 'unidade' // Enum explícito
  quantidadeEstoque: number
  precoCusto?: number | null
  precoUnitario: number
  margemLucro?: number | null
  estoqueMinimo?: number | null
  validade?: string | Date | null
  fornecedorId?: number | null
  ativo?: boolean
}
