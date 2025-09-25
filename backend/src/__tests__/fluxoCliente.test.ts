import request from 'supertest'
import app from '../app'

describe('Fluxo completo do cliente', () => {
  let token: string
  let pedidoId: number

  it('deve cadastrar um novo cliente', async () => {
    const res = await request(app)
      .post('/clientes')
      .send({
        nome: 'Lucas Cliente',
        email: 'lucascliente@massa.com',
        telefone: '11999999999',
        senha: '123456',
        endereco: {
          logradouro: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'Santa Bárbara d\'Oeste',
          estado: 'SP'
        }
      })

    expect(res.status).toBe(201)
  })

  it('deve autenticar o cliente e obter token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'lucascliente@massa.com',
        senha: '123456'
      })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    token = res.body.token
  })

  it('deve listar o catálogo de produtos (pizzas e bebidas)', async () => {
    const pizzas = await request(app)
      .get('/pizzas')
      .set('Authorization', `Bearer ${token}`)

    const bebidas = await request(app)
      .get('/bebidas')
      .set('Authorization', `Bearer ${token}`)

    expect(pizzas.status).toBe(200)
    expect(bebidas.status).toBe(200)
    expect(Array.isArray(pizzas.body)).toBe(true)
    expect(Array.isArray(bebidas.body)).toBe(true)
  })

  it('deve finalizar um pedido com pizza e bebida', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clienteId: 1,
        centroDeCustoId: 1,
        formaPagamento: 'PIX',
        observacoes: 'Sem cebola',
        itens: [
          {
            tipo: 'pizza',
            pizzaId: 3,
            nome: 'Pizza Calabresa Especial',
            quantidade: 1,
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
            nome: 'Coca-Cola Tradicional',
            volume: '350 ml',
            quantidade: 2
          }
        ]
      })

    expect(res.status).toBe(201)
    expect(res.body.pedido).toHaveProperty('id')
    pedidoId = res.body.pedido.id
  })

  it('deve mostrar o pedido finalizado', async () => {
    const res = await request(app)
      .get(`/pedidos/${pedidoId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(pedidoId)
    expect(res.body.status).toBeDefined()
    expect(res.body.itens).toBeDefined()
  })
})
