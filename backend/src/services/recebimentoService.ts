import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RecebimentoParams {
  clienteId: number
  valor: number
  formaRecebimento: string
  data?: string
  observacoes?: string
}

export async function registrarRecebimento(params: RecebimentoParams) {
  return prisma.recebimento.create({
    data: {
      clienteId: params.clienteId,
      valor: params.valor,
      formaRecebimento: params.formaRecebimento,
      data: params.data ? new Date(params.data) : new Date(),
      observacoes: params.observacoes ?? null
    }
  })
}

export async function listarRecebimentosPorCliente(clienteId: number) {
  return prisma.recebimento.findMany({ where: { clienteId } })
}
