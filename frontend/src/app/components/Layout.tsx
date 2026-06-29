import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Home, Calendar, Bell, User, LogOut, Users } from 'lucide-react'
import { contarNaoLidas } from '../../api/notificacoes'

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [naoLidas, setNaoLidas] = useState(0)

  useEffect(() => {
    const fetch = () =>
      contarNaoLidas()
        .then((r) => setNaoLidas(r.data.total))
        .catch(() => {})
    fetch()
    const interval = setInterval(fetch, 30_000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-white/75 hover:text-white hover:bg-white/10'
    }`

  const mobileLink = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs transition-colors relative ${
      isActive ? 'text-amarelo' : 'text-white/70 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header desktop */}
      <header className="hidden md:block bg-gradient-to-r from-verde to-azul shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-0 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xl font-black text-white">
              COO<span className="text-amarelo">PA</span>
            </span>
            <span className="text-white/60 text-xs hidden lg:block">O Encontro das Torcidas ⚽</span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink to="/feed" className={desktopLink}>Eventos</NavLink>
            <NavLink to="/organize" className={desktopLink}>Organizar</NavLink>
            <NavLink to="/amigos" className={desktopLink}>Amigos</NavLink>
            <NavLink to="/notifications" className={({ isActive }) =>
              `relative text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`
            }>
              Notificações
              {naoLidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </NavLink>
            <NavLink to="/profile" className={desktopLink}>
              {user?.nome?.split(' ')[0]}
            </NavLink>
            <button
              onClick={handleLogout}
              className="ml-2 text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Sair"
            >
              <LogOut size={17} />
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-verde to-azul border-t border-white/20 flex justify-around py-2 z-50">
        <NavLink to="/feed" className={mobileLink}>
          <Home size={22} />
          <span>Eventos</span>
        </NavLink>
        <NavLink to="/organize" className={mobileLink}>
          <Calendar size={22} />
          <span>Organizar</span>
        </NavLink>
        <NavLink to="/amigos" className={mobileLink}>
          <Users size={22} />
          <span>Amigos</span>
        </NavLink>
        <NavLink to="/notifications" className={mobileLink}>
          <div className="relative">
            <Bell size={22} />
            {naoLidas > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {naoLidas > 9 ? '9+' : naoLidas}
              </span>
            )}
          </div>
          <span>Avisos</span>
        </NavLink>
        <NavLink to="/profile" className={mobileLink}>
          <User size={22} />
          <span>Perfil</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 text-xs text-white/70 hover:text-white"
        >
          <LogOut size={22} />
          <span>Sair</span>
        </button>
      </nav>
    </div>
  )
}
