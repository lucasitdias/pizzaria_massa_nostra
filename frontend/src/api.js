import axios from 'axios'

// Cria instância do Axios com base da API
const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend local
})

// Intercepta todas as requisições e adiciona o token, se existir
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Cadastro de cliente — envia dados + endereço fixo
export const cadastrarCliente = dados =>
  api.post('/clientes', {
    ...dados,
    endereco: {
      logradouro: 'Rua Teste',
      numero: '123',
      bairro: 'Centro',
      cidade: 'Santa Bárbara d\'Oeste',
      estado: 'SP'
    }
  })

// Login — retorna token
export const loginCliente = dados =>
  api.post('/auth/login', dados)

// Listagem de produtos
export const listarPizzas = () => api.get('/pizzas')
export const listarBebidas = () => api.get('/bebidas')

// Pedido
export const criarPedido = dados => api.post('/pedidos', dados)
export const buscarPedido = id => api.get(`/pedidos/${id}`)
