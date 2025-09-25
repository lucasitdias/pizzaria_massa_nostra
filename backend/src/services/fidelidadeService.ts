import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tipagem direta com os valores do enum
type TipoFidelidade = 'ACUMULADO' | 'RESGATE'

interface FidelidadeParams {
  clienteId: number
  pontos: number
  tipo: TipoFidelidade
  recompensaId?: number
}

// Cria registro de fidelidade
export async function registrarFidelidade(params: FidelidadeParams) {
  return prisma.fidelidade.create({
    data: {
      clienteId: params.clienteId,
      pontos: params.pontos,
      tipo: params.tipo,
      recompensaId: params.recompensaId ?? null,
      ativo: true
    }
  })
}

// Calcula pontuação total do cliente
export async function buscarPontuacao(clienteId: number) {
  const acumulado = await prisma.fidelidade.aggregate({
    where: { clienteId, tipo: 'ACUMULADO', ativo: true },
    _sum: { pontos: true }
  })

  const resgatado = await prisma.fidelidade.aggregate({
    where: { clienteId, tipo: 'RESGATE', ativo: true },
    _sum: { pontos: true }
  })

  return {
    total: (acumulado._sum.pontos ?? 0) - (resgatado._sum.pontos ?? 0)
  }
}
