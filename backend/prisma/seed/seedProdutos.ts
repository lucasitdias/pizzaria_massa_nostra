import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Tipagem dos produtos que serão inseridos
type ProdutoSeed = {
  nome: string
  preco: number
  categoria: string
  descricao?: string
  ativo: boolean
}

// Função para estimar preço com base na categoria e volume
function estimarPreco(categoria: string, volume?: string): number {
  const ml = volume ? parseInt(volume.replace(/\D/g, '')) : 350
  switch (categoria) {
    case 'Refrigerante': return 6.0
    case 'Água': return 4.0
    case 'Suco': return 7.0
    case 'Cerveja Artesanal': return ml > 330 ? 16.0 : 14.0
    case 'Cerveja Tradicional': return ml > 330 ? 8.0 : 6.5
    case 'Vinho': return 45.0
    case 'Energético': return ml > 300 ? 10.0 : 8.0
    default: return 5.0
  }
}

// Função para classificar bebida com base no nome
function classificarBebida(nome: string): string {
  if (/Coca|Pepsi|Guaraná|Fanta|Sprite/.test(nome)) return 'Refrigerante'
  if (/Água/.test(nome)) return 'Água'
  if (/Suco/.test(nome)) return 'Suco'
  if (/Long Neck|Lata/.test(nome) && /Invicta|Urbana|Virgens|All Beers|Cabeças|Antuérpia|Bierland|Duchesse|Galo|Vemaguet|Barley|Weiss|Aratinga|Colombina/.test(nome)) return 'Cerveja Artesanal'
  if (/Long Neck|Lata/.test(nome)) return 'Cerveja Tradicional'
  if (/Vinho/.test(nome) || /Malbec|Chianti|Pinot|Chateauneuf|Valduga|Geraldo/.test(nome)) return 'Vinho'
  if (/Red Bull|Monster|TNT|Burn|NOS|Fusion|Flying/.test(nome)) return 'Energético'
  return 'Outros'
}

