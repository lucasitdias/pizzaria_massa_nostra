
// DTO para cadastro de cliente.
// Utilizado em rotas de POST /clientes

export interface CriarClienteDTO {
  nomeCompleto: string
  cpf?: string
  email: string
  telefone: string
  celular?: string
  whatsapp?: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    complemento?: string
    referencia?: string
  }
  observacoes?: string
  ativo?: boolean
  dataCadastro?: Date
}
