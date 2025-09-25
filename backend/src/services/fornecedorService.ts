import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type FornecedorCreateInput = Prisma.FornecedorCreateInput

// Criação de fornecedor com todos os campos obrigatórios
export async function criarFornecedor(params: FornecedorCreateInput) {
  return prisma.fornecedor.create({ data: params })
}

// Busca fornecedor por ID
export async function buscarFornecedorPorId(id: number) {
  return prisma.fornecedor.findUnique({ where: { id } })
}

// Lista fornecedores ativos
export async function listarFornecedores() {
  return prisma.fornecedor.findMany({ where: { ativo: true } })
}

// Atualiza fornecedor com campos parciais
export async function atualizarFornecedor(id: number, dados: Partial<FornecedorCreateInput>) {
  return prisma.fornecedor.update({
    where: { id },
    data: dados
  })
}

// Inativa fornecedor
export async function inativarFornecedor(id: number) {
  return prisma.fornecedor.update({
    where: { id },
    data: { ativo: false }
  })
}
