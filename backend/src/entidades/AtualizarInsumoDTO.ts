import { CriarInsumoDTO } from './CriarInsumoDTO'

// DTO para atualização parcial de insumo.
// Utilizado em rotas de PUT ou PATCH /insumos/:id

export type AtualizarInsumoDTO = Partial<CriarInsumoDTO>
