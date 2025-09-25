import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Catalogo from './pages/Catalogo'
import Carrinho from './pages/Carrinho'
import PedidoFinalizado from './pages/PedidoFinalizado'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/pedido-finalizado" element={<PedidoFinalizado />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
