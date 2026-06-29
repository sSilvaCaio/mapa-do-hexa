import api from './axios'
import type { Amizade } from '../types'

export const listarAmigos = () => api.get<Amizade[]>('/amizades')

export const listarPendentes = () => api.get<Amizade[]>('/amizades/pendentes')

export const solicitarAmizade = (username: string) =>
  api.post<Amizade>('/amizades/solicitar', { username })

export const aceitarAmizade = (id: string) =>
  api.put<Amizade>(`/amizades/${id}/aceitar`)

export const recusarAmizade = (id: string) =>
  api.put<Amizade>(`/amizades/${id}/recusar`)

export const removerAmigo = (id: string) =>
  api.delete(`/amizades/${id}`)

export const listarAmigosConfirmados = (eventoId: string) =>
  api.get<{ userId: string; nome: string }[]>(`/amizades/evento/${eventoId}`)
