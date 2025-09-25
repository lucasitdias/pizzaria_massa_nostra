
// DTO para atualização de senha de usuário.
//Utilizado em rotas de PATCH /usuarios/:id/senha

export interface AtualizarSenhaDTO {
  senhaAtual: string
  novaSenha: string
  confirmarNovaSenha: string
}
