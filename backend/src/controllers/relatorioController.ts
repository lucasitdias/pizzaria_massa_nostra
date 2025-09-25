import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoFinanceiro, StatusEntrega } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Relatório de vendas por período
export async function gerarRelatorioVendas(req: Request, res: Response) {
  const { dataInicio, dataFim } = req.body

  try {
    const vendas = await prisma.pedido.findMany({
      where: {
        criadoEm: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim)
        },
        status: { not: 'CANCELADO' }
      },
      include: {
        cliente: true,
        pizzas: true,
        pagamentos: true
      }
    })

    res.json({ periodo: { dataInicio, dataFim }, total: vendas.length, vendas })
  } catch (erro) {
    console.error('Erro ao gerar relatório de vendas:', erro)
    res.status(500).json(erroPadrao('Erro ao gerar relatório de vendas.', erro))
  }
}

// Relatório de clientes ativos/inativos
export async function gerarRelatorioClientes(req: Request, res: Response) {
  try {
    const ativos = await prisma.cliente.count({ where: { ativo: true } })
    const inativos = await prisma.cliente.count({ where: { ativo: false } })

    res.json({ ativos, inativos })
  } catch (erro) {
    console.error('Erro ao gerar relatório de clientes:', erro)
    res.status(500).json(erroPadrao('Erro ao gerar relatório de clientes.', erro))
  }
}

// Relatório financeiro (fluxo de caixa, lucro, despesas)
export async function gerarRelatorioFinanceiro(req: Request, res: Response) {
  const { dataInicio, dataFim } = req.body

  try {
    const registros = await prisma.financeiro.findMany({
      where: {
        data: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim)
        },
        ativo: true
      }
    })

    const entradas = registros.filter(r => r.tipo === TipoFinanceiro.RECEITA)
    const saidas = registros.filter(r => r.tipo === TipoFinanceiro.DESPESA)

    const totalEntradas = entradas.reduce((acc, r) => acc + r.valor, 0)
    const totalSaidas = saidas.reduce((acc, r) => acc + r.valor, 0)
    const saldo = totalEntradas - totalSaidas

    res.json({ periodo: { dataInicio, dataFim }, totalEntradas, totalSaidas, saldo, registros })
  } catch (erro) {
    console.error('Erro ao gerar relatório financeiro:', erro)
    res.status(500).json(erroPadrao('Erro ao gerar relatório financeiro.', erro))
  }
}

// Relatório de produtos mais vendidos
export async function gerarRelatorioProdutosMaisVendidos(req: Request, res: Response) {
  try {
    const produtos = await prisma.pizzaPedido.groupBy({
      by: ['pizzaId'],
      _count: { pizzaId: true },
      orderBy: { _count: { pizzaId: 'desc' } },
      take: 10
    })

    const detalhado = await Promise.all(
      produtos.map(async p => {
        const pizza = await prisma.pizza.findUnique({ where: { id: p.pizzaId } })
        return { pizza: pizza?.nome || 'Desconhecida', quantidade: p._count.pizzaId }
      })
    )

    res.json(detalhado)
  } catch (erro) {
    console.error('Erro ao gerar relatório de produtos mais vendidos:', erro)
    res.status(500).json(erroPadrao('Erro ao gerar relatório de produtos mais vendidos.', erro))
  }
}

// Relatório de campanhas promocionais
export async function gerarRelatorioCampanhas(req: Request, res: Response) {
  try {
    const campanhas = await prisma.campanha.findMany({
      where: { ativo: true }
    })

    res.json(campanhas)
  } catch (erro) {
    console.error('Erro ao gerar relatório de campanhas:', erro)
    res.status(500).json(erroPadrao('Erro ao gerar relatório de campanhas.', erro))
  }
}

// Relatório de entregas por status
export async function gerarRelatorioEntregas(req: Request, res: Response) {
  try {
    const pendentes = await prisma.entrega.count({ where: { status: StatusEntrega.PENDENTE } })
    const emRota = await prisma.entrega.count({ where: { status: StatusEntrega.EM_TRANSITO } })
    const entregues = await prisma.entrega.count({ where: { status: StatusEntrega.ENTREGUE } })

    res.json({ pendentes, emRota, entregues })
  } catch (erro) {
    console.error('Erro ao gerar relatório de entregas:', erro)
    res.status(500).json(erroPadrao('Erro ao gerar relatório de entregas.', erro))
  }
}
