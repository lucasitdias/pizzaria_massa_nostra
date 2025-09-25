// src/__tests__/auth.test.ts
import request from 'supertest'
import app from '../app'

describe('Autenticação API', () => {
  it('deve autenticar com credenciais válidas e retornar token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('não deve autenticar com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: 'senhaErrada' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('erro') // Certifique-se que a API retorna esse campo
  })

  it('deve bloquear acesso com token inválido', async () => {
    const res = await request(app)
      .get('/pizzas')
      .set('Authorization', 'Bearer token_invalido')

    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve bloquear acesso a rota protegida sem token', async () => {
    const res = await request(app)
      .get('/pedidos')

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve autenticar com outro usuário válido', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@teste.com', senha: '123456' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })
})
