import nodemailer from 'nodemailer'
import { Insumo as PrismaInsumo } from '@prisma/client'

// Estende o tipo do Prisma para incluir o campo opcional de e-mail
interface InsumoComEmail extends PrismaInsumo {
  responsavelEmail?: string | string[]
}

// Configuração segura do transporte de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Envia alerta de validade por e-mail
// @param insumo Insumo com validade próxima

export async function enviarAlertaValidade(insumo: InsumoComEmail) {
  const destinatario = insumo.responsavelEmail ?? 'destinatario@empresa.com'

  const validadeTexto = insumo.validade
    ? insumo.validade.toLocaleDateString('pt-BR')
    : 'sem data definida'

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: `Alerta de validade - ${insumo.nome}`,
    text: `O insumo "${insumo.nome}" está com validade próxima: ${validadeTexto}.`
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`[EMAIL] Alerta enviado para ${destinatario} sobre o insumo "${insumo.nome}"`)
  } catch (erro) {
    console.error(`[EMAIL] Falha ao enviar alerta para ${destinatario}:`, erro)
  }
}
