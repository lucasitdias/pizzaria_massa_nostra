import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ComprovanteParams {
  pedidoId: number
  valor: number
  formaPagamento: string
  imagemUrl?: string
}

// Cria um novo comprovante
export async function registrarComprovante(params: ComprovanteParams) {
  return prisma.comprovante.create({
    data: {
      pedidoId: params.pedidoId,
      valor: params.valor,
      formaPagamento: params.formaPagamento,
      imagemUrl: params.imagemUrl ?? null,
      ativo: true
    }
  })
}

// Busca comprovantes vinculados a um pedido
export async function buscarComprovantesPorPedido(pedidoId: number) {
  return prisma.comprovante.findMany({
    where: { pedidoId, ativo: true }
  })
}
