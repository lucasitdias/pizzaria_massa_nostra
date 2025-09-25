import { PrismaClient, TipoOperacao } from '@prisma/client'

const prisma = new PrismaClient()

interface AuditoriaParams {
  usuario: string
  funcionarioId: number
  acao: string
  entidade: string
  entidadeId: number
  tipoOperacao: TipoOperacao
  ipOrigem: string
}

export async function registrarAuditoria(params: AuditoriaParams): Promise<void> {
  try {
    await prisma.auditoria.create({
      data: {
        usuario: params.usuario,
        funcionarioId: params.funcionarioId,
        acao: params.acao,
        entidade: params.entidade,
        entidadeId: params.entidadeId,
        tipoOperacao: params.tipoOperacao,
        ipOrigem: params.ipOrigem,
        ativo: true
      }
    })
  } catch (erro) {
    console.error('Erro ao registrar auditoria:', erro)
    // Auditoria não deve quebrar a operação principal
  }
}
