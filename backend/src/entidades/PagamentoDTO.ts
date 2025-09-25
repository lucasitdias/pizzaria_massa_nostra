
// DTO para registro de pagamento de pedido.
// Utilizado nos controllers e services para validar e transportar dados.

export interface PagamentoDTO {
  pedidoId: number
  formaPagamento: 'dinheiro' | 'cartão' | 'pix' | 'boleto' // Enum explícito
  valorPago: number
  dataPagamento?: Date
  observacoes?: string
}
