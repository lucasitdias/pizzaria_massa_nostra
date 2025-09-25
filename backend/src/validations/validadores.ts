
// Valida se uma string não está vazia ou só com espaços
export function validarTextoObrigatorio(valor: string, campo: string): string | null {
  if (!valor || valor.trim() === '') {
    return `O campo "${campo}" é obrigatório.`
  }
  return null
}

// Valida se um número é positivo

export function validarNumeroPositivo(valor: number, campo: string): string | null {
  if (isNaN(valor) || valor <= 0) {
    return `O campo "${campo}" deve ser um número positivo.`
  }
  return null
}

// Valida se uma data é válida e futura

export function validarDataFutura(data: Date, campo: string): string | null {
  const hoje = new Date()
  if (!(data instanceof Date) || isNaN(data.getTime())) {
    return `O campo "${campo}" deve conter uma data válida.`
  }
  if (data <= hoje) {
    return `A data do campo "${campo}" deve ser futura.`
  }
  return null
}

// Valida formato de e-mail simples e retorna booleano

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Valida formato de e-mail e retorna mensagem de erro (opcional)

export function validarEmailComMensagem(email: string): string | null {
  return validarEmail(email) ? null : 'E-mail inválido.'
}

// Valida CPF com base em regra matemática

export function validarCPF(cpf: string): string | null {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return 'CPF inválido.'

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(9))) return 'CPF inválido.'

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(10))) return 'CPF inválido.'

  return null
}

// Formata erro padrão para resposta JSON

export function erroPadrao(mensagem: string, erro: unknown) {
  return {
    mensagem,
    detalhes: erro instanceof Error ? erro.message : String(erro)
  }
}
