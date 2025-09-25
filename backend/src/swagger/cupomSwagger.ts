/**
 * @swagger
 * components:
 *   schemas:
 *     Cupom:
 *       type: object
 *       required:
 *         - codigo
 *         - validade
 *         - valor
 *       properties:
 *         codigo:
 *           type: string
 *         validade:
 *           type: string
 *           format: date
 *         valor:
 *           type: number
 *         ativo:
 *           type: boolean
 */
