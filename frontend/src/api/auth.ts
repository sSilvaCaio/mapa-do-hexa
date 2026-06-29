import api from './axios'
import type { AuthResponse, UserData } from '../types'

export const register = (nome: string, username: string, email: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { nome, username, email, password })

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password })

export const getMe = () => api.get<UserData>('/users/me')

export const updateProfile = (data: {
  nome?: string
  username?: string
  currentPassword?: string
  newPassword?: string
  avatarUrl?: string
}) => api.put<UserData>('/users/me', data)

export const excluirConta = (senha: string) =>
  api.delete('/users/me', { data: { senha } })
