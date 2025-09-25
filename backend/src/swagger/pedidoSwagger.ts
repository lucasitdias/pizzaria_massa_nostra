/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - clienteId
 *         - centroDeCustoId
 *         - pizzas
 *       properties:
 *         clienteId:
 *           type: integer
 *         centroDeCustoId:
 *           type: integer
 *         formaPagamento:
 *           type: string
 *         observacoes:
 *           type: string
 *         pizzas:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - tipoPizza
 *               - tamanho
 *               - sabores
 *               - quantidade
 *             properties:
 *               tipoPizza:
 *                 type: string
 *                 enum: [salgada, doce]
 *               tamanho:
 *                 type: string
 *                 enum: [pequena, media, grande]
 *               sabores:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                     precoBase:
 *                       type: number
 *               borda:
 *                 type: string
 *                 enum: [tradicional, simples, vulcao]
 *               recheioBorda:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               insumos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     insumoId:
 *                       type: integer
 *                     quantidadeUtilizada:
 *                       type: number
 */
