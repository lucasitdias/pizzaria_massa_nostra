import { PrismaClient, StatusPedido, TipoOperacao } from '@prisma/client'
import { calcularPrecoPizza, TipoPizza, TamanhoPizza, TipoBorda } from './regraPrecosPizzas'
import { classificarBebida, calcularPrecoFinal } from './regraPrecosBebidas'
import { CriarPedidoDTO } from '../entidades/CriarPedidoDTO'
import { registrarAuditoria } from './auditoriaService'

const prisma = new PrismaClient()

export async function criarPedido(dados: CriarPedidoDTO, usuarioId: number, ipOrigem: string) {
  // Preenche nome e volume da bebida se estiverem ausentes
  for (const item of dados.itens) {
    if (item.tipo === 'bebida') {
      if (!item.nome || !item.volume) {
        const bebida = await prisma.bebida.findUnique({
          where: { id: item.bebidaId }
        })

        if (!bebida) {
          throw new Error(`Bebida com ID ${item.bebidaId} não encontrada`)
        }

        item.nome = bebida.nome
        item.volume = bebida.volume
      }
    }
  }

  // Calcula pizzas
  const pizzasCalculadas = dados.itens
    .filter(item => item.tipo === 'pizza')
    .map(pizza => {
      const precoCalculado = calcularPrecoPizza({
        tipo: pizza.tipoPizza as TipoPizza,
        tamanho: pizza.tamanho as TamanhoPizza,
        sabores: pizza.sabores as { nome: string; precoBase: number }[],
        borda: pizza.borda as TipoBorda | undefined,
        recheioBorda: pizza.recheioBorda
      })

      return {
        pizzaId: pizza.pizzaId,
        nome: pizza.nome,
        precoVenda: precoCalculado,
        quantidade: pizza.quantidade,
        insumos: pizza.insumos
      }
    })

  // Calcula bebidas
  const bebidasCalculadas = dados.itens
    .filter(item => item.tipo === 'bebida')
    .map(bebida => {
      const bebidaInfo = classificarBebida({
        nome: bebida.nome,
        volume: bebida.volume
      })

      const precoFinal = calcularPrecoFinal(bebidaInfo)

      return {
        bebidaId: bebida.bebidaId,
        nome: bebida.nome,
        volume: bebida.volume,
        tipo: bebidaInfo.tipo,
        embalagem: bebidaInfo.embalagem,
        precoFinal,
        quantidade: bebida.quantidade
      }
    })

  // Soma total
  const totalPizzas = pizzasCalculadas.reduce((acc, p) => acc + p.precoVenda * p.quantidade, 0)
  const totalBebidas = bebidasCalculadas.reduce((acc, b) => acc + b.precoFinal * b.quantidade, 0)
  const valorTotal = +(totalPizzas + totalBebidas).toFixed(2)

  // Cria pedido
  const pedido = await prisma.pedido.create({
    data: {
      clienteId: dados.clienteId,
      centroDeCustoId: dados.centroDeCustoId,
      formaPagamento: dados.formaPagamento ?? 'dinheiro',
      observacoes: dados.observacoes ?? null,
      status: dados.status as StatusPedido ?? StatusPedido.SOLICITADO,
      valorTotal,
      pizzas: {
        create: pizzasCalculadas.map(pizza => ({
          pizza: {
            connect: { id: pizza.pizzaId }
          },
          nome: pizza.nome,
          precoVenda: pizza.precoVenda,
          quantidade: pizza.quantidade,
          insumos: {
            create: pizza.insumos?.map(insumo => ({
              insumoId: insumo.insumoId,
              quantidadeUtilizada: insumo.quantidadeUtilizada
            })) ?? []
          }
        }))
      },
      bebidas: {
        create: bebidasCalculadas.map(bebida => ({
          bebida: {
            connect: { id: bebida.bebidaId }
          },
          nome: bebida.nome,
          volume: bebida.volume,
          tipo: bebida.tipo,
          embalagem: bebida.embalagem,
          precoFinal: bebida.precoFinal,
          quantidade: bebida.quantidade
        }))
      }
    },
    include: {
      pizzas: { include: { insumos: true } }
    }
  })

    // Auditoria
  await registrarAuditoria({
    usuario: dados.email ?? 'sistema',
    funcionarioId: usuarioId,
    acao: 'Criação de pedido',
    entidade: 'Pedido',
    entidadeId: pedido.id,
    tipoOperacao: TipoOperacao.CRIACAO,
    ipOrigem,
  })

  // Retorno final
  return {
    pedido,
    total: valorTotal
  }
}
