import prisma from '../config/prisma'
import { calcularPrecoFinal } from '../validations/validadoresInsumo'
import { enviarAlertaValidade } from '../utils/email'
import { CriarInsumoDTO } from '../entidades/CriarInsumoDTO'
import { AtualizarInsumoDTO } from '../entidades/AtualizarInsumoDTO'

export class InsumoService {
  async criar(data: CriarInsumoDTO) {
    const precoFinal = calcularPrecoFinal(data)

    return prisma.insumo.create({
      data: {
        nome: data.nome,
        categoria: data.categoria,
        unidadeMedida: data.unidadeMedida,
        quantidadeEstoque: data.quantidadeEstoque,
        precoCusto: data.precoCusto ?? undefined,
        precoUnitario: data.precoUnitario,
        precoFinal: precoFinal ?? undefined,
        margemLucro: data.margemLucro ?? undefined,
        estoqueMinimo: data.estoqueMinimo ?? undefined,
        validade: data.validade ? new Date(data.validade) : undefined,
        fornecedorId: data.fornecedorId ?? undefined
      }
    })
  }

  async atualizar(id: number, data: AtualizarInsumoDTO) {
    const precoFinal = calcularPrecoFinal(data)

    return prisma.insumo.update({
      where: { id },
      data: {
        nome: data.nome ?? undefined,
        categoria: data.categoria ?? undefined,
        unidadeMedida: data.unidadeMedida ?? undefined,
        quantidadeEstoque: data.quantidadeEstoque ?? undefined,
        precoCusto: data.precoCusto ?? undefined,
        precoUnitario: data.precoUnitario ?? undefined,
        precoFinal: precoFinal ?? undefined,
        margemLucro: data.margemLucro ?? undefined,
        estoqueMinimo: data.estoqueMinimo ?? undefined,
        validade: data.validade ? new Date(data.validade) : undefined,
        fornecedorId: data.fornecedorId ?? undefined
      }
    })
  }

  async listar() {
    return prisma.insumo.findMany()
  }

  async buscarPorId(id: number) {
    return prisma.insumo.findUnique({ where: { id } })
  }

  async inativar(id: number) {
    return prisma.insumo.update({
      where: { id },
      data: { ativo: false }
    })
  }

  async ativar(id: number) {
    return prisma.insumo.update({
      where: { id },
      data: { ativo: true }
    })
  }

  async excluir(id: number) {
    return prisma.insumo.delete({ where: { id } })
  }

  async filtrarAvancado(filtros: any) {
    return prisma.insumo.findMany({ where: filtros })
  }

  async verificarValidadeProxima() {
    const hoje = new Date()
    const limite = new Date()
    limite.setDate(hoje.getDate() + 7)

    const proximos = await prisma.insumo.findMany({
      where: {
        validade: {
          gte: hoje,
          lte: limite
        },
        ativo: true
      }
    })

    for (const insumo of proximos) {
      await enviarAlertaValidade(insumo)
    }

    return proximos
  }

  async verificarDuplicado(nome: string, unidadeMedida: string) {
    return prisma.insumo.findFirst({
      where: { nome, unidadeMedida }
    })
  }
}
