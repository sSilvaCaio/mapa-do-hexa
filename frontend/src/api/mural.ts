import api from './axios'
import type { MensagemMural } from '../types'

export const listarMural = (eventoId: string) =>
  api.get<MensagemMural[]>(`/eventos/${eventoId}/mural`)

export const publicarMensagem = (eventoId: string, conteudo: string) =>
  api.post<MensagemMural>(`/eventos/${eventoId}/mural`, { conteudo })

export const excluirMensagem = (eventoId: string, mensagemId: string) =>
  api.delete(`/eventos/${eventoId}/mural/${mensagemId}`)
