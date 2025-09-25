/**
 * @swagger
 * components:
 *   schemas:
 *     Financeiro:
 *       type: object
 *       required:
 *         - tipo
 *         - valor
 *         - descricao
 *       properties:
 *         tipo:
 *           type: string
 *           enum: [ENTRADA, SAIDA]
 *         valor:
 *           type: number
 *         descricao:
 *           type: string
 *         categoria:
 *           type: string
 *         data:
 *           type: string
 *           format: date
 */
