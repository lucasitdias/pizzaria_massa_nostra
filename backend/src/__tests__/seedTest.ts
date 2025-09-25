// src/__tests__/seedTest.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedTest() {
  console.log('Iniciando seed de teste...')

  // Cria endereço de entrega
  const endereco = await prisma.enderecoEntrega.create({
    data: {
      rua: 'Rua Teste',
      numero: '100',
      bairro: 'Centro',
      cep: '13290-000',
      cidade: 'Louveira',
      pontoReferencia: 'Próximo à pizzaria'
    }
  })

  // Cria cliente
  const cliente = await prisma.cliente.create({
    data: {
      nomeCompleto: 'Cliente Teste',
      cpf: '12345678901',
      telefone: '19999999999',
      email: 'cliente@teste.com',
      aceitaPromocoes: true,
      aceitaTermos: true,
      enderecoId: endereco.id,
      ativo: true
    }
  })

  // Cria pizza
  const pizza = await prisma.pizza.create({
    data: {
      nome: 'Pizza Teste',
      ingredientes: ['mussarela', 'tomate'],
      preco: 30,
      tipo: 'salgada',
      tamanho: 'media'
    }
  })

  // Cria bebida
  const bebida = await prisma.bebida.create({
    data: {
      nome: 'Coca-Cola',
      volume: '350ml',
      tipo: 'refrigerante',
      embalagem: 'lata',
      precoFinal: 6,
      ativo: true
    }
  })

  // Cria usuário
  const usuario = await prisma.usuario.create({
    data: {
      nome: 'Admin Teste',
      email: 'admin@massa.com',
      senha: '123456', // hash se necessário
      setor: 'TI',
      cargo: 'Administrador',
      perfil: 'admin',
      ativo: true
    }
  })

  console.log('Seed de teste concluído')
}

seedTest()
  .catch((e) => console.error('Erro no seed:', e))
  .finally(() => prisma.$disconnect())
