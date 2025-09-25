
// DTO para criação e aplicação de cupons promocionais.
// Utilizado em campanhas de marketing e descontos.

export interface CupomDTO {
  codigo: string
  tipo: 'percentual' | 'valor' // Tipo de desconto
  valorDesconto: number
  validade: Date
  quantidadeMaximaUso?: number
  clienteId?: number // Cupom exclusivo para cliente
  pedidoMinimo?: number
  ativo?: boolean
  observacoes?: string
}
