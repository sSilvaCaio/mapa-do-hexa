import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthResponse, UserData } from '../types'

interface AuthContextType {
  token: string | null
  user: UserData | null
  login: (data: AuthResponse) => void
  logout: () => void
  updateUser: (data: Partial<UserData>) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as UserData) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = (data: AuthResponse) => {
    setToken(data.token)
    setUser({ id: data.userId, nome: data.nome, username: data.username, email: data.email })
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
  }

  const updateUser = (data: Partial<UserData>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
