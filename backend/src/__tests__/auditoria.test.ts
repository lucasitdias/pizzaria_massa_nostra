// src/__tests__/auditoria.test.ts
import request from 'supertest'
import app from '../app'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

describe('Auditoria API', () => {
  let token: string
  let pizzaId: number

  beforeAll(async () => {
    // Autenticar usuário administrador
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@massa.com', senha: '123456' })

    token = res.body.token
  })

  it('deve criar uma pizza e registrar auditoria', async () => {
    // Criar pizza via API
    const res = await request(app)
      .post('/pizzas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Teste Auditoria',
        ingredientes: 'tomate, manjericão',
        preco: 30,
        tipo: 'salgada'
      })

    expect(res.status).toBe(201)
    pizzaId = res.body.pizza.id

    // Verificar se auditoria foi registrada
    const auditoria = await prisma.auditoria.findMany({
      where: {
        entidade: 'pizza',
        entidadeId: pizzaId,
        acao: 'criar'
      }
    })

    expect(auditoria.length).toBeGreaterThan(0)
    expect(auditoria[0].usuario).toBe('admin@massa.com')
  })
})
