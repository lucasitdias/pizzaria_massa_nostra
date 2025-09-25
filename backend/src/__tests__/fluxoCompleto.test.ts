// src/__tests__/fluxoCompleto.test.ts
import request from 'supertest'
import app from '../app'
import prisma from '../prisma/prisma'

describe('Fluxo completo da API', () => {
  let token: string
  let pizzaId: number
  let clienteId: number
  let pedidoId: number
  let entregaId: number

  beforeAll(async () => {
    // Autenticar usuário administrador
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    token = res.body.token
  })

  it('deve criar uma pizza e um cliente', async () => {
    // Criar pizza
    const pizzaRes = await request(app)
      .post('/pizzas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Marguerita',
        ingredientes: 'tomate, manjericão, mussarela',
        preco: 32.5,
        tipo: 'salgada'
      })

    expect(pizzaRes.status).toBe(201)
    pizzaId = pizzaRes.body.pizza.id

    // Criar cliente com endereço
    const clienteRes = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nomeCompleto: 'Lucas Cliente',
        cpf: '98765432100',
        telefone: '19999999999',
        email: 'lucas.cliente@massa.com',
        aceitaPromocoes: true,
        aceitaTermos: true,
        endereco: {
          rua: 'Rua Teste',
          numero: '100',
          bairro: 'Centro',
          cep: '13290-000',
          cidade: 'Louveira',
          pontoReferencia: 'Próximo à pizzaria'
        }
      })

    expect(clienteRes.status).toBe(201)
    clienteId = clienteRes.body.cliente.id
  })

  it('deve criar um pedido com pizza e bebida', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clienteId,
        centroDeCustoId: 1,
        formaPagamento: 'dinheiro',
        itens: [
          {
            tipo: 'pizza',
            pizzaId,
            nome: 'Marguerita',
            quantidade: 1,
            tipoPizza: 'salgada',
            tamanho: 'media',
            sabores: [{ nome: 'Marguerita', precoBase: 32.5 }],
            borda: 'tradicional',
            recheioBorda: 'catupiry'
          },
          {
            tipo: 'bebida',
            nome: 'Coca-Cola',
            volume: '350ml',
            quantidade: 1
          }
        ]
      })

    expect(res.status).toBe(201)
    expect(res.body.pedido).toHaveProperty('id')
    pedidoId = res.body.pedido.id
  })

  it('deve registrar pagamento aprovado e gerar entrega', async () => {
    const res = await request(app)
      .post('/pagamentos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pedidoId,
        valor: 40,
        valorPago: 40,
        formaPagamento: 'dinheiro',
        status: 'APROVADO'
      })

    expect(res.status).toBe(201)

    const entrega = await prisma.entrega.findFirst({ where: { pedidoId } })
    expect(entrega).not.toBeNull()
    entregaId = entrega!.id
  })

  it('deve atualizar status da entrega para ENTREGUE', async () => {
    const res = await request(app)
      .put(`/entregas/${entregaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ENTREGUE' })

    expect(res.status).toBe(200)
    expect(res.body.entrega.status).toBe('ENTREGUE')
  })

  it('deve desativar e reativar pizza e cliente', async () => {
    const desativaPizza = await request(app)
      .patch(`/pizzas/${pizzaId}/desativar`)
      .set('Authorization', `Bearer ${token}`)
    expect(desativaPizza.status).toBe(200)

    const reativaPizza = await request(app)
      .patch(`/pizzas/${pizzaId}/reativar`)
      .set('Authorization', `Bearer ${token}`)
    expect(reativaPizza.status).toBe(200)

    const desativaCliente = await request(app)
      .patch(`/clientes/${clienteId}/desativar`)
      .set('Authorization', `Bearer ${token}`)
    expect(desativaCliente.status).toBe(200)

    const reativaCliente = await request(app)
      .patch(`/clientes/${clienteId}/reativar`)
      .set('Authorization', `Bearer ${token}`)
    expect(reativaCliente.status).toBe(200)
  })

  it('deve excluir pizza e cliente', async () => {
    const excluiPizza = await request(app)
      .delete(`/pizzas/${pizzaId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(excluiPizza.status).toBe(200)

    const excluiCliente = await request(app)
      .delete(`/clientes/${clienteId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(excluiCliente.status).toBe(200)
  })
})
