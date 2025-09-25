// src/__tests__/pedido.erros.test.ts
import request from 'supertest'
import app from '../app'

describe('Erros de pedido', () => {
  it('deve falhar ao registrar pedido com pizza inexistente', async () => {
    const resposta = await request(app)
      .post('/pedidos')
      .send({
        clienteId: 1,
        centroDeCustoId: 1,
        formaPagamento: 'PIX',
        pizzas: [
          {
            pizzaId: 9999,
            nome: 'Pizza Fantasma',
            precoVenda: 30,
            quantidade: 1,
            insumos: []
          }
        ]
      })

    expect(resposta.status).toBe(404)
    expect(resposta.body).toHaveProperty('erro')
    expect(resposta.body.erro).toMatch(/Pizza com ID/i)
  })

  it('deve falhar ao registrar pedido com cliente inexistente', async () => {
    const resposta = await request(app)
      .post('/pedidos')
      .send({
        clienteId: 9999,
        centroDeCustoId: 1,
        formaPagamento: 'PIX',
        pizzas: []
      })

    expect(resposta.status).toBe(404)
    expect(resposta.body).toHaveProperty('erro')
    expect(resposta.body.erro).toMatch(/Cliente não encontrado/i)
  })
})
