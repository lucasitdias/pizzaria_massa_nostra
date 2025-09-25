import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CentroDeCustoService {
  // Cria um novo centro de custo
  async criar(dados: {
    nome: string
    descricao?: string
    ativo?: boolean
  }) {
    return prisma.centroDeCusto.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        ativo: dados.ativo ?? true
      }
    })
  }

  // Lista todos os centros de custo ativos
  async listarAtivos() {
    return prisma.centroDeCusto.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    })
  }
}
