import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const api = axios.create({
  // Vamos forçar o link direto temporariamente para matar esse 404 da Vercel
  baseURL: 'https://mapa-hexa.onrender.com',
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