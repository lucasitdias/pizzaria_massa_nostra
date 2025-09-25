/**
 * @swagger
 * components:
 *   schemas:
 *     Entrega:
 *       type: object
 *       required:
 *         - pedidoId
 *         - endereco
 *       properties:
 *         pedidoId:
 *           type: integer
 *         endereco:
 *           type: string
 *         entregador:
 *           type: string
 *         observacoes:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDENTE, EM_ROTA, ENTREGUE]
 */
