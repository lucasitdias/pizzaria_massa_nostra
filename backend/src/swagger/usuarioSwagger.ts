/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *         - perfil
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *         perfil:
 *           type: string
 *           enum: [admin, atendente, entregador]
 *         setor:
 *           type: string
 *         cargo:
 *           type: string
 *         ativo:
 *           type: boolean
 */
