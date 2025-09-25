import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedCarga() {
  console.log('[SEED CARGA] Iniciando simulação de carga...')

  for (let i = 1; i <= 50; i++) {
    await prisma.cliente.create({
      data: {
        nomeCompleto: `Cliente ${i}`,
        cpf: `000000000${i.toString().padStart(2, '0')}`,
        email: `cliente${i}@massa.com`,
        telefone: `11999999${i.toString().padStart(2, '0')}`,
        aceitaPromocoes: true,
        aceitaTermos: true,
        ativo: true,
        endereco: {
          create: {
            rua: `Rua ${i}`,
            numero: `${i}`,
            bairro: 'Centro',
            cep: '13290-000',
            cidade: 'Louveira',
            pontoReferencia: 'Próximo ao centro'
          }
        }
      }
    })
  }

  console.log('[SEED CARGA] Clientes de carga cadastrados com sucesso!')
}

seedCarga()
  .catch((e) => {
    console.error('[SEED CARGA] Erro ao simular carga:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
