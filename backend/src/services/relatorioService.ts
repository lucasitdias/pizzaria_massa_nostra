// src/services/relatorioService.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Gera relatório de pedidos por período

export async function gerarRelatorioPedidos(inicio: string, fim: string) {
  return prisma.pedido.findMany({
    where: {
      criadoEm: {
        gte: new Date(inicio),
        lte: new Date(fim)
      }
    },
    include: {
      cliente: true,
      pizzas: true,
      bebidas: true,
      centroDeCusto: true
    }
  })
}

// Gera resumo consolidado de vendas por período

export async function gerarResumoVendas(inicio: string, fim: string) {
  const pedidos = await prisma.pedido.findMany({
    where: {
      criadoEm: {
        gte: new Date(inicio),
        lte: new Date(fim)
      }
    },
    include: {
      pizzas: true,
      bebidas: true
    }
  })

  const totalPedidos = pedidos.length
  const totalVendas = pedidos.reduce((acc, p) => acc + (p.valorTotal ?? 0), 0)
  const totalPizzas = pedidos.reduce((acc, p) => acc + p.pizzas.reduce((a, pizza) => a + pizza.quantidade, 0), 0)
  const totalBebidas = pedidos.reduce((acc, p) => acc + p.bebidas.reduce((a, b) => a + b.quantidade, 0), 0)

  return {
    totalPedidos,
    totalVendas: +totalVendas.toFixed(2),
    totalPizzas,
    totalBebidas
  }
}

// Gera relatório financeiro por período

export async function gerarRelatorioFinanceiro(inicio: string, fim: string) {
  return prisma.financeiro.findMany({
    where: {
      criadoEm: {
        gte: new Date(inicio),
        lte: new Date(fim)
      }
    },
    orderBy: { criadoEm: 'asc' }
  })
}
