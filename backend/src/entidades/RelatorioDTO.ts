
// DTO para geração de relatórios administrativos.
// Utilizado nos controllers e services para validar filtros e parâmetros.

export interface RelatorioDTO {
  tipo: 'vendas' | 'estoque' | 'financeiro' | 'compras' | 'clientes' // Enum explícito
  dataInicio: Date
  dataFim: Date
  centroDeCustoId?: number
  clienteId?: number
  fornecedorId?: number
}
