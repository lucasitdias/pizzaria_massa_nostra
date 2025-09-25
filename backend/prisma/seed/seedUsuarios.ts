import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('[SEED USUÁRIOS] Iniciando...')

  const senhaHash = await bcrypt.hash('123456', 10)

  const usuarios = [
    {
      nome: 'Marta Teste',
      email: 'marta@massa.com',
      senha: senhaHash,
      setor: 'Administrativo',
      cargo: 'Gerente',
      perfil: 'ADMIN',
      ativo: true
    },
    {
      nome: 'Lucas Teste',
      email: 'lucas@teste.com',
      senha: senhaHash,
      setor: 'TI',
      cargo: 'Desenvolvedor',
      perfil: 'ADMIN',
      ativo: true
    }
  ]

  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: usuario
    })
  }

  const total = await prisma.usuario.count()
  console.log(`[SEED USUÁRIOS] Total de usuários no banco: ${total}`)
}

main()
  .catch((e) => {
    console.error('[SEED USUÁRIOS] Erro ao popular usuários:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
