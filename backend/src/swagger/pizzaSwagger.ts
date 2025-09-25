/**
 * @swagger
 * components:
 *   schemas:
 *     Pizza:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *         - tamanho
 *         - precoBase
 *       properties:
 *         nome:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [salgada, doce]
 *         tamanho:
 *           type: string
 *           enum: [pequena, media, grande]
 *         precoBase:
 *           type: number
 *         ingredientes:
 *           type: array
 *           items:
 *             type: string
 *         ativo:
 *           type: boolean
 */