// Função principal que executa o seed
async function main() {
  console.log('[SEED PRODUTOS] Iniciando...')

  // Lista de bebidas fixas
  const bebidasFixas = [
    { nome: 'Coca-Cola Tradicional', volume: '350 ml' },
    { nome: 'Coca-Cola Zero', volume: '350 ml' },
    { nome: 'Guaraná Antártica Tradicional', volume: '350 ml' },
    { nome: 'Guaraná Antártica Zero', volume: '350 ml' },
    { nome: 'Pepsi Tradicional', volume: '350 ml' },
    { nome: 'Pepsi Zero', volume: '350 ml' },
    { nome: 'Sprite', volume: '350 ml' },
    { nome: 'Fanta', volume: '350 ml' },
    { nome: 'Água com gás', volume: '500 ml' },
    { nome: 'Água sem gás', volume: '500 ml' },
    { nome: 'Água Tônica', volume: '350 ml' },
    { nome: 'Suco de Laranja', volume: '290 ml' },
    { nome: 'Suco de Uva', volume: '290 ml' },
    { nome: 'Suco de Abacaxi', volume: '290 ml' },
    { nome: 'Suco de Maracujá', volume: '290 ml' },
    { nome: 'Suco de Morango', volume: '290 ml' },
    { nome: 'Red Bull', volume: '250 ml' },
    { nome: 'Monster Energy', volume: '473 ml' },
    { nome: 'TNT Energy Drink', volume: '250 ml' },
    { nome: 'Flying Horse', volume: '473 ml' },
    { nome: 'Burn', volume: '250 ml' },
    { nome: 'NOS', volume: '473 ml' },
    { nome: 'Fusion Energy Drink', volume: '473 ml' }
  ]

  const bebidasFormatadas: ProdutoSeed[] = bebidasFixas.map((bebida) => ({
    nome: bebida.nome,
    preco: estimarPreco(classificarBebida(bebida.nome), bebida.volume),
    categoria: classificarBebida(bebida.nome),
    descricao: bebida.volume,
    ativo: true
  }))

  console.log(`[SEED PRODUTOS] Inserindo ${bebidasFormatadas.length} bebidas...`)
  for (const bebida of bebidasFormatadas) {
    await prisma.produto.upsert({
      where: { nome: bebida.nome },
      update: {},
      create: bebida
    })
  }

  // Lista de pizzas doces
  const pizzasDocesFixas: ProdutoSeed[] = [
    { nome: 'Pizza Romeu e Julieta', preco: 15, categoria: 'Pizza Doce', descricao: 'catupiry, goiabada', ativo: true },
    { nome: 'Pizza Banana', preco: 15, categoria: 'Pizza Doce', descricao: 'mussarela, banana, açúcar, canela, calda de caramelo', ativo: true },
    { nome: 'Pizza Abacaxi', preco: 15, categoria: 'Pizza Doce', descricao: 'mussarela, abacaxi, açúcar', ativo: true },
    { nome: 'Pizza Chocodelícia', preco: 16, categoria: 'Pizza Doce', descricao: 'ganache de chocolate ao leite, chocolate granulado, cerejas', ativo: true },
    { nome: 'Pizza Salada de Frutas', preco: 17, categoria: 'Pizza Doce', descricao: 'mussarela, abacaxi, banana, pêssego, ameixa, cerejas, maçã, açúcar', ativo: true },
    { nome: 'Pizza Brigadeiro', preco: 15, categoria: 'Pizza Doce', descricao: 'brigadeiro mole, chocolate granulado', ativo: true },
    { nome: 'Pizza Prestígio', preco: 17, categoria: 'Pizza Doce', descricao: 'ganache de chocolate meio amargo, beijinho, coco ralado, cerejas', ativo: true },
    { nome: 'Pizza Nutella', preco: 16, categoria: 'Pizza Doce', descricao: 'nutella, cerejas', ativo: true },
    { nome: 'Pizza Nutebanana', preco: 16, categoria: 'Pizza Doce', descricao: 'nutella, banana', ativo: true },
    { nome: 'Pizza Nutefetti', preco: 16, categoria: 'Pizza Doce', descricao: 'nutella, confetti', ativo: true },
    { nome: 'Pizza Dois Amores', preco: 17, categoria: 'Pizza Doce', descricao: 'chocolate branco, chocolate ao leite, granulado branco e escuro', ativo: true },
    { nome: 'Pizza Bis', preco: 18, categoria: 'Pizza Doce', descricao: 'ganache de chocolate ao leite, bis esmigalhado, creme de leite, doce de leite', ativo: true },
    { nome: 'Pizza Branca de Neve', preco: 17, categoria: 'Pizza Doce', descricao: 'ganache de chocolate branco, doce de leite, coco ralado', ativo: true },
    { nome: 'Pizza Formigueiro', preco: 16, categoria: 'Pizza Doce', descricao: 'ganache de chocolate ao leite, doce de leite, chocolate granulado', ativo: true },
    { nome: 'Pizza Beijinho', preco: 16, categoria: 'Pizza Doce', descricao: 'ganache de chocolate branco, beijinho, coco ralado', ativo: true },
    { nome: 'Pizza Nega Maluca', preco: 16, categoria: 'Pizza Doce', descricao: 'ganache de chocolate meio amargo, doce de leite, chocolate granulado', ativo: true },
    { nome: 'Pizza Vovózinha', preco: 15, categoria: 'Pizza Doce', descricao: 'doce de leite, ameixas, coco ralado', ativo: true },
    { nome: 'Pizza Pina Colada', preco: 17, categoria: 'Pizza Doce', descricao: 'creme de coco, abacaxi em calda, coco ralado, leite condensado', ativo: true }
  ]

  console.log(`[SEED PRODUTOS] Inserindo ${pizzasDocesFixas.length} pizzas doces...`)
  for (const pizza of pizzasDocesFixas) {
    await prisma.produto.upsert({
      where: { nome: pizza.nome },
      update: {},
      create: pizza
    })
  }

  // Lista de pizzas salgadas
  const pizzasSalgadasFixas: ProdutoSeed[] = [
    { nome: 'Pizza Acredite se Quiser', preco: 18, categoria: 'Pizza Salgada', descricao: 'mussarela, lombo, calabresa, palmito, tomate picado, ervilha, bacon, cheddar, parmesão', ativo: true },
    { nome: 'Pizza À Moda do Chefe', preco: 17, categoria: 'Pizza Salgada', descricao: 'presunto, mussarela, frango, ervilha, milho, catupiry, ovos, palmito, cebola', ativo: true },
    { nome: 'Pizza Brócolis', preco: 16, categoria: 'Pizza Salgada', descricao: 'mussarela, brócolis, catupiry, bacon, palmito, alho frito', ativo: true },
    { nome: 'Pizza Brócolis Especial', preco: 17, categoria: 'Pizza Salgada', descricao: 'mussarela, lombo, brócolis, palmito, molho branco, parmesão', ativo: true },
    { nome: 'Pizza Calabresa Especial', preco: 15, categoria: 'Pizza Salgada', descricao: 'mussarela, calabresa, cebola, ovos', ativo: true },
    { nome: 'Pizza Francheese', preco: 17, categoria: 'Pizza Salgada', descricao: 'mussarela, peito de frango defumado em cubos, bacon, cream cheese', ativo: true },
    { nome: 'Pizza Frango com Bacon', preco: 16, categoria: 'Pizza Salgada', descricao: 'mussarela, peito de frango desfiado, bacon, catupiry', ativo: true },
    { nome: 'Pizza Frango com Catupiry', preco: 15, categoria: 'Pizza Salgada', descricao: 'mussarela, peito de frango desfiado, milho, catupiry', ativo: true },
    { nome: 'Pizza Halley', preco: 18, categoria: 'Pizza Salgada', descricao: 'mussarela, lombo canadense, tomate, catupiry, manjericão, champignon, parmesão', ativo: true },
    { nome: 'Pizza Marguerita', preco: 14, categoria: 'Pizza Salgada', descricao: 'mussarela, tomate, parmesão, manjericão', ativo: true },
    { nome: 'Pizza Saborosa', preco: 17, categoria: 'Pizza Salgada', descricao: 'queijo branco, bacon, tomate, catupiry, parmesão, cebola, manjericão', ativo: true },
    { nome: 'Pizza Abobrinha', preco: 15, categoria: 'Pizza Salgada', descricao: 'molho de tomate, mussarela, abobrinha refogada com azeite, parmesão, bacon, orégano', ativo: true },
    { nome: 'Pizza Americana', preco: 16, categoria: 'Pizza Salgada', descricao: 'presunto, palmito, ervilha, bacon, mussarela', ativo: true },
    { nome: 'Pizza Portuguesa', preco: 15, categoria: 'Pizza Salgada', descricao: 'mussarela, presunto, ovos, cebola, pimentão, azeitona', ativo: true },
    { nome: 'Pizza Quatro Queijos', preco: 17, categoria: 'Pizza Salgada', descricao: 'mussarela, provolone, gorgonzola, parmesão', ativo: true },
    { nome: 'Pizza Vegetariana', preco: 16, categoria: 'Pizza Salgada', descricao: 'mussarela, tomate, palmito, champignon, cebola, milho, ervilha', ativo: true },
    { nome: 'Pizza Sete Queijos', preco: 19, categoria: 'Pizza Salgada', descricao: 'mussarela, provolone, catupiry, cheddar, gorgonzola, parmesão, queijo prato', ativo: true }
  ]

  console.log(`[SEED PRODUTOS] Inserindo ${pizzasSalgadasFixas.length} pizzas salgadas...`)
  for (const pizza of pizzasSalgadasFixas) {
    await prisma.produto.upsert({
      where: { nome: pizza.nome },
      update: {},
      create: pizza
    })
  }

  const total = await prisma.produto.count()
  console.log(`[SEED PRODUTOS] Total de produtos no banco: ${total}`)
}

// Executa o seed com tratamento de erro
main()
  .catch((e) => {
    console.error('[SEED PRODUTOS] Erro ao popular produtos:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
