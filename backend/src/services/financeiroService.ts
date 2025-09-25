import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Interface de entrada
interface FinanceiroParams {
  tipo: 'RECEITA' | 'DESPESA'
  valor: number
  descricao: string
  categoria?: string
  data?: string | Date
}

// Criação de movimentação financeira
export async function registrarMovimentacao(params: FinanceiroParams) {
  return prisma.financeiro.create({
    data: {
      tipo: params.tipo,
      valor: params.valor,
      descricao: params.descricao,
      categoria: params.categoria ?? null,
      data: params.data ? new Date(params.data) : new Date(),
      ativo: true
    }
  })
}

// Listagem ordenada por data
export async function listarMovimentacoes() {
  return prisma.financeiro.findMany({
    orderBy: { data: 'desc' },
    where: { ativo: true }
  })
}
