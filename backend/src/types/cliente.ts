export interface EnderecoEntrega {
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  cidade: string
  pontoReferencia?: string
}

export interface Cliente {
  id: number
  nomeCompleto: string
  cpf: string
  telefone: string
  telefoneOpcional?: string
  email: string
  observacoes?: string
  aceitaPromocoes: boolean
  aceitaTermos: boolean
  endereco: EnderecoEntrega
}
