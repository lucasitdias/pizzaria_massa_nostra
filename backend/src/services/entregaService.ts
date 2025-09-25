import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Função interna para registrar entrega no banco
async function registrarEntrega(dados: {
  pedidoId: number
  endereco: string
  observacoes?: string
  entregadorId?: number
}) {
  return prisma.entrega.create({
    data: {
      pedidoId: dados.pedidoId,
      entregadorId: dados.entregadorId ?? 1,
      endereco: dados.endereco,
      observacoes: dados.observacoes ?? null,
      status: 'PENDENTE',
      ativo: true
    }
  })
}

// Função exportada para uso externo (exemplo: pagamentoService)
export async function gerarEntregaParaPedido(pedidoId: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      cliente: {
        include: {
          endereco: true
        }
      }
    }
  })

  if (pedido && pedido.cliente?.endereco) {
    const endereco = `${pedido.cliente.endereco.rua}, ${pedido.cliente.endereco.numero}, ${pedido.cliente.endereco.bairro}, ${pedido.cliente.endereco.cidade}`

    await registrarEntrega({
      pedidoId,
      endereco,
      observacoes: 'Entrega gerada automaticamente após pagamento aprovado',
      entregadorId: 1 // entregador padrão definido explicitamente
    })
  }
}
