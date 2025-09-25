import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface IntegracaoParams {
  tipo: 'whatsapp' | 'erp'
  destino: string
  conteudo: string
}

export async function registrarIntegracao(params: IntegracaoParams) {
  return prisma.integracao.create({
    data: {
      tipo: params.tipo,
      destino: params.destino,
      conteudo: params.conteudo
    }
  })
}

export async function listarIntegracoes() {
  return prisma.integracao.findMany({
    orderBy: { criadoEm: 'desc' }
  })
}
