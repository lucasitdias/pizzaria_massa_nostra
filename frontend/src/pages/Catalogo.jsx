import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarPizzas, listarBebidas } from '../api'

export default function Catalogo() {
  // Estado para armazenar produtos e carrinho
  const [pizzas, setPizzas] = useState([])
  const [bebidas, setBebidas] = useState([])
  const [carrinho, setCarrinho] = useState([])

  const navigate = useNavigate()

  // Carrega produtos ao montar o componente
  useEffect(() => {
    listarPizzas()
      .then(res => setPizzas(res.data))
      .catch(err => console.error('[Erro ao listar pizzas]', err))

    listarBebidas()
      .then(res => setBebidas(res.data))
      .catch(err => console.error('[Erro ao listar bebidas]', err))
  }, [])

  // Adiciona item ao carrinho
  const adicionarAoCarrinho = item => {
    setCarrinho(prev => [...prev, item])
  }

  // Salva carrinho e vai para tela de carrinho
  const finalizarEscolha = () => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho))
    navigate('/carrinho')
  }

  return (
    <div>
      <h2>Catálogo</h2>

      <h3>Pizzas</h3>
      {pizzas.map(p => (
        <div key={p.id}>
          <p>{p.nome} - R$ {p.preco}</p>
          <button onClick={() => adicionarAoCarrinho({
            tipo: 'pizza',
            pizzaId: p.id,
            nome: p.nome,
            precoBase: p.preco,
            quantidade: 1,
            tamanho: 'grande',
            tipoPizza: p.tipo,
            sabores: [{ nome: p.nome, precoBase: p.preco }]
          })}>Adicionar</button>
        </div>
      ))}

      <h3>Bebidas</h3>
      {bebidas.map(b => (
        <div key={b.id}>
          <p>{b.nome} - {b.volume}</p>
          <button onClick={() => adicionarAoCarrinho({
            tipo: 'bebida',
            bebidaId: b.id,
            nome: b.nome,
            volume: b.volume,
            quantidade: 1
          })}>Adicionar</button>
        </div>
      ))}

      <button onClick={finalizarEscolha}>Ir para Carrinho</button>
    </div>
  )
}
