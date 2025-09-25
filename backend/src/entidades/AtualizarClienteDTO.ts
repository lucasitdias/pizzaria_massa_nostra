import { CriarClienteDTO } from './CriarClienteDTO'

// DTO para atualização parcial de cliente.
// Utilizado em rotas de PUT ou PATCH /clientes/:id

export type AtualizarClienteDTO = Partial<CriarClienteDTO>
