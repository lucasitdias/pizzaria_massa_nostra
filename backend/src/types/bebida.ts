export type TipoBebida =
  | 'refrigerante'
  | 'água'
  | 'suco'
  | 'cerveja artesanal'
  | 'cerveja tradicional'
  | 'vinho suave'
  | 'vinho seco'
  | 'energético'

export type EmbalagemBebida = 'lata' | 'long neck' | 'garrafa' | 'vidro'

export interface BebidaCadastrada {
  nome: string
  volume: string
}

export interface BebidaClassificada extends BebidaCadastrada {
  tipo: TipoBebida
  embalagem: EmbalagemBebida
  precoBase: number
}
