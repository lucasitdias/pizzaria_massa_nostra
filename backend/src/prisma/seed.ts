import { PrismaClient, StatusPedido } from '@prisma/client'
import bcrypt from 'bcrypt'
import { bebidasFixas } from '../data/bebidasFixas'
import { classificarBebida, calcularPrecoFinal } from '../services/regraPrecosBebidas'
import { pizzasDocesFixas } from '../data/pizzasDocesFixas'

const prisma = new PrismaClient()

async function main() {
  console.log('[SEED] Iniciando limpeza de dados...')
  await prisma.pedido.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.insumo.deleteMany()
  await prisma.pizza.deleteMany()
  await prisma.bebida.deleteMany()
  await prisma.centroDeCusto.deleteMany()

  console.log('[SEED] Criando usuários...')
  const senhaCriptografada = await bcrypt.hash('123456', 10)

  await prisma.usuario.createMany({
    data: [
      {
        nome: 'Lucas Admin',
        email: 'lucas@massa.com',
        senha: senhaCriptografada,
        perfil: 'admin',
        setor: 'gerencia',
        cargo: 'Administrador',
        ativo: true
      },
      {
        nome: 'João Garçom',
        email: 'joao@massa.com',
        senha: senhaCriptografada,
        perfil: 'garçom',
        setor: 'atendimento',
        cargo: 'Garçom',
        ativo: true
      }
    ]
  })

  console.log('[SEED] Criando cliente...')
  const cliente = await prisma.cliente.create({
    data: {
      nomeCompleto: 'Maria Cliente',
      cpf: '98765432100',
      telefone: '11988887777',
      email: 'maria@email.com',
      aceitaPromocoes: true,
      aceitaTermos: true,
      endereco: {
        create: {
          rua: 'Rua das Flores',
          numero: '456',
          bairro: 'Jardim',
          cep: '13000-001',
          cidade: 'Campinas',
          pontoReferencia: 'Próximo à padaria'
        }
      }
    }
  })

  console.log('[SEED] Criando insumos...')
  await prisma.insumo.createMany({
    data: [
      { nome: 'Calabresa', categoria: 'Carne', unidadeMedida: 'kg', precoUnitario: 10.0 },
      { nome: 'Queijo', categoria: 'Laticínio', unidadeMedida: 'kg', precoUnitario: 12.0 },
      { nome: 'Cebola', categoria: 'Vegetal', unidadeMedida: 'kg', precoUnitario: 8.0 },
      { nome: 'Molho de tomate', categoria: 'Molho', unidadeMedida: 'litro', precoUnitario: 6.0 }
    ]
  })

  console.log('[SEED] Criando pizzas salgadas...')
  await prisma.pizza.createMany({
    data: [
      {
        nome: 'Calabresa',
        preco: 35.0,
        ingredientes: ['Calabresa', 'queijo', 'cebola'],
        tamanho: 'grande',
        tipo: 'salgada'
      },
      {
        nome: 'Quatro Queijos',
        preco: 42.0,
        ingredientes: ['Mussarela', 'parmesão', 'provolone', 'gorgonzola'],
        tamanho: 'grande',
        tipo: 'salgada'
      },
      {
        nome: 'Marguerita',
        preco: 38.0,
        ingredientes: ['Mussarela', 'tomate', 'manjericão'],
        tamanho: 'grande',
        tipo: 'salgada'
      }
    ]
  })

  console.log('[SEED] Cadastrando bebidas fixas...')
  for (const bebida of bebidasFixas) {
    const bebidaExistente = await prisma.bebida.findFirst({
      where: { nome: bebida.nome.trim(), volume: bebida.volume.trim() }
    })

    if (bebidaExistente) {
      console.log(`[WARN] ${bebida.nome} já cadastrada. Ignorando.`)
      continue
    }

    const classificada = classificarBebida(bebida)
    const precoFinal = calcularPrecoFinal(classificada)

    await prisma.bebida.create({
      data: {
        nome: bebida.nome.trim(),
        volume: bebida.volume.trim(),
        tipo: classificada.tipo,
        embalagem: classificada.embalagem,
        precoFinal,
        ativo: true
      }
    })

    console.log(`[INFO] ${bebida.nome} cadastrada com sucesso.`)
  }

  console.log('[SEED] Criando centro de custo...')
  const centro = await prisma.centroDeCusto.create({
    data: {
      nome: 'Produção',
      descricao: 'Setor de produção de pizzas'
    }
  })

  console.log('[SEED] Cadastrando pizzas doces fixas...')
  for (const sabor of pizzasDocesFixas) {
    const existe = await prisma.pizza.findFirst({
      where: {
        nome: sabor.nome.trim(),
        preco: sabor.precoBase
      }
    })

    if (!existe) {
      await prisma.pizza.create({
        data: {
          nome: sabor.nome.trim(),
          preco: sabor.precoBase,
          ingredientes: sabor.ingredientes.split(',').map(i => i.trim()),
          tamanho: 'grande',
          tipo: 'doce'
        }
      })
      console.log(`[INFO] ${sabor.nome} cadastrada`)
    } else {
      console.log(`[WARN] ${sabor.nome} já existe`)
    }
  }

  console.log('[SEED] Cadastrando pizza doce personalizada...')
  const precoFinal = 31.0
  const nomePersonalizada = 'Meia Nutella / Meia Banana'
  const ingredientesPersonalizados = 'nutella, banana, borda vulcão com recheio de brigadeiro'

  const existePersonalizada = await prisma.pizza.findFirst({
    where: {
      nome: nomePersonalizada,
      preco: precoFinal
    }
  })

  if (!existePersonalizada) {
    await prisma.pizza.create({
      data: {
        nome: nomePersonalizada,
        preco: precoFinal,
        ingredientes: ingredientesPersonalizados.split(',').map(i => i.trim()),
        tamanho: 'grande',
        tipo: 'doce'
      }
    })
    console.log(`[INFO] Pizza personalizada cadastrada: ${nomePersonalizada}`)
  } else {
    console.log(`[WARN] Pizza personalizada já existe: ${nomePersonalizada}`)
  }

  console.log('[SEED] Criando pedido de teste...')
  const pizzaCalabresa = await prisma.pizza.findFirst({
    where: { nome: 'Calabresa' }
  })

  if (pizzaCalabresa) {
    const quantidade = 2
    const valorTotal = pizzaCalabresa.preco * quantidade

    await prisma.pedido.create({
      data: {
        clienteId: cliente.id,
        centroDeCustoId: centro.id,
        formaPagamento: 'dinheiro',
        observacoes: 'Sem cebola',
        status: StatusPedido.SOLICITADO,
        valorTotal,
        pizzas: {
          create: [
            {
              pizza: {
                connect: { id: pizzaCalabresa.id }
              },
              nome: pizzaCalabresa.nome,
              precoVenda: pizzaCalabresa.preco,
              quantidade
            }
          ]
        }
      }
    })
    console.log('[INFO] Pedido de teste criado com pizza Calabresa')
  }

  console.log('[SEED] Seed executado com sucesso!')
}

main()
  .catch(e => {
    console.error('[SEED] Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
