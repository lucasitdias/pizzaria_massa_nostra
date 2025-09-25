// src/__tests__/insumo.test.ts
import request from 'supertest'
import app from '../app'

describe('Insumo API', () => {
  let token: string
  let insumoId: number

  beforeAll(async () => {
    // Autenticar usuário administrador
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    token = res.body.token
  })

  it('deve criar um insumo válido', async () => {
    const res = await request(app)
      .post('/insumos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Farinha de trigo',
        categoria: 'base',
        unidadeMedida: 'kg',
        precoCusto: 4.5,
        quantidadeEstoque: 100,
        ativo: true
      })

    expect(res.status).toBe(201)
    expect(res.body.insumo).toHaveProperty('id')
    insumoId = res.body.insumo.id
  })

  it('não deve criar insumo com dados inválidos', async () => {
    const res = await request(app)
      .post('/insumos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: '',
        categoria: '',
        unidadeMedida: '',
        precoCusto: -1
      })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve listar insumos ativos', async () => {
    const res = await request(app)
      .get('/insumos')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deve atualizar insumo', async () => {
    const res = await request(app)
      .put(`/insumos/${insumoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ precoCusto: 5.2 })

    expect(res.status).toBe(200)
    expect(res.body.insumo.precoCusto).toBe(5.2)
  })

  it('deve desativar insumo', async () => {
    const res = await request(app)
      .patch(`/insumos/${insumoId}/desativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.insumo.ativo).toBe(false)
  })

  it('deve reativar insumo', async () => {
    const res = await request(app)
      .patch(`/insumos/${insumoId}/reativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.insumo.ativo).toBe(true)
  })

  it('deve excluir insumo', async () => {
    const res = await request(app)
      .delete(`/insumos/${insumoId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('mensagem')
  })

  it('deve filtrar insumos por categoria', async () => {
    const res = await request(app)
      .get('/insumos/filtro?categoria=base')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
