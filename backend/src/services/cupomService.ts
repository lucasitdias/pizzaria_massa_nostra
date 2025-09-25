import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function validarCupom(codigo: string) {
  const cupom = await prisma.cupom.findUnique({ where: { codigo } })
  if (!cupom || !cupom.ativo) return null

  const hoje = new Date()
  const validade = new Date(cupom.dataValidade)
  if (validade < hoje) return null

  return cupom
}

export async function aplicarCupomAoPedido(pedidoId: number, cupomId: number) {
  return prisma.pedido.update({
    where: { id: pedidoId },
    data: { cupomId }
  })
}
