import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { updateProfile, excluirConta } from '../../api/auth'
import { Trash2, X } from 'lucide-react'

export function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState(user?.nome ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteSenha, setDeleteSenha] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword && newPassword.length < 8) {
      setError('Nova senha deve ter no mínimo 8 caracteres')
      return
    }
    if (newPassword && !currentPassword) {
      setError('Informe a senha atual para alterar a senha')
      return
    }
    if (username.trim().length > 0 && username.trim().length < 3) {
      setError('Username deve ter pelo menos 3 caracteres')
      return
    }

    setLoading(true)
    try {
      const payload: { nome?: string; username?: string; currentPassword?: string; newPassword?: string } = {}
      if (nome !== user?.nome) payload.nome = nome
      if (username !== user?.username && username.trim()) payload.username = username.trim()
      if (newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const res = await updateProfile(payload)
      updateUser({ nome: res.data.nome, username: res.data.username })
      setSuccess('Perfil atualizado com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleExcluirConta = async () => {
    if (!deleteSenha.trim()) {
      setDeleteError('Informe sua senha para confirmar')
      return
    }
    setDeleteLoading(true)
    setDeleteError('')
    try {
      await excluirConta(deleteSenha)
      logout()
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setDeleteError(msg ?? 'Erro ao excluir conta')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-azul">Meu Perfil 👤</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas informações</p>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-verde to-azul flex items-center justify-center text-white text-3xl font-black shadow-md">
          {user?.nome?.charAt(0).toUpperCase() ?? '?'}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-verde mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
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
              className="w-full pl-7 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Usado para adicionar amigos. Entre 3 e 30 caracteres.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            value={user?.email ?? ''}
            disabled
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <hr className="border-gray-100" />
        <p className="text-sm font-semibold text-gray-500">Alterar Senha (opcional)</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Sua senha atual"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-verde hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      {/* Zona de perigo */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-red-100">
        <h2 className="text-sm font-bold text-red-500 mb-1">Zona de Perigo</h2>
        <p className="text-xs text-gray-500 mb-4">
          Excluir sua conta é permanente e não pode ser desfeito.
        </p>
        <button
          onClick={() => { setShowDeleteModal(true); setDeleteError(''); setDeleteSenha('') }}
          className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-lg transition-colors border border-red-200 flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Excluir minha conta
        </button>
      </div>

      {/* Modal excluir conta */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <h3 className="font-bold text-gray-800">Excluir conta?</h3>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Esta ação é <strong>irreversível</strong>. Todos os seus dados serão removidos permanentemente.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirme com sua senha
              </label>
              <input
                type="password"
                value={deleteSenha}
                onChange={(e) => setDeleteSenha(e.target.value)}
                placeholder="Sua senha atual"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600 mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirConta}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
              >
                {deleteLoading ? 'Excluindo...' : 'Excluir conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
