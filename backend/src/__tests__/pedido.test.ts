// src/__tests__/pedido.test.ts
import request from 'supertest'
import app from '../app'

describe('Pedido API', () => {
  let token: string
  let pedidoId: number

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    token = res.body.token
  })

  it('deve criar um pedido válido', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clienteId: 1,
        centroDeCustoId: 1,
        formaPagamento: 'dinheiro',
        observacoes: 'Sem cebola',
        itens: [
          {
            tipo: 'pizza',
            pizzaId: 1,
            quantidade: 2,
            tamanho: 'grande',
            tipoPizza: 'salgada',
            sabores: [
              { nome: 'Pizza Calabresa Especial', precoBase: 15 }
            ],
            borda: 'tradicional',
            recheioBorda: 'catupiry',
            insumos: []
          },
          {
            tipo: 'bebida',
            bebidaId: 5,
            quantidade: 1,
            nome: 'Coca-Cola Tradicional',
            volume: '350 ml'
          }
        ]
      })

    expect(res.status).toBe(201)
    expect(res.body.pedido).toHaveProperty('id')
    pedidoId = res.body.pedido.id
  })

  it('deve listar pedidos', async () => {
    const res = await request(app)
      .get('/pedidos')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deve excluir pedido', async () => {
    const res = await request(app)
      .delete(`/pedidos/${pedidoId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('mensagem')
  })
})
