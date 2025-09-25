export function gerarCodigo(prefixo: string = 'PN'): string {
  const aleatorio = Math.floor(Math.random() * 1000000)
  return `${prefixo}-${aleatorio.toString().padStart(6, '0')}`
}
