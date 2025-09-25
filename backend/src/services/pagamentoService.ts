import { PrismaClient } from '@prisma/client'
import { gerarEntregaParaPedido } from './entregaService'

const prisma = new PrismaClient()

export async function registrarPagamento(dados: {
  pedidoId: number
  valor: number
  valorPago: number
  formaPagamento: string
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO'
  data?: string
}) {
  const pagamento = await prisma.pagamento.create({
    data: {
      pedidoId: dados.pedidoId,
      valor: dados.valor,
      valorPago: dados.valorPago,
      formaPagamento: dados.formaPagamento,
      status: dados.status,
      data: dados.data ? new Date(dados.data) : new Date()
    }
  })

  // Gera entrega automaticamente se o pagamento for aprovado
  if (dados.status === 'APROVADO') {
    await gerarEntregaParaPedido(dados.pedidoId)
  }

  return pagamento
}
