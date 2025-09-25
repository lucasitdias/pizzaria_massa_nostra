import { Response } from 'express'
import { Request } from 'express-serve-static-core'
import { PrismaClient, TipoOperacao } from '@prisma/client'
import { erroPadrao } from '../validations/validadores'

const prisma = new PrismaClient()

// Listar movimentações financeiras
// Apenas admins podem acessar

export async function listarMovimentacoes(req: Request, res: Response) {
  try {
    const movimentacoes = await prisma.movimentacaoFinanceira.findMany({
      orderBy: { data: 'desc' }
    })

    return res.json(movimentacoes)
  } catch (erro) {
    console.error('Erro ao listar movimentações:', erro)
    return res.status(500).json(erroPadrao('Erro ao listar movimentações financeiras.', erro))
  }
}

// Registrar recebimento (exemplo: pagamento de pedido)

export async function registrarRecebimento(req: Request, res: Response) {
  const { valor, descricao, pedidoId } = req.body

  if (!valor || valor <= 0) {
    return res.status(400).json({ erro: 'Valor do recebimento deve ser positivo.' })
  }

  try {
    const recebimento = await prisma.movimentacaoFinanceira.create({
      data: {
        tipo: 'RECEBIMENTO',
        valor,
        descricao,
        pedidoId,
        data: new Date()
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Registro de recebimento',
        entidade: 'MovimentacaoFinanceira',
        entidadeId: recebimento.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Recebimento registrado com sucesso.',
      recebimento
    })
  } catch (erro) {
    console.error('Erro ao registrar recebimento:', erro)
    return res.status(500).json(erroPadrao('Erro ao registrar recebimento.', erro))
  }
}

// Registrar pagamento (exemplo: fornecedor, despesa)
// Apenas admins podem acessar

export async function registrarPagamento(req: Request, res: Response) {
  const { valor, descricao, fornecedorId } = req.body

  if (!valor || valor <= 0) {
    return res.status(400).json({ erro: 'Valor do pagamento deve ser positivo.' })
  }

  try {
    const pagamento = await prisma.movimentacaoFinanceira.create({
      data: {
        tipo: 'PAGAMENTO',
        valor,
        descricao,
        fornecedorId,
        data: new Date()
      }
    })

    await prisma.auditoria.create({
      data: {
        usuario: req.user?.email || 'sistema',
        funcionarioId: req.user?.id || 0,
        acao: 'Registro de pagamento',
        entidade: 'MovimentacaoFinanceira',
        entidadeId: pagamento.id,
        tipoOperacao: TipoOperacao.CRIACAO,
        ipOrigem: req.ip || 'IP não identificado',
        ativo: true
      }
    })

    return res.status(201).json({
      mensagem: 'Pagamento registrado com sucesso.',
      pagamento
    })
  } catch (erro) {
    console.error('Erro ao registrar pagamento:', erro)
    return res.status(500).json(erroPadrao('Erro ao registrar pagamento.', erro))
  }
}

// Gerar resumo financeiro (fluxo de caixa)
// Apenas admins podem acessar

export async function gerarResumoFinanceiro(req: Request, res: Response) {
  try {
    const recebimentos = await prisma.movimentacaoFinanceira.aggregate({
      _sum: { valor: true },
      where: { tipo: 'RECEBIMENTO' }
    })

    const pagamentos = await prisma.movimentacaoFinanceira.aggregate({
      _sum: { valor: true },
      where: { tipo: 'PAGAMENTO' }
    })

    const totalRecebido = recebimentos._sum.valor || 0
    const totalPago = pagamentos._sum.valor || 0
    const saldo = totalRecebido - totalPago

    return res.json({
      totalRecebido,
      totalPago,
      saldo
    })
  } catch (erro) {
    console.error('Erro ao gerar resumo financeiro:', erro)
    return res.status(500).json(erroPadrao('Erro ao gerar resumo financeiro.', erro))
  }
}
