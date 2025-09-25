/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nomeCompleto
 *         - cpf
 *         - telefone
 *         - email
 *         - endereco
 *       properties:
 *         nomeCompleto:
 *           type: string
 *         cpf:
 *           type: string
 *         telefone:
 *           type: string
 *         telefoneOpcional:
 *           type: string
 *         email:
 *           type: string
 *         observacoes:
 *           type: string
 *         aceitaPromocoes:
 *           type: boolean
 *         aceitaTermos:
 *           type: boolean
 *         endereco:
 *           type: object
 *           properties:
 *             rua:
 *               type: string
 *             numero:
 *               type: string
 *             complemento:
 *               type: string
 *             bairro:
 *               type: string
 *             cep:
 *               type: string
 *             cidade:
 *               type: string
 *             pontoReferencia:
 *               type: string
 */
