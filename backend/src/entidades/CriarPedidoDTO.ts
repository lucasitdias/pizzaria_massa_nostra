// DTO para criação de pedidos

export interface CriarPedidoDTO {
  clienteId: number
  centroDeCustoId: number
  formaPagamento?: string
  observacoes?: string
  status?: string
  email?: string // usado para auditoria

  itens: Array<
    | {
        // Item do tipo pizza
        tipo: 'pizza'
        pizzaId: number
        nome: string
        quantidade: number
        tipoPizza: 'salgada' | 'doce'
        tamanho: 'pequena' | 'media' | 'grande'
        sabores: { nome: string; precoBase: number }[]
        borda?: 'tradicional' | 'simples' | 'vulcao'
        recheioBorda?: string
        insumos?: {
          insumoId: number
          quantidadeUtilizada: number
        }[]
      }
    | {
        // Item do tipo bebida
        tipo: 'bebida'
        bebidaId: number // Adicionado para permitir conexão com o modelo Bebida
        nome: string
        volume: string
        quantidade: number
      }
  >
}
