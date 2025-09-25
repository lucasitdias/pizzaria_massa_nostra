export type TamanhoPizza = 'pequena' | 'media' | 'grande'
export type TipoPizza = 'salgada' | 'doce'
export type TipoBorda = 'tradicional' | 'simples' | 'vulcao'

export type PizzaPersonalizada = {
  tipo: TipoPizza
  tamanho: TamanhoPizza
  sabores: { nome: string; precoBase: number }[]
  borda?: TipoBorda
  recheioBorda?: string
}

/**
 * Calcula o preço de uma pizza personalizada
 * Regras:
 * - Cada sabor tem seu preço
 * - Se forem 2 sabores em pizza média ou grande, aplica média dos preços + acréscimo
 * - Borda tradicional não altera preço
 * - Borda simples (+2), vulcão (+5)
 * - Recheio da borda (+3)
 * - Multiplicador por tamanho: média (1.2), grande (1.5)
 */
export function calcularPrecoPizza(pizza: PizzaPersonalizada): number {
  let precoBase = 0

  // Cálculo de sabores
  if (pizza.tamanho === 'media' || pizza.tamanho === 'grande') {
    if (pizza.sabores.length === 2) {
      // Meia a meia com acréscimo de R$5
      precoBase = (pizza.sabores[0].precoBase + pizza.sabores[1].precoBase) / 2 + 5
    } else {
      precoBase = pizza.sabores.reduce((total, s) => total + s.precoBase, 0)
    }
  } else {
    // Pizza pequena: soma total dos sabores
    precoBase = pizza.sabores.reduce((total, s) => total + s.precoBase, 0)
  }

  // Acréscimo por borda
  if (pizza.borda === 'simples') precoBase += 2
  else if (pizza.borda === 'vulcao') precoBase += 5
  // Tradicional não altera o preço

  // Acréscimo por recheio da borda
  if (pizza.recheioBorda) precoBase += 3

  // Multiplicador por tamanho
  if (pizza.tamanho === 'media') precoBase *= 1.2
  else if (pizza.tamanho === 'grande') precoBase *= 1.5

  return +precoBase.toFixed(2)
}
