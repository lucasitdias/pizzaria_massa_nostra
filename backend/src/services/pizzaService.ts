import { PrismaClient, Pizza } from '@prisma/client'

const prisma = new PrismaClient()

export class PizzaService {
  // Cria uma nova pizza
  async criar(dados: Omit<Pizza, 'id' | 'ativo'>): Promise<Pizza> {
    return await prisma.pizza.create({
      data: {
        ...dados,
        nome: dados.nome.trim(),
        ativo: true
      }
    })
  }

  // Atualiza uma pizza existente
  async atualizar(id: number, dados: Partial<Pizza>): Promise<Pizza> {
    return await prisma.pizza.update({
      where: { id },
      data: {
        ...dados,
        nome: dados.nome?.trim()
      }
    })
  }

  // Desativa uma pizza
  async desativar(id: number): Promise<Pizza> {
    return await prisma.pizza.update({
      where: { id },
      data: { ativo: false }
    })
  }

  // Reativa uma pizza
  async reativar(id: number): Promise<Pizza> {
    return await prisma.pizza.update({
      where: { id },
      data: { ativo: true }
    })
  }

  // Exclui uma pizza
  async excluir(id: number): Promise<void> {
    await prisma.pizza.delete({ where: { id } })
  }

  // Verifica se já existe pizza com mesmo nome e tamanho
  async verificarDuplicidade(nome: string, tamanho: string): Promise<boolean> {
    const existente = await prisma.pizza.findFirst({
      where: {
        nome: nome.trim(),
        tamanho
      }
    })
    return !!existente
  }

  // Busca pizza por ID
  async buscarPorId(id: number): Promise<Pizza | null> {
    return await prisma.pizza.findUnique({ where: { id } })
  }

  // Lista todas as pizzas ativas
  async listar(): Promise<Pizza[]> {
    return await prisma.pizza.findMany({ where: { ativo: true } })
  }

  // Filtra pizzas por tipo, tamanho ou ingrediente específico
  async filtrarAvancado(filtros: {
    tipo?: string
    tamanho?: string
    ingrediente?: string
  }): Promise<Pizza[]> {
    const { tipo, tamanho, ingrediente } = filtros

    return await prisma.pizza.findMany({
      where: {
        ativo: true,
        ...(tipo && { tipo: { equals: tipo } }),
        ...(tamanho && { tamanho: { equals: tamanho } }),
        ...(ingrediente && {
          ingredientes: {
            has: ingrediente
          }
        })
      }
    })
  }
}
