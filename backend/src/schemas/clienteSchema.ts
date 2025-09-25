import { z } from 'zod'

// Validação completa para cadastro de cliente
export const clienteSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  telefone: z.string().min(11, 'Telefone deve ter 11 dígitos'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  aceitaPromocoes: z.boolean(),
  aceitaTermos: z.boolean(),
  endereco: z.object({
    rua: z.string().min(1, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cep: z.string().min(8, 'CEP deve ter 8 dígitos'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    pontoReferencia: z.string().optional()
  })
})
