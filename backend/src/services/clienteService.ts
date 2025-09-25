import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ClienteService {

// Cria um novo cliente com endereço vinculado
// @param data Dados do cliente e endereço

  async criarCliente(data: any) {
    const novoEndereco = await prisma.enderecoEntrega.create({
      data: {
        rua: data.endereco.rua,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento ?? null,
        bairro: data.endereco.bairro,
        cep: data.endereco.cep,
        cidade: data.endereco.cidade,
        pontoReferencia: data.endereco.pontoReferencia
      }
    })

    const novoCliente = await prisma.cliente.create({
      data: {
        nomeCompleto: data.nomeCompleto.trim(),
        cpf: data.cpf.trim(),
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : null,
        telefone: data.telefone.trim(),
        telefoneOpcional: data.telefoneOpcional?.trim() ?? null,
        email: data.email.trim(),
        observacoes: data.observacoes?.trim() ?? null,
        aceitaPromocoes: data.aceitaPromocoes,
        aceitaTermos: data.aceitaTermos,
        enderecoId: novoEndereco.id
      }
    })

    return novoCliente
  }

// Verifica se já existe cliente com CPF, email ou telefone

  async verificarDuplicidade(cpf: string, email: string, telefone: string) {
    return prisma.cliente.findFirst({
      where: {
        OR: [{ cpf }, { email }, { telefone }]
      }
    })
  }

// Busca cliente por ID com endereço vinculado
  
  async buscarPorId(id: number) {
    return prisma.cliente.findFirst({
      where: { id, ativo: true },
      include: { endereco: true }
    })
  }

// Busca cliente simples por ID (sem endereço)

  async buscarSimples(id: number) {
    return prisma.cliente.findUnique({ where: { id } })
  }

// Atualiza dados do cliente e seu endereço

  async atualizarCliente(id: number, dados: any) {
    await prisma.enderecoEntrega.update({
      where: { id: dados.enderecoId },
      data: {
        rua: dados.endereco.rua,
        numero: dados.endereco.numero,
        complemento: dados.endereco.complemento ?? null,
        bairro: dados.endereco.bairro,
        cep: dados.endereco.cep,
        cidade: dados.endereco.cidade,
        pontoReferencia: dados.endereco.pontoReferencia
      }
    })

    return prisma.cliente.update({
      where: { id },
      data: {
        nomeCompleto: dados.nomeCompleto.trim(),
        cpf: dados.cpf.trim(),
        dataNascimento: dados.dataNascimento ? new Date(dados.dataNascimento) : null,
        telefone: dados.telefone.trim(),
        telefoneOpcional: dados.telefoneOpcional?.trim() ?? null,
        email: dados.email.trim(),
        observacoes: dados.observacoes?.trim() ?? null,
        aceitaPromocoes: dados.aceitaPromocoes,
        aceitaTermos: dados.aceitaTermos
      }
    })
  }

// Desativa cliente

  async desativarCliente(id: number) {
    return prisma.cliente.update({
      where: { id },
      data: { ativo: false }
    })
  }

// Reativa cliente

  async reativarCliente(id: number) {
    return prisma.cliente.update({
      where: { id },
      data: { ativo: true }
    })
  }
}
