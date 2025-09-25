export function logInfo(mensagem: string) {
  console.log(`[INFO] ${new Date().toISOString()} - ${mensagem}`)
}

export function logErro(mensagem: string, erro?: unknown) {
  console.error(`[ERRO] ${new Date().toISOString()} - ${mensagem}`, erro)
}
