import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SuporteParams {
  usuarioId: number
  clienteId: number
  titulo: string
  assunto: string
  mensagem: string
  prioridade: 'baixa' | 'media' | 'alta'
}

export async function registrarSolicitacaoSuporte(params: SuporteParams) {
  return prisma.suporte.create({
    data: {
      usuarioId: params.usuarioId,
      clienteId: params.clienteId,
      titulo: params.titulo,
      assunto: params.assunto,
      mensagem: params.mensagem,
      prioridade: params.prioridade,
      status: 'aberto'
    }
  })
}

export async function listarSolicitacoesSuporte() {
  return prisma.suporte.findMany({
    orderBy: { criadoEm: 'desc' },
    include: { usuario: true, cliente: true }
  })
}

export async function atualizarStatusSuporte(id: number, status: string) {
  return prisma.suporte.update({
    where: { id },
    data: { status }
  })
}
