// src/app.ts

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente conforme NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

// Prisma
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Middlewares
import { verificarToken } from './middlewares/verificarToken'

// Swagger
import { setupSwagger } from './swagger/swagger'

// App Express
const app = express()

// Middlewares globais
app.use(cors())
app.use(express.json())

// ---------------------
// ROTAS PÚBLICAS
// ---------------------
import authRoutes from './routes/auth'
import campanhaRoutes from './routes/campanha'
import demoRoutes from './routes/demo'

app.use('/auth', authRoutes)
app.use('/campanhas', campanhaRoutes)
app.use('/demo', demoRoutes)

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: { ativo: true },
      orderBy: { categoria: 'asc' }
    })
    res.json(produtos)
  } catch (error) {
    console.error('[GET /produtos] Erro:', error)
    res.status(500).json({ erro: 'Erro ao buscar produtos' })
  }
})

// ---------------------
// ROTAS PROTEGIDAS
// ---------------------
import pizzasRoutes from './routes/pizzas'
import clientesRoutes from './routes/clientes'
import usuariosRoutes from './routes/usuarios'
import insumosRoutes from './routes/insumos'
import pagamentosRoutes from './routes/pagamentos'
import avaliacoesRoutes from './routes/avaliacoes'
import bebidasRoutes from './routes/bebidas'
import comprovantesRoutes from './routes/comprovantes'
import configuracoesRoutes from './routes/configuracoes'
import cotacoesRoutes from './routes/cotacoes'
import cuponsRoutes from './routes/cupons'
import entregasRoutes from './routes/entregas'
import fidelidadeRoutes from './routes/fidelidade'
import financeiroRoutes from './routes/financeiro'
import fornecedoresRoutes from './routes/fornecedores'
import integracoesRoutes from './routes/integracoes'
import marketingRoutes from './routes/marketing'
import notificacoesRoutes from './routes/notificacoes'
import pedidosRoutes from './routes/pedidos'
import relatorioRoutes from './routes/relatorio'
import suporteRoutes from './routes/suporte'

app.use('/pizzas', verificarToken, pizzasRoutes)
app.use('/clientes', clientesRoutes)
app.use('/usuarios', verificarToken, usuariosRoutes)
app.use('/insumos', verificarToken, insumosRoutes)
app.use('/pagamentos', verificarToken, pagamentosRoutes)
app.use('/avaliacoes', verificarToken, avaliacoesRoutes)
app.use('/bebidas', verificarToken, bebidasRoutes)
app.use('/comprovantes', verificarToken, comprovantesRoutes)
app.use('/configuracoes', verificarToken, configuracoesRoutes)
app.use('/cotacoes', verificarToken, cotacoesRoutes)
app.use('/cupons', verificarToken, cuponsRoutes)
app.use('/entregas', verificarToken, entregasRoutes)
app.use('/fidelidade', verificarToken, fidelidadeRoutes)
app.use('/financeiro', verificarToken, financeiroRoutes)
app.use('/fornecedores', verificarToken, fornecedoresRoutes)
app.use('/integracoes', verificarToken, integracoesRoutes)
app.use('/marketing', verificarToken, marketingRoutes)
app.use('/notificacoes', verificarToken, notificacoesRoutes)
app.use('/pedidos', verificarToken, pedidosRoutes)
app.use('/relatorios', verificarToken, relatorioRoutes)
app.use('/suporte', verificarToken, suporteRoutes)

// ---------------------
// ROTA RAIZ E SWAGGER
// ---------------------
app.get('/', (_req, res) => {
  res.send('🍕 API Pizzaria Massa Nostra rodando com sucesso!')
})

setupSwagger(app)

export default app
