
// DTO para cadastro de usuário no sistema.
// Utilizado por administradores e no processo de onboarding.

export interface CriarUsuarioDTO {
  nome: string
  email: string
  senha: string
  setor: string
  cargo: string
  perfil: 'admin' | 'gerente' | 'atendente' | 'garçom' // Enum de perfis
  ativo?: boolean
  dataCadastro?: Date
}
