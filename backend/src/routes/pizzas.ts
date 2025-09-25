import { Router } from 'express'
import {
  criarPizza,
  listarPizzas,
  consultarPizza,
  atualizarPizza,
  desativarPizza,
  reativarPizza,
  excluirPizza,
  filtrarPizzas
} from '../controllers/pizzaController'
import { verificarToken } from '../middlewares/verificarToken'
import { verificarAdmin } from '../middlewares/verificarToken'
import { validarPizza } from '../middlewares/validarPizza'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

// Protege todas as rotas com autenticação
router.use(verificarToken)

// Cria nova pizza (admin)
router.post('/', verificarAdmin, validarPizza, criarPizza)

// Lista todas as pizzas ativas
router.get('/', listarPizzas)

// Consulta pizza por ID
router.get('/:id', consultarPizza)

// Atualiza pizza (admin)
router.put('/:id', verificarAdmin, validarPizza, atualizarPizza)

// Desativa pizza (admin)
router.patch('/:id/desativar', verificarAdmin, desativarPizza)

// Reativa pizza (admin)
router.patch('/:id/reativar', verificarAdmin, reativarPizza)

// Exclui pizza (admin)
router.delete('/:id', verificarAdmin, excluirPizza)

// Filtra pizzas por tipo, tamanho ou ingrediente
router.get('/filtro/avancado', filtrarPizzas)

// Tratamento de erros
router.use(tratamentoErros)

export default router

/**
 * @swagger
 * tags:
 *   name: Pizzas
 *   description: Endpoints para gerenciamento de pizzas
 */

/**
 * @swagger
 * /pizzas:
 *   get:
 *     summary: Lista todas as pizzas ativas
 *     tags: [Pizzas]
 *     responses:
 *       200:
 *         description: Lista de pizzas
 */

/**
 * @swagger
 * /pizzas:
 *   post:
 *     summary: Cria uma nova pizza
 *     tags: [Pizzas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               ingredientes:
 *                 type: array
 *                 items:
 *                   type: string
 *               tamanho:
 *                 type: string
 *               preco:
 *                 type: number
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pizza criada com sucesso
 */
