import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedCampanhas() {
  console.log('[SEED CAMPANHAS] Iniciando cadastro de campanhas promocionais...')

  const campanhas = [
    {
      nome: 'Campanha 2 por 1',
      titulo: 'Promoção 2 por 1',
      tipo: 'combo',
      descricao: 'Na compra de 2 pizzas grandes, leve 1 refrigerante grátis',
      ativo: true,
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      criadoEm: new Date()
    },
    {
      nome: 'Campanha Pizza Doce',
      titulo: 'Pizza Doce em Dobro',
      tipo: 'desconto',
      descricao: 'Toda sexta-feira, pizza doce em dobro',
      ativo: true,
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      criadoEm: new Date()
    }
  ]

  for (const campanha of campanhas) {
    await prisma.campanha.create({ data: campanha })
  }

  console.log('[SEED CAMPANHAS] Campanhas cadastradas com sucesso!')
}

seedCampanhas()
  .catch((e) => {
    console.error('[SEED CAMPANHAS] Erro ao cadastrar campanhas:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
