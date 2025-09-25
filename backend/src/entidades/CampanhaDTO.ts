
// DTO para criação de campanha promocional.
// Utilizado em rotas de POST /campanhas

export interface CampanhaDTO {
  titulo: string
  descricao?: string
  tipo: 'desconto' | 'fidelidade' | 'combo' | 'cupom' // Enum explícito
  dataInicio: Date
  dataFim: Date
  ativo?: boolean
  publicoAlvo?: 'todos' | 'clientes' | 'novos' | 'vip'
  valorDesconto?: number
  percentualDesconto?: number
  cupomVinculado?: string
  observacoes?: string
}
