import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedDev() {
  console.log('[SEED DEV] Populando dados mínimos para desenvolvimento...')

  await prisma.usuario.create({
    data: {
      nome: 'Lucas Luigi Dias Custodio',
      email: 'dev@massa.com',
      senha: '1234567890',
      perfil: 'admin',
      setor: 'TI',
      cargo: 'Desenvolvedor',
      ativo: true
    }
  })

  await prisma.centroDeCusto.create({
    data: {
      nome: 'Dev Center',
      descricao: 'Centro de custo para testes locais',
      ativo: true
    }
  })

  await prisma.insumo.createMany({
    data: [
      { nome: 'Farinha', categoria: 'Base', unidadeMedida: 'kg', precoUnitario: 3.5 },
      { nome: 'Água', categoria: 'Base', unidadeMedida: 'litro', precoUnitario: 0.5 }
    ]
  })

  console.log('[SEED DEV] Dados mínimos criados com sucesso!')
}

seedDev()
  .catch((e) => {
    console.error('[SEED DEV] Erro ao popular dados de desenvolvimento:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
