
// DTO para cadastro de fornecedor.
// Baseado na modelagem definida em prisma/schema.prisma

export interface FornecedorDTO {
  nomeCompleto: string
  contato?: string
  nacionalidade?: string
  estadoCivil?: string
  cpf: string
  cnpj?: string
  rg: string
  inscricaoEstadual?: string
  email: string
  telefone: string
  celular?: string
  whatsapp?: string
  telefoneAlternativo?: string
  pais: string
  estado: string
  cidade: string
  bairro: string
  rua: string
  numero: string
  complemento?: string
  pontoReferencia?: string
  observacoes?: string
  banco: string
  agencia: string
  conta: string
  tipoConta: 'corrente' | 'poupança' | 'salário' // Enum explícito
  produtos: string
  tempoMercado?: string
  certificacoes?: string
  capacidadeFornecimento?: string
  atendimento?: string
  condicoesComerciais?: string
  historico?: string
  benchmarking?: string
  tipoFornecedor: 'nacional' | 'internacional' | 'regional' // Enum explícito
  prazoMedioEntrega?: number
  frequenciaEntrega?: string
  notaQualidade?: number
  notaPontualidade?: number
  notaAtendimento?: number
  aceitaDevolucao?: boolean
  prazoDevolucao?: number
  documentos?: any
  ocorrencias?: any
  ativo?: boolean
  dataCadastro?: Date
}
