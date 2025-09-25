import { BebidaCadastrada, BebidaClassificada } from '../types/bebida'

export function classificarBebida(bebida: BebidaCadastrada): BebidaClassificada {
  const nome = bebida.nome.toLowerCase()

  let tipo: BebidaClassificada['tipo']
  if (nome.includes('coca') || nome.includes('guaraná') || nome.includes('pepsi') || nome.includes('sprite') || nome.includes('fanta')) {
    tipo = 'refrigerante'
  } else if (nome.includes('água') || nome.includes('tônica')) {
    tipo = 'água'
  } else if (nome.includes('suco')) {
    tipo = 'suco'
  } else if (nome.includes('artesanal') && nome.includes('long neck')) {
    tipo = 'cerveja artesanal'
  } else if (nome.includes('long neck')) {
    tipo = 'cerveja tradicional'
  } else if (nome.includes('artesanal') && nome.includes('lata')) {
    tipo = 'cerveja artesanal'
  } else if (nome.includes('lata')) {
    tipo = 'cerveja tradicional'
  } else if (nome.includes('suave')) {
    tipo = 'vinho suave'
  } else if (nome.includes('seco')) {
    tipo = 'vinho seco'
  } else if (nome.includes('energy') || nome.includes('red bull') || nome.includes('monster') || nome.includes('tnt') || nome.includes('fusion') || nome.includes('burn') || nome.includes('nos')) {
    tipo = 'energético'
  } else {
    tipo = 'refrigerante'
  }

  let embalagem: BebidaClassificada['embalagem']
  if (nome.includes('long neck')) embalagem = 'long neck'
  else if (nome.includes('lata')) embalagem = 'lata'
  else if (bebida.volume.includes('750')) embalagem = 'garrafa'
  else embalagem = 'vidro'

  const precoBase = definirPrecoBase(tipo, bebida.volume)

  return { ...bebida, tipo, embalagem, precoBase }
}

function definirPrecoBase(tipo: BebidaClassificada['tipo'], volume: string): number {
  const ml = parseInt(volume.replace(/\D/g, ''))

  switch (tipo) {
    case 'refrigerante': return ml <= 350 ? 6 : 7
    case 'água': return ml <= 500 ? 4 : 5
    case 'suco': return ml <= 300 ? 7 : 8
    case 'cerveja artesanal': return ml <= 350 ? 12 : 14
    case 'cerveja tradicional': return ml <= 350 ? 8 : 9
    case 'vinho suave': return 35
    case 'vinho seco': return 45
    case 'energético': return ml <= 250 ? 10 : 12
    default: return 6
  }
}

export function calcularPrecoFinal(bebida: BebidaClassificada, margemLucro: number = 30): number {
  let preco = bebida.precoBase

  switch (bebida.embalagem) {
    case 'lata': preco += 0.5; break
    case 'long neck': preco += 1.0; break
    case 'garrafa': preco += 1.5; break
    case 'vidro': preco += 0.8; break
  }

  preco *= 1 + margemLucro / 100

  return +preco.toFixed(2)
}
