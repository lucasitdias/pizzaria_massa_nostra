import { Router } from 'express'
import { Response, Request } from 'express'
import { PrismaClient, TipoFinanceiro, StatusEntrega } from '@prisma/client'
import {
  gerarResumoVendas,
  gerarRelatorioPedidos,
  gerarRelatorioFinanceiro as gerarFinanceiroService
} from '../services/relatorioService'

const prisma = new PrismaClient()
const router = Router()

// --------------------
// ROTAS
// --------------------

router.post('/vendas', async (req: Request, res: Response) => {
  try {
    const { inicio, fim } = req.body
    const relatorio = await gerarResumoVendas(inicio, fim)
    return res.json(relatorio)
  } catch (erro) {
    console.error('Erro ao gerar relatório de vendas:', erro)
    return res.status(500).json({
      erro: 'Erro ao gerar relatório de vendas.',
      detalhes: erro instanceof Error ? erro.message : String(erro)
    })
  }
})

router.get('/clientes', async (_req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: { endereco: true },
      orderBy: { criadoEm: 'desc' }
    })

    const ativos = clientes.filter(c => c.ativo)
    const inativos = clientes.filter(c => !c.ativo)

    return res.json({
      total: clientes.length,
      ativos: ativos.length,
      inativos: inativos.length,
      lista: clientes
    })
  } catch (erro) {
    console.error('Erro ao gerar relatório de clientes:', erro)
    return res.status(500).json({ erro: 'Erro ao gerar relatório de clientes.' })
  }
})

router.post('/financeiro', async (req: Request, res: Response) => {
  try {
    const { inicio, fim } = req.body
    const registros = await gerarFinanceiroService(inicio, fim)

    const totalReceita = registros
      .filter(r => r.tipo === TipoFinanceiro.RECEITA)
      .reduce((acc, r) => acc + r.valor, 0)

    const totalDespesa = registros
      .filter(r => r.tipo === TipoFinanceiro.DESPESA)
      .reduce((acc, r) => acc + r.valor, 0)

    const saldo = totalReceita - totalDespesa

    return res.json({
      totalReceita: +totalReceita.toFixed(2),
      totalDespesa: +totalDespesa.toFixed(2),
      saldo: +saldo.toFixed(2),
      registros
    })
  } catch (erro) {
    console.error('Erro ao gerar relatório financeiro:', erro)
    return res.status(500).json({ erro: 'Erro ao gerar relatório financeiro.' })
  }
})

router.get('/produtos-mais-vendidos', async (_req: Request, res: Response) => {
  try {
    const pizzas = await prisma.pizza.findMany({
      orderBy: { vendas: 'desc' },
      take: 10
    })

    return res.json(pizzas)
  } catch (erro) {
    console.error('Erro ao gerar relatório de produtos:', erro)
    return res.status(500).json({ erro: 'Erro ao gerar relatório de produtos.' })
  }
})

router.get('/campanhas', async (_req: Request, res: Response) => {
  try {
    const campanhas = await prisma.campanha.findMany({
      orderBy: { criadoEm: 'desc' }
    })

    return res.json(campanhas)
  } catch (erro) {
    console.error('Erro ao gerar relatório de campanhas:', erro)
    return res.status(500).json({ erro: 'Erro ao gerar relatório de campanhas.' })
  }
})

router.get('/entregas', async (_req: Request, res: Response) => {
  try {
    const entregas = await prisma.entrega.findMany({
      orderBy: { criadoEm: 'desc' }
    })

    const pendentes = entregas.filter(e => e.status === StatusEntrega.PENDENTE)
    const emRota = entregas.filter(e => e.status === StatusEntrega.EM_TRANSITO)
    const entregues = entregas.filter(e => e.status === StatusEntrega.ENTREGUE)
    const canceladas = entregas.filter(e => e.status === StatusEntrega.CANCELADA)

    return res.json({
      total: entregas.length,
      pendentes: pendentes.length,
      emRota: emRota.length,
      entregues: entregues.length,
      canceladas: canceladas.length,
      lista: entregas
    })
  } catch (erro) {
    console.error('Erro ao gerar relatório de entregas:', erro)
    return res.status(500).json({ erro: 'Erro ao gerar relatório de entregas.' })
  }
})

// --------------------
// EXPORTAÇÃO PADRÃO
// --------------------
export default router
