export function formatarData(data: Date): string {
  return data.toLocaleDateString('pt-BR')
}

export function formatarValor(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`
}
