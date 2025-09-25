// src/__tests__/middleware.test.ts
import { verificarToken } from '../middlewares/verificarToken'
describe('Middleware verificarToken', () => {
  it('deve ser uma função', () => {
    expect(typeof verificarToken).toBe('function')
  })
})
