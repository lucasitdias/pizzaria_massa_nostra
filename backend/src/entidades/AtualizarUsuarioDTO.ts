
// DTO para atualização de dados de usuário.
// Utilizado em rotas de PUT /usuarios/:id

export interface AtualizarUsuarioDTO {
  nome?: string
  email?: string
  setor?: string
  cargo?: string
  perfil?: 'admin' | 'gerente' | 'atendente' | 'garçom'
  ativo?: boolean
}
