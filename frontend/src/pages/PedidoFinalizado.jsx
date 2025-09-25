export default function PedidoFinalizado() {
  const pedido = JSON.parse(localStorage.getItem('pedidoFinalizado'))

  if (!pedido) return <p>Nenhum pedido encontrado.</p>

  return (
    <div>
      <h2>Pedido Finalizado</h2>
      <p>ID: {pedido.pedido.id}</p>
      <p>Total: R$ {pedido.total}</p>
      <p>Status: {pedido.pedido.status}</p>
    </div>
  )
}
