import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CotacaoParams {
  fornecedorId: number
  prazoEntrega?: string
  observacoes?: string
  insumos: { insumoId: number; quantidade: number }[]
}

// Cria uma nova cotação com itens
export async function registrarCotacao(params: CotacaoParams) {
  return prisma.cotacao.create({
    data: {
      fornecedorId: params.fornecedorId,
      prazoEntrega: params.prazoEntrega ?? null,
      observacoes: params.observacoes ?? null,
      ativo: true,
      itens: {
        create: params.insumos.map(insumo => ({
          insumoId: insumo.insumoId,
          quantidade: insumo.quantidade
        }))
      }
    }
  })
}

// Busca cotações de um fornecedor com os itens
export async function buscarCotacoesPorFornecedor(fornecedorId: number) {
  return prisma.cotacao.findMany({
    where: { fornecedorId, ativo: true },
    include: { itens: true }
  })
}
