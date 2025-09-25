import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Interface para criação de campanhas
interface CampanhaParams {
  nome: string
  descricao?: string
  inicio: string
  fim: string
  tipo: 'desconto' | 'brinde' | 'combo'
  ativo?: boolean
}

// Cria uma nova campanha de marketing
export async function criarCampanha(params: CampanhaParams) {
  return prisma.marketing.create({
    data: {
      nome: params.nome,
      descricao: params.descricao ?? null,
      inicio: new Date(params.inicio),
      fim: new Date(params.fim),
      tipo: params.tipo,
      ativo: params.ativo ?? true
    }
  })
}

// Lista campanhas ativas com validade futura
export async function listarCampanhasAtivas() {
  const hoje = new Date()
  return prisma.marketing.findMany({
    where: {
      ativo: true,
      fim: { gte: hoje }
    }
  })
}
