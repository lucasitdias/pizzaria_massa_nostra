import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cadastrarCliente, loginCliente } from '../api'

export default function Cadastro() {
  const [form, setForm] = useState({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
    aceitaPromocoes: true,
    aceitaTermos: true,
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cep: '',
      cidade: '',
      pontoReferencia: ''
    }
  })

  const navigate = useNavigate()

  const handleChange = e => {
    const { name, value } = e.target
    if (name in form.endereco) {
      setForm(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [name]: value }
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await cadastrarCliente(form)
      const res = await loginCliente({ email: form.email, senha: form.senha })
      localStorage.setItem('token', res.data.token)
      navigate('/catalogo')
    } catch (err) {
      alert('Erro ao cadastrar ou autenticar')
      console.error('[Cadastro] Erro:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro</h2>

      <input name="nomeCompleto" placeholder="Nome completo" onChange={handleChange} required />
      <input name="cpf" placeholder="CPF" onChange={handleChange} required />
      <input name="telefone" placeholder="Telefone" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="senha" placeholder="Senha" type="password" onChange={handleChange} required />

      <h3>Endereço</h3>
      <input name="rua" placeholder="Rua" onChange={handleChange} required />
      <input name="numero" placeholder="Número" onChange={handleChange} required />
      <input name="bairro" placeholder="Bairro" onChange={handleChange} required />
      <input name="cep" placeholder="CEP" onChange={handleChange} required />
      <input name="cidade" placeholder="Cidade" onChange={handleChange} required />
      <input name="pontoReferencia" placeholder="Ponto de referência" onChange={handleChange} />

      <button type="submit">Cadastrar e Entrar</button>
    </form>
  )
}
