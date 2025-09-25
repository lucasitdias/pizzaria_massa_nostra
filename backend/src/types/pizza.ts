export type TamanhoPizza = 'pequena' | 'media' | 'grande'
export type TipoPizza = 'salgada' | 'doce'
export type TipoBorda = 'tradicional' | 'simples' | 'vulcao'

export interface SaborPizza {
  nome: string
  precoBase: number
}

export interface PizzaPersonalizada {
  tipo: TipoPizza
  tamanho: TamanhoPizza
  sabores: SaborPizza[]
  borda?: TipoBorda
  recheioBorda?: string
}
