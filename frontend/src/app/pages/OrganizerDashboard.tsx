import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarEvento } from '../../api/eventos'
import type { EventoRequest } from '../../types'

export function OrganizerDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState<EventoRequest>({
    titulo: '',
    jogo: '',
    data: '',
    horario: '',
    nomeLocal: '',
    endereco: '',
    descricao: '',
    oQueLevar: '',
    infraestrutura: '',
    maxParticipantes: undefined,
  })

  const set = (field: keyof EventoRequest, value: string | number | undefined) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await criarEvento(form)
      setSuccess(true)
      setTimeout(() => navigate(`/event/${res.data.id}`), 1500)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <span className="text-5xl block mb-4">🎉</span>
        <p className="text-xl font-bold text-verde">Evento criado com sucesso!</p>
        <p className="text-gray-500 text-sm mt-1">Redirecionando...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-azul">Criar Evento 📅</h1>
        <p className="text-gray-500 text-sm mt-1">Organize seu encontro de torcida!</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento *</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => set('titulo', e.target.value)}
            placeholder="Ex: Brasil no Bar do Zé"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jogo *</label>
          <input
            type="text"
            value={form.jogo}
            onChange={(e) => set('jogo', e.target.value)}
            placeholder="Ex: Brasil x Marrocos"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => set('data', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
            <input
              type="time"
              value={form.horario}
              onChange={(e) => set('horario', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Local *</label>
          <input
            type="text"
            value={form.nomeLocal}
            onChange={(e) => set('nomeLocal', e.target.value)}
            placeholder="Nome do local"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input
            type="text"
            value={form.endereco ?? ''}
            onChange={(e) => set('endereco', e.target.value)}
            placeholder="Rua, número, bairro"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={form.descricao ?? ''}
            onChange={(e) => set('descricao', e.target.value)}
            placeholder="Conte mais sobre o evento..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O que levar</label>
            <input
              type="text"
              value={form.oQueLevar ?? ''}
              onChange={(e) => set('oQueLevar', e.target.value)}
              placeholder="Ex: Camiseta do Brasil"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Infraestrutura</label>
            <input
              type="text"
              value={form.infraestrutura ?? ''}
              onChange={(e) => set('infraestrutura', e.target.value)}
              placeholder="Ex: Telão, churrasco"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de participantes</label>
          <input
            type="number"
            min={1}
            value={form.maxParticipantes ?? ''}
            onChange={(e) => set('maxParticipantes', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Deixe em branco para ilimitado"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-verde hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
        >
          {loading ? 'Criando evento...' : '✓ Criar Evento'}
        </button>
      </form>
    </div>
  )
}
