import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const rawApiUrl = import.meta.env.VITE_API_URL ?? 'https://mapa-do-hexa.onrender.com'
const apiBaseUrl = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : rawApiUrl.replace(/\/+$/g, '') + '/api'

const api = axios.create({
  baseURL: apiBaseUrl,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api