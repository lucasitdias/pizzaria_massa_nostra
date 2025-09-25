import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCliente } from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', senha: '' })
  const navigate = useNavigate()

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await loginCliente(form)
      localStorage.setItem('token', res.data.token)
      navigate('/catalogo')
    } catch (err) {
      alert('Erro ao fazer login')
      console.error('[Login] Erro:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="senha" placeholder="Senha" type="password" onChange={handleChange} required />
      <button type="submit">Entrar</button>
    </form>
  )
}
