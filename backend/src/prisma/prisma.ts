import { PrismaClient } from '@prisma/client'

// Instância única para evitar múltiplas conexões simultâneas
const prisma = new PrismaClient()

export default prisma
