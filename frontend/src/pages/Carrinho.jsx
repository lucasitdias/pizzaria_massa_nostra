import { useNavigate } from 'react-router-dom'
import { criarPedido } from '../api'

export default function Carrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]')
  const navigate = useNavigate()

  const finalizarPedido = async () => {
    try {
      const res = await criarPedido({
        clienteId: 1,
        centroDeCustoId: 1,
        formaPagamento: 'PIX',
        observacoes: 'Pedido via interface',
        itens: carrinho
      })
      localStorage.setItem('pedidoFinalizado', JSON.stringify(res.data))
      navigate('/pedido-finalizado')
    } catch (err) {
      alert('Erro ao finalizar pedido')
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Carrinho</h2>
      {carrinho.map((item, i) => (
        <p key={i}>{item.tipo === 'pizza' ? item.nome : `${item.nome} (${item.volume})`}</p>
      ))}
      <button onClick={finalizarPedido}>Finalizar Pedido</button>
    </div>
  )
}
