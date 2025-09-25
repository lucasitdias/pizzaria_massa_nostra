// src/__tests__/pizza.test.ts
import request from 'supertest'
import app from '../app'

describe('Pizza API', () => {
  let token: string
  let pizzaId: number

  beforeAll(async () => {
    // Autenticar usuário administrador
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    token = res.body.token
  })

  it('deve criar uma pizza válida', async () => {
    const res = await request(app)
      .post('/pizzas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Calabresa Especial',
        ingredientes: 'calabresa, cebola, mussarela',
        preco: 39.9,
        tipo: 'salgada'
      })

    expect(res.status).toBe(201)
    expect(res.body.pizza).toHaveProperty('id')
    pizzaId = res.body.pizza.id
  })

  it('não deve criar pizza com dados inválidos', async () => {
    const res = await request(app)
      .post('/pizzas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: '',
        ingredientes: '',
        preco: -10,
        tipo: ''
      })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve listar pizzas ativas', async () => {
    const res = await request(app)
      .get('/pizzas')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deve atualizar a pizza criada', async () => {
    const res = await request(app)
      .put(`/pizzas/${pizzaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ preco: 42.9 })

    expect(res.status).toBe(200)
    expect(res.body.pizza.preco).toBe(42.9)
  })

  it('deve desativar a pizza', async () => {
    const res = await request(app)
      .patch(`/pizzas/${pizzaId}/desativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.pizza.ativo).toBe(false)
  })

  it('deve reativar a pizza', async () => {
    const res = await request(app)
      .patch(`/pizzas/${pizzaId}/reativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.pizza.ativo).toBe(true)
  })

  it('deve excluir a pizza', async () => {
    const res = await request(app)
      .delete(`/pizzas/${pizzaId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('mensagem')
  })

  it('deve filtrar pizzas por tipo', async () => {
    const res = await request(app)
      .get('/pizzas/filtro/avancado?tipo=salgada')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
