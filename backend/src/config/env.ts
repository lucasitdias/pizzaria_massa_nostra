// src/config/env.ts
import dotenv from 'dotenv'
import { z } from 'zod'

// Carrega variáveis do .env
dotenv.config()

// Define esquema de validação
const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Valida e extrai variáveis
const env = envSchema.parse(process.env)

export default {
  port: parseInt(env.PORT),
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  nodeEnv: env.NODE_ENV,
}
