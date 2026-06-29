import api from './axios'
import type { Evento, EventoRequest } from '../types'

export const listarEventos = () => api.get<Evento[]>('/eventos')

export const buscarEvento = (id: string) => api.get<Evento>(`/eventos/${id}`)

export const criarEvento = (data: EventoRequest) => api.post<Evento>('/eventos', data)

export const editarEvento = (id: string, data: EventoRequest) =>
  api.put<Evento>(`/eventos/${id}`, data)

export const cancelarEvento = (id: string) => api.delete(`/eventos/${id}`)

export const compartilharEvento = (eventoId: string, destinatarioId: string) =>
  api.post(`/eventos/${eventoId}/compartilhar`, { destinatarioId })
