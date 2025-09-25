import { Router } from 'express'

// Controllers ajustados e exportados corretamente
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  inativarUsuario,
  ativarUsuario,
  alterarPerfilUsuario,
  excluirUsuario
} from '../controllers/usuarioController'

// Middlewares corrigidos e centralizados
import { verificarToken } from '../middlewares/verificarToken'
import { permitirPerfis } from '../middlewares/controleDeAcesso'
import { validarUsuario } from '../middlewares/validarUsuario'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

// Protege todas as rotas com autenticação
router.use(verificarToken)

// Criação de usuário (admin)
router.post(
  '/',
  permitirPerfis('admin'),
  validarUsuario.cadastro,
  criarUsuario
)

// Listagem de usuários (admin)
router.get(
  '/',
  permitirPerfis('admin'),
  listarUsuarios
)

// Consulta por ID (admin)
router.get(
  '/:id',
  permitirPerfis('admin'),
  buscarUsuarioPorId
)

// Atualização de dados (admin)
router.put(
  '/:id',
  permitirPerfis('admin'),
  validarUsuario.atualizacao,
  atualizarUsuario
)

// Inativação de usuário (admin)
router.patch(
  '/:id/inativar',
  permitirPerfis('admin'),
  inativarUsuario
)

// Reativação de usuário (admin)
router.patch(
  '/:id/ativar',
  permitirPerfis('admin'),
  ativarUsuario
)

// Alteração de perfil (admin)
router.patch(
  '/:id/perfil',
  permitirPerfis('admin'),
  alterarPerfilUsuario
)

// Exclusão de usuário (admin)
router.delete(
  '/:id',
  permitirPerfis('admin'),
  excluirUsuario
)

// Tratamento de erros global
router.use(tratamentoErros)

export default router
