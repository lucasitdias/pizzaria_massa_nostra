
// DTO para registro e consulta de pontos de fidelidade.
// Utilizado para premiar clientes recorrentes.

export interface FidelidadeDTO {
  clienteId: number
  pontos: number
  dataAcumulacao?: Date
  origem?: 'pedido' | 'promocao' | 'ajuste' // Enum de origem dos pontos
  observacoes?: string
}
