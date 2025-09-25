
// DTO para envio ou registro de comprovante de pagamento.
// Utilizado em rotas de POST /comprovantes

export interface ComprovanteDTO {
  pedidoId: number
  tipoArquivo: 'imagem' | 'pdf' | 'outro' // Enum explícito
  urlArquivo: string
  dataEnvio?: Date
  observacoes?: string
}
