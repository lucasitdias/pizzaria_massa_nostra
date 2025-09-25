
// DTO para agendamento e controle de entregas.
// Utilizado em pedidos com entrega domiciliar.

export interface EntregaDTO {
  pedidoId: number
  enderecoEntrega: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    complemento?: string
    referencia?: string
  }
  nomeRecebedor: string
  telefoneContato: string
  horarioPrevisto: Date
  taxaEntrega: number
  observacoes?: string
}
