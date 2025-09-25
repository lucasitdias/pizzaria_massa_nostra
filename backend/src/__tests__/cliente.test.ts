// src/__tests__/cliente.test.ts
import request from 'supertest'
import app from '../app'

describe('Cliente API', () => {
  let token: string
  let clienteId: number

  beforeAll(async () => {
    // Autenticar usuário administrador
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    token = res.body.token
  })

  it('deve criar um cliente válido', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nomeCompleto: 'Lucas Teste',
        cpf: '12345678900',
        telefone: '19999999999',
        email: 'lucas.teste@massa.com',
        aceitaPromocoes: true,
        aceitaTermos: true
      })

    expect(res.status).toBe(201)
    expect(res.body.cliente).toHaveProperty('id')
    clienteId = res.body.cliente.id
  })

  it('não deve criar cliente com CPF inválido', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nomeCompleto: 'Lucas Inválido',
        cpf: '111',
        telefone: '19999999999',
        email: 'lucas.invalido@massa.com',
        aceitaPromocoes: true,
        aceitaTermos: true
      })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve listar clientes ativos', async () => {
    const res = await request(app)
      .get('/clientes')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deve atualizar cliente', async () => {
    const res = await request(app)
      .put(`/clientes/${clienteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ telefone: '19988888888' })

    expect(res.status).toBe(200)
    expect(res.body.cliente.telefone).toBe('19988888888')
  })

  it('deve desativar cliente', async () => {
    const res = await request(app)
      .patch(`/clientes/${clienteId}/desativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.cliente.ativo).toBe(false)
  })

  it('deve reativar cliente', async () => {
    const res = await request(app)
      .patch(`/clientes/${clienteId}/reativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.cliente.ativo).toBe(true)
  })

  it('deve excluir cliente', async () => {
    const res = await request(app)
      .delete(`/clientes/${clienteId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('mensagem')
  })
})
