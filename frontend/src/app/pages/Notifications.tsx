import { useEffect, useState, type ReactNode, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  listarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  excluirNotificacao,
  excluirTodasNotificacoes,
} from '../../api/notificacoes'
import { aceitarAmizade, recusarAmizade } from '../../api/amizades'
import type { Notificacao } from '../../types'
import { Bell, UserPlus, Share2, CheckCheck, AlertTriangle, Trash2, Check } from 'lucide-react'

const ICONE: Record<Notificacao['tipo'], ReactNode> = {
  AMIZADE_RECEBIDA: <UserPlus size={18} />,
  AMIZADE_ACEITA: <UserPlus size={18} />,
  EVENTO_COMPARTILHADO: <Share2 size={18} />,
  EVENTO_CANCELADO: <AlertTriangle size={18} />,
}

const COR: Record<Notificacao['tipo'], string> = {
  AMIZADE_RECEBIDA: 'text-azul bg-azul/10',
  AMIZADE_ACEITA: 'text-verde bg-verde/10',
  EVENTO_COMPARTILHADO: 'text-amber-600 bg-amber-50',
  EVENTO_CANCELADO: 'text-red-500 bg-red-50',
}

function formatarTempo(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'agora'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}min`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`
  return `${Math.floor(diff / 86_400_000)}d`
}

export function Notifications() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [acoes, setAcoes] = useState<Record<string, boolean>>({})
  const [confirmLimpar, setConfirmLimpar] = useState(false)
  const navigate = useNavigate()

  const carregar = () =>
    listarNotificacoes()
      .then((r) => setNotificacoes(r.data))
      .finally(() => setLoading(false))

  useEffect(() => {
    carregar()
  }, [])

  const handleLer = async (n: Notificacao) => {
    if (!n.lida) {
      await marcarComoLida(n.id).catch(() => {})
      setNotificacoes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
      )
    }
    if (n.tipo === 'EVENTO_COMPARTILHADO') {
      navigate(`/event/${n.referenciaId}`)
    }
  }

  const handleMarcarLida = async (n: Notificacao, e: MouseEvent) => {
    e.stopPropagation()
    await marcarComoLida(n.id).catch(() => {})
    setNotificacoes((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
    )
  }

  const handleExcluir = async (id: string, e: MouseEvent) => {
    e.stopPropagation()
    await excluirNotificacao(id).catch(() => {})
    setNotificacoes((prev) => prev.filter((x) => x.id !== id))
  }

  const handleLerTodas = async () => {
    await marcarTodasComoLidas().catch(() => {})
    setNotificacoes((prev) => prev.map((x) => ({ ...x, lida: true })))
  }

  const handleLimparTodas = async () => {
    await excluirTodasNotificacoes().catch(() => {})
    setNotificacoes([])
    setConfirmLimpar(false)
  }

  const handleAceitar = async (n: Notificacao) => {
    setAcoes((a) => ({ ...a, [n.id]: true }))
    try {
      await aceitarAmizade(n.referenciaId)
      await marcarComoLida(n.id).catch(() => {})
      setNotificacoes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
      )
    } catch {
      setAcoes((a) => ({ ...a, [n.id]: false }))
    }
  }

  const handleRecusar = async (n: Notificacao) => {
    setAcoes((a) => ({ ...a, [n.id]: true }))
    try {
      await recusarAmizade(n.referenciaId)
      await marcarComoLida(n.id).catch(() => {})
      setNotificacoes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
      )
    } catch {
      setAcoes((a) => ({ ...a, [n.id]: false }))
    }
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Bell size={32} className="text-gray-300 animate-pulse" />
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-azul">Notificações 🔔</h1>
          <p className="text-gray-500 text-sm mt-1">
            {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Tudo em dia!'}
          </p>
        </div>

        {notificacoes.length > 0 && (
          <div className="flex items-center gap-2 shrink-0 mt-1">
            {naoLidas > 0 && (
              <button
                onClick={handleLerTodas}
                className="flex items-center gap-1.5 text-xs text-verde hover:text-green-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                title="Marcar todas como lidas"
              >
                <CheckCheck size={15} />
                <span className="hidden sm:inline">Ler todas</span>
              </button>
            )}
            <button
              onClick={() => setConfirmLimpar(true)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              title="Excluir todas"
            >
              <Trash2 size={15} />
              <span className="hidden sm:inline">Excluir todas</span>
            </button>
          </div>
        )}
      </div>

      {notificacoes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">Nenhuma notificação ainda.</p>
          <p className="text-sm mt-1">Adicione amigos e participe de eventos!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacoes.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden ${
                n.lida ? 'border-gray-200' : 'border-verde'
              }`}
            >
              <div
                className={`p-4 flex items-start gap-3 ${
                  n.tipo === 'EVENTO_COMPARTILHADO' ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
                onClick={() => handleLer(n)}
              >
                <div className={`p-2 rounded-full shrink-0 ${COR[n.tipo]}`}>
                  {ICONE[n.tipo]}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      n.lida ? 'text-gray-500' : 'text-gray-800 font-medium'
                    }`}
                  >
                    {n.mensagem}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatarTempo(n.criadoEm)}</p>
                </div>

                {/* Ações individuais */}
                <div className="flex items-center gap-1 shrink-0">
                  {!n.lida && (
                    <button
                      onClick={(e) => handleMarcarLida(n, e)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-verde hover:bg-green-50 transition-colors"
                      title="Marcar como lida"
                    >
                      <Check size={15} />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleExcluir(n.id, e)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Excluir notificação"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Ações para solicitação de amizade */}
              {n.tipo === 'AMIZADE_RECEBIDA' && !n.lida && !acoes[n.id] && (
                <div className="px-4 pb-3 flex gap-2">
                  <button
                    onClick={() => handleAceitar(n)}
                    className="flex-1 py-1.5 bg-verde hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleRecusar(n)}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Recusar
                  </button>
                </div>
              )}
              {n.tipo === 'AMIZADE_RECEBIDA' && acoes[n.id] && (
                <p className="px-4 pb-3 text-xs text-gray-400">Resposta registrada</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal confirmar limpar tudo */}
      {confirmLimpar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800">Excluir todas as notificações?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Esta ação não pode ser desfeita. Todas as {notificacoes.length} notificações serão removidas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmLimpar(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLimparTodas}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Excluir tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
