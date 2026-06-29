import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarEventos, compartilharEvento } from '../../api/eventos'
import { listarAmigos } from '../../api/amizades'
import type { Evento, Amizade } from '../../types'
import { MapPin, Users, Calendar, Share2, X, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function ShareModal({
  evento,
  amigos,
  userId,
  onClose,
}: {
  evento: Evento
  amigos: Amizade[]
  userId: string
  onClose: () => void
}) {
  const [status, setStatus] = useState<Record<string, 'idle' | 'loading' | 'done' | 'error'>>({})

  const getAmigoId = (a: Amizade) =>
    a.solicitanteId === userId ? a.receptorId : a.solicitanteId
  const getAmigoNome = (a: Amizade) =>
    a.solicitanteId === userId ? a.receptorNome : a.solicitanteNome

  const handleShare = async (amigo: Amizade) => {
    const id = getAmigoId(amigo)
    setStatus((s) => ({ ...s, [id]: 'loading' }))
    try {
      await compartilharEvento(evento.id, id)
      setStatus((s) => ({ ...s, [id]: 'done' }))
    } catch {
      setStatus((s) => ({ ...s, [id]: 'error' }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h3 className="font-bold text-azul">Compartilhar evento</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{evento.titulo}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-72 overflow-y-auto">
          {amigos.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">
              Você ainda não tem amigos.<br />Adicione amigos na aba Amigos!
            </p>
          ) : (
            <ul className="space-y-2">
              {amigos.map((a) => {
                const id = getAmigoId(a)
                const nome = getAmigoNome(a)
                const s = status[id] ?? 'idle'
                return (
                  <li key={id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-verde/10 flex items-center justify-center text-verde font-bold text-sm">
                        {nome.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{nome}</span>
                    </div>
                    <button
                      onClick={() => handleShare(a)}
                      disabled={s === 'loading' || s === 'done'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        s === 'done'
                          ? 'bg-green-100 text-verde cursor-default'
                          : s === 'error'
                          ? 'bg-red-100 text-red-500'
                          : 'bg-azul text-white hover:bg-blue-700 disabled:opacity-50'
                      }`}
                    >
                      {s === 'done' ? <><Check size={12} className="inline mr-1" />Enviado</> :
                       s === 'error' ? 'Erro' :
                       s === 'loading' ? '...' : 'Enviar'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export function Feed() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [amigos, setAmigos] = useState<Amizade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareEvento, setShareEvento] = useState<Evento | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    Promise.all([
      listarEventos().then((r) => setEventos(r.data)),
      listarAmigos().then((r) => setAmigos(r.data)).catch(() => {}),
    ])
      .catch(() => setError('Erro ao carregar eventos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="text-4xl animate-bounce inline-block">⚽</span>
          <p className="text-gray-500 mt-2">Carregando eventos...</p>
        </div>
      </div>
    )

  const porData = (a: Evento, b: Evento) => {
    const dtA = `${a.data} ${a.horario}`
    const dtB = `${b.data} ${b.horario}`
    return dtA.localeCompare(dtB)
  }

  const compartilhados = eventos.filter((e) => e.compartilhadoComigo).sort(porData)
  const outros = eventos.filter((e) => !e.compartilhadoComigo).sort(porData)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header da página */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-azul">Eventos da Copa 2026 🏆</h1>
        <p className="text-gray-500 mt-1">Florianópolis • Encontre sua torcida!</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Eventos compartilhados comigo — fixados no topo */}
      {compartilhados.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Share2 size={16} className="text-amarelo" />
            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide">
              Compartilhados com você
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {compartilhados.map((evento) => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onNavigate={() => navigate(`/event/${evento.id}`)}
                onShare={() => setShareEvento(evento)}
                pinned
              />
            ))}
          </div>
        </section>
      )}

      {/* Todos os eventos */}
      {outros.length === 0 && compartilhados.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-4">🏟️</span>
          <p className="font-medium">Nenhum evento disponível ainda.</p>
          <p className="text-sm mt-1">Que tal criar o primeiro?</p>
        </div>
      )}

      {outros.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {outros.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              onNavigate={() => navigate(`/event/${evento.id}`)}
              onShare={() => setShareEvento(evento)}
            />
          ))}
        </div>
      )}

      {shareEvento && (
        <ShareModal
          evento={shareEvento}
          amigos={amigos}
          userId={user?.id ?? ''}
          onClose={() => setShareEvento(null)}
        />
      )}
    </div>
  )
}

function EventoCard({
  evento,
  onNavigate,
  onShare,
  pinned = false,
}: {
  evento: Evento
  onNavigate: () => void
  onShare: () => void
  pinned?: boolean
}) {
  const cheio =
    evento.maxParticipantes != null && evento.totalInscritos >= evento.maxParticipantes

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer border-l-4 ${
        pinned ? 'border-amarelo ring-1 ring-amarelo/30' : 'border-verde'
      }`}
      onClick={onNavigate}
    >
      {pinned && (
        <div className="bg-amarelo/10 px-4 py-1.5 flex items-center gap-1.5">
          <Share2 size={12} className="text-amarelo" />
          <span className="text-xs font-semibold text-amber-700">
            Compartilhado por {evento.compartilhadoPor}
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="font-bold text-azul text-lg leading-tight">{evento.titulo}</h2>
          {cheio && (
            <span className="shrink-0 text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
              Cheio
            </span>
          )}
          {evento.usuarioInscrito && !cheio && (
            <span className="shrink-0 text-xs bg-green-100 text-verde font-semibold px-2 py-0.5 rounded-full">
              Confirmado ✓
            </span>
          )}
        </div>

        <p className="text-sm font-medium text-gray-600 mb-3">⚽ {evento.jogo}</p>

        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-verde shrink-0" />
            <span>
              {evento.data} às {evento.horario}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-verde shrink-0" />
            <span className="truncate">{evento.nomeLocal}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-verde shrink-0" />
            <span>
              {evento.totalInscritos} confirmado{evento.totalInscritos !== 1 ? 's' : ''}
              {evento.maxParticipantes ? ` / ${evento.maxParticipantes} vagas` : ''}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-400">por {evento.organizadorNome}</span>
          {evento.lat && evento.lng && (
            <a
              href={`https://maps.google.com/?q=${evento.lat},${evento.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-verde hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin size={12} /> Ver no mapa
            </a>
          )}
        </div>
      </div>

      <div className="px-5 pb-4 flex gap-2">
        <button
          className="flex-1 py-2 bg-verde hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate()
          }}
        >
          Ver Detalhes
        </button>
        <button
          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
          title="Compartilhar com amigos"
          onClick={(e) => {
            e.stopPropagation()
            onShare()
          }}
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  )
}
