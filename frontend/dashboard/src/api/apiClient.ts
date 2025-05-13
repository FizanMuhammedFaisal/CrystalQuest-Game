import axios, { AxiosError } from 'axios'

//
console.log(import.meta.env.VITE_SERVER_URL)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 10000
})

//

const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token)
}
const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}
let isRefeshing = false
let failedQueue: {
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}[] = []

// Function to process the queue of failed requests after a successful refresh
const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      // Resolve with the new token, allowing the request interceptor to add it
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// req with attached auth headers
apiClient.interceptors.request.use(config => {
  config.withCredentials = true
  const token = getAccessToken()
  console.log(token, 'token')
  if (token && config.url !== '/auth/refresh-token') {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    console.log(
      'No access token found or request is for refresh endpoint, skipping Authorization header.'
    )
  }
  return config
})

apiClient.interceptors.response.use(
  response => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      originalRequest?.url !== '/auth/refresh-token' &&
      originalRequest
    ) {
      if (!isRefeshing) {
        isRefeshing = true
        console.log('started teh refresh to oken  making process')
        const response = await apiClient.get('/auth/refresh-token')
        console.log(response)
        const newAccessToken = response.data.data.accessToken
        console.log(newAccessToken, 'newAccessToken')
        console.log('Token refresh successful. Received new access token.')
        setAccessToken(newAccessToken)
        processQueue(null, newAccessToken)
        isRefeshing = false
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return apiClient(originalRequest)
      } else {
        console.log('Refresh already in progress. Queuing original request.')
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default apiClient
