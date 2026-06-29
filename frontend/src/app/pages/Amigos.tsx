import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  listarAmigos,
  listarPendentes,
  solicitarAmizade,
  aceitarAmizade,
  recusarAmizade,
  removerAmigo,
} from '../../api/amizades'
import type { Amizade } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { UserPlus, Users, Clock, Check, X, Search, UserMinus } from 'lucide-react'

type Tab = 'amigos' | 'pendentes' | 'adicionar'

export function Amigos() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('amigos')
  const [amigos, setAmigos] = useState<Amizade[]>([])
  const [pendentes, setPendentes] = useState<Amizade[]>([])
  const [loading, setLoading] = useState(true)
  const [usernameInput, setUsernameInput] = useState('')
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [addError, setAddError] = useState('')

  const carregar = () => {
    setLoading(true)
    Promise.all([
      listarAmigos().then((r) => setAmigos(r.data)),
      listarPendentes().then((r) => setPendentes(r.data)),
    ]).finally(() => setLoading(false))
  }

  useEffect(() => {
    carregar()
  }, [])

  const handleSolicitar = async (e: FormEvent) => {
    e.preventDefault()
    if (!usernameInput.trim()) return
    setAddStatus('loading')
    setAddError('')
    try {
      await solicitarAmizade(usernameInput.trim())
      setAddStatus('success')
      setUsernameInput('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setAddError(msg ?? 'Erro ao enviar solicitação')
      setAddStatus('error')
    }
  }

  const handleAceitar = async (a: Amizade) => {
    await aceitarAmizade(a.id).catch(() => {})
    carregar()
  }

  const handleRecusar = async (a: Amizade) => {
    await recusarAmizade(a.id).catch(() => {})
    carregar()
  }

  const handleRemover = async (a: Amizade) => {
    await removerAmigo(a.id).catch(() => {})
    carregar()
  }

  const getNomeAmigo = (a: Amizade) =>
    a.solicitanteId === user?.id ? a.receptorNome : a.solicitanteNome
  const getUsernameAmigo = (a: Amizade) =>
    a.solicitanteId === user?.id ? a.receptorUsername : a.solicitanteUsername

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-azul">Amigos 👥</h1>
        <p className="text-gray-500 text-sm mt-1">
          Conecte-se e compartilhe eventos com outros torcedores
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
        {([
          { key: 'amigos', label: `Amigos (${amigos.length})`, icon: <Users size={15} /> },
          { key: 'pendentes', label: `Pendentes (${pendentes.length})`, icon: <Clock size={15} /> },
          { key: 'adicionar', label: 'Adicionar', icon: <UserPlus size={15} /> },
        ] as { key: Tab; label: string; icon: ReactNode }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              tab === t.key ? 'bg-verde text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <Users size={32} className="mx-auto mb-3 animate-pulse" />
          <p>Carregando...</p>
        </div>
      ) : (
        <>
          {/* Lista de amigos */}
          {tab === 'amigos' && (
            <div>
              {amigos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-medium">Você ainda não tem amigos.</p>
                  <p className="text-sm mt-1">
                    <button
                      onClick={() => setTab('adicionar')}
                      className="text-verde underline"
                    >
                      Adicione alguém
                    </button>{' '}
                    para começar!
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {amigos.map((a) => (
                    <li
                      key={a.id}
                      className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
                    >
                      <div className="w-11 h-11 rounded-full bg-verde/10 flex items-center justify-center text-verde font-bold text-lg shrink-0">
                        {getNomeAmigo(a).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{getNomeAmigo(a)}</p>
                        <p className="text-xs text-gray-400">@{getUsernameAmigo(a)}</p>
                      </div>
                      <button
                        onClick={() => handleRemover(a)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-full transition-colors"
                        title="Remover amigo"
                      >
                        <UserMinus size={13} /> Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Pendentes */}
          {tab === 'pendentes' && (
            <div>
              {pendentes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Clock size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-medium">Nenhuma solicitação pendente.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {pendentes.map((a) => (
                    <li key={a.id} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-full bg-azul/10 flex items-center justify-center text-azul font-bold text-lg shrink-0">
                          {a.solicitanteNome.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800">{a.solicitanteNome}</p>
                          <p className="text-xs text-gray-400">@{a.solicitanteUsername}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAceitar(a)}
                          className="flex-1 py-1.5 bg-verde hover:bg-green-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Check size={15} /> Aceitar
                        </button>
                        <button
                          onClick={() => handleRecusar(a)}
                          className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <X size={15} /> Recusar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Adicionar amigo */}
          {tab === 'adicionar' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-azul/10 flex items-center justify-center">
                    <Search size={18} className="text-azul" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">Buscar por username</h2>
                    <p className="text-xs text-gray-500">
                      Digite o @username exato da pessoa
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSolicitar} className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      @
                    </span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) =>
                        setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))
                      }
                      placeholder="username.do.amigo"
                      className="w-full pl-7 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
                    />
                  </div>

                  {addStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-verde font-medium">
                      ✓ Solicitação enviada! Aguarde a confirmação.
                    </div>
                  )}
                  {addStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                      {addError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={addStatus === 'loading' || !usernameInput.trim()}
                    className="w-full py-3 bg-verde hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus size={18} />
                    {addStatus === 'loading' ? 'Enviando...' : 'Enviar Solicitação'}
                  </button>
                </form>
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                Seu username é <span className="font-semibold">@{user?.username}</span>. Compartilhe com seus amigos!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
