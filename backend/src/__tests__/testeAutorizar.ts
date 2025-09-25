// src/__tests__/autorizarPerfis.test.ts
import { autorizarPerfis } from '../middlewares/controleDeAcesso'

describe('Middleware autorizarPerfis', () => {
  it('deve ser uma função', () => {
    expect(typeof autorizarPerfis).toBe('function')
  })
})
