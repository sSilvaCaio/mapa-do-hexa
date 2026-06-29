import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { login as apiLogin, register as apiRegister } from '../../api/auth'

export function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [nome, setNome] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (isRegister && nome.trim().length < 2) {
      setError('Nome deve ter ao menos 2 caracteres')
      return
    }
    if (isRegister && (username.trim().length < 3 || username.trim().length > 30)) {
      setError('Username deve ter entre 3 e 30 caracteres')
      return
    }
    if (isRegister && !/^[a-zA-Z0-9_.]+$/.test(username)) {
      setError('Username só pode conter letras, números, _ e .')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('E-mail inválido')
      return
    }
    if (password.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres')
      return
    }

    setLoading(true)
    try {
      const res = isRegister
        ? await apiRegister(nome, username, email, password)
        : await apiLogin(email, password)
      login(res.data)
      navigate('/feed')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Erro ao autenticar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde via-azul to-verde flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
            <span className="text-4xl">⚽</span>
          </div>
          <h1 className="text-4xl font-black text-white">
            COO<span className="text-amarelo">PA</span>
          </h1>
          <p className="text-white/80 mt-1 text-sm">O Encontro das Torcidas 🏆</p>
          <p className="text-white/60 text-xs mt-1">Copa do Mundo 2026 • Florianópolis 🏖️</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            <button
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                !isRegister ? 'bg-verde text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => { setIsRegister(false); setError('') }}
            >
              Entrar
            </button>
            <button
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                isRegister ? 'bg-verde text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => { setIsRegister(true); setError('') }}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                      placeholder="seu.username"
                      className="w-full pl-7 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Usado para adicionar amigos. Único e imutável.</p>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-verde hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
            >
              {loading ? 'Aguarde...' : isRegister ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
