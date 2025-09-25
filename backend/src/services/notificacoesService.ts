import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface NotificacaoParams {
  titulo: string
  mensagem: string
  tipo: 'sistema' | 'promocional' | 'alerta'
  destino?: string
  agendadaPara?: string
  destinatarioId: number
}

export async function enviarNotificacao(params: NotificacaoParams) {
  return prisma.notificacao.create({
    data: {
      titulo: params.titulo,
      mensagem: params.mensagem,
      tipo: params.tipo,
      destino: params.destino ?? null,
      agendadaPara: params.agendadaPara ? new Date(params.agendadaPara) : null,
      destinatarioId: params.destinatarioId
    }
  })
}

export async function listarNotificacoes() {
  return prisma.notificacao.findMany({
    orderBy: { criadoEm: 'desc' }
  })
}
