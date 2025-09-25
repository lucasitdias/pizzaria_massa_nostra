import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function resetDB() {
  console.log('[RESET] Limpando todas as tabelas...')

  await prisma.pedido.deleteMany()
  await prisma.pizza.deleteMany()
  await prisma.bebida.deleteMany()
  await prisma.insumo.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.enderecoEntrega.deleteMany()
  await prisma.centroDeCusto.deleteMany()

  console.log('[RESET] Banco de dados limpo com sucesso!')
}

resetDB()
  .catch((e) => {
    console.error('[RESET] Erro ao limpar banco:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
