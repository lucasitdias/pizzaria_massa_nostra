import { Router } from 'express'
import { loginController } from '../controllers/authController'
import { loginClienteController } from '../controllers/loginClienteController'
import { validarLoginUsuario } from '../middlewares/validarUsuario'
import { tratamentoErros } from '../middlewares/tratamentoErros'

const router = Router()

// Login de usuário interno
router.post('/login', validarLoginUsuario, loginController)

// Login de cliente
router.post('/login-cliente', loginClienteController)

router.use(tratamentoErros)

export default router
