import api from './axios'
import type { Notificacao } from '../types'

export const listarNotificacoes = () => api.get<Notificacao[]>('/notificacoes')

export const contarNaoLidas = () => api.get<{ total: number }>('/notificacoes/nao-lidas')

export const marcarComoLida = (id: string) => api.put(`/notificacoes/${id}/ler`)

export const marcarTodasComoLidas = () => api.put('/notificacoes/ler-todas')

export const excluirNotificacao = (id: string) => api.delete(`/notificacoes/${id}`)

export const excluirTodasNotificacoes = () => api.delete('/notificacoes')
