import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Atualiza ou cria uma configuração genérica por chave
export async function atualizarConfiguracao(chave: string, valor: string | number | boolean) {
  const valorConvertido = String(valor)

  // Busca configuração existente
  const existente = await prisma.configuracao.findUnique({ where: { chave } })

  if (existente) {
    return prisma.configuracao.update({
      where: { chave },
      data: { valor: valorConvertido }
    })
  }

  // Criação exige todos os campos obrigatórios
  return prisma.configuracao.create({
    data: {
      chave,
      valor: valorConvertido,
      margemLucro: 0,
      horarioAbertura: '08:00',
      horarioFechamento: '18:00',
      taxaEntrega: 0,
      tempoEstimadoEntrega: 30
    }
  })
}

// Busca configuração por chave
export async function buscarConfiguracao(chave: string) {
  return prisma.configuracao.findUnique({
    where: { chave }
  })
}
