export interface Usuario {
  nome: string
  email: string
  senha: string
  perfil: 'admin' | 'cliente' | 'entregador'
  setor: string
  cargo: string
  ativo?: boolean
}
