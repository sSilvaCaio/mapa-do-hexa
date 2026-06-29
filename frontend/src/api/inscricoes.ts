import api from './axios'
import type { Inscricao } from '../types'

export const confirmarPresenca = (eventoId: string) =>
  api.post<Inscricao>(`/eventos/${eventoId}/inscricao`)

export const cancelarPresenca = (eventoId: string) =>
  api.delete(`/eventos/${eventoId}/inscricao`)

export const listarInscritos = (eventoId: string) =>
  api.get<Inscricao[]>(`/eventos/${eventoId}/inscricao/lista`)
