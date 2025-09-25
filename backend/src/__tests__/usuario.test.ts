// src/__tests__/usuario.test.ts
import request from 'supertest'
import app from '../app'

describe('Usuário API', () => {
  let token: string
  let usuarioId: number

  beforeAll(async () => {
    // Autenticar usuário administrador
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    token = res.body.token
  })

  it('deve criar um usuário válido', async () => {
    const res = await request(app)
      .post('/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Novo Usuário',
        email: 'novo@massa.com',
        senha: 'senha123',
        cargo: 'atendente',
        setor: 'atendimento',
        perfil: 'funcionario',
        ativo: true
      })

    expect(res.status).toBe(201)
    expect(res.body.usuario).toHaveProperty('id')
    usuarioId = res.body.usuario.id
  })

  it('não deve criar usuário com dados inválidos', async () => {
    const res = await request(app)
      .post('/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: '',
        email: 'emailinvalido',
        senha: '',
        cargo: '',
        setor: '',
        perfil: ''
      })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve listar usuários ativos', async () => {
    const res = await request(app)
      .get('/usuarios')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deve atualizar usuário', async () => {
    const res = await request(app)
      .put(`/usuarios/${usuarioId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cargo: 'gerente' })

    expect(res.status).toBe(200)
    expect(res.body.usuario.cargo).toBe('gerente')
  })

  it('deve desativar usuário', async () => {
    const res = await request(app)
      .patch(`/usuarios/${usuarioId}/desativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.usuario.ativo).toBe(false)
  })

  it('deve reativar usuário', async () => {
    const res = await request(app)
      .patch(`/usuarios/${usuarioId}/reativar`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.usuario.ativo).toBe(true)
  })

  it('deve excluir usuário', async () => {
    const res = await request(app)
      .delete(`/usuarios/${usuarioId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('mensagem')
  })
})
