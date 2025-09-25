import { z } from 'zod'

export const usuarioSchema = z.object({
  nome: z.string().min(3, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  senha: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  perfil: z.enum(['admin', 'cliente', 'entregador'], { message: 'Perfil inválido' }),
  setor: z.string().min(2, { message: 'Setor é obrigatório' }),
  cargo: z.string().min(2, { message: 'Cargo é obrigatório' }),
  ativo: z.boolean().optional()
})
