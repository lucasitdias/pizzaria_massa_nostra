import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  console.log('Iniciando seed de testes...')

  // Criar usuário administrativo
  await prisma.usuario.create({
    data: {
      nome: 'Admin Teste',
      email: 'admin@teste.com',
      senha: '$2b$10$1234567890123456789012', // hash fictício
      setor: 'TI',
      cargo: 'Administrador',
      perfil: 'admin',
      ativo: true,
    },
  })

  // Criar endereço de entrega
  const endereco = await prisma.enderecoEntrega.create({
    data: {
      rua: 'Rua Teste',
      numero: '100',
      bairro: 'Centro',
      cep: '13290-000',
      cidade: 'Louveira',
      pontoReferencia: 'Próximo à pizzaria',
    },
  })

  // Criar cliente com vínculo ao endereço
  const cliente = await prisma.cliente.create({
    data: {
      nomeCompleto: 'Cliente Teste',
      cpf: '12345678900',
      email: 'cliente@teste.com',
      telefone: '11999999999',
      aceitaPromocoes: true,
      aceitaTermos: true,
      enderecoId: endereco.id,
      ativo: true,
    },
  })

  // Criar centro de custo
  const centro = await prisma.centroDeCusto.create({
    data: {
      nome: 'Delivery Teste',
      descricao: 'Centro de custo para pedidos de teste',
      ativo: true,
    },
  })

  // Criar insumos
  const insumo1 = await prisma.insumo.create({
    data: {
      nome: 'Queijo',
      categoria: 'Laticínios',
      unidadeMedida: 'g',
      quantidadeEstoque: 1000,
      precoCusto: 20,
      precoUnitario: 0.2,
      ativo: true,
    },
  })

  const insumo2 = await prisma.insumo.create({
    data: {
      nome: 'Tomate',
      categoria: 'Vegetais',
      unidadeMedida: 'g',
      quantidadeEstoque: 800,
      precoCusto: 10,
      precoUnitario: 0.1,
      ativo: true,
    },
  })

  // Criar pizza com insumos
  const pizza = await prisma.pizza.create({
    data: {
      nome: 'Margherita Teste',
      preco: 30,
      ingredientes: ['Queijo', 'Tomate', 'Manjericão'],
      tipo: 'salgada',
      tamanho: 'media',
      pizzaPedidos: {
        create: [],
      },
    },
  })

  // Criar pedido com pizza e insumos vinculados
  await prisma.pedido.create({
    data: {
      clienteId: cliente.id,
      centroDeCustoId: centro.id,
      formaPagamento: 'dinheiro',
      status: 'SOLICITADO',
      valorTotal: 30,
      pizzas: {
        create: [
          {
            pizzaId: pizza.id,
            nome: pizza.nome,
            precoVenda: pizza.preco,
            quantidade: 1,
            insumos: {
              create: [
                { insumoId: insumo1.id, quantidadeUtilizada: 150 },
                { insumoId: insumo2.id, quantidadeUtilizada: 100 },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('Seed de testes concluído com sucesso!')
}

seed()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
