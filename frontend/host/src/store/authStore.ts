import { create } from 'zustand'

type Role = 'user' | 'admin'

interface User {
  id: string
  email: string
  role: Role
}

interface AuthState {
  accessToken: string | null
  user: User | null
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  user: null,
  setAccessToken: token => set({ accessToken: token }),
  setUser: user => set({ user }),
  clearAuth: () => {
    localStorage.removeItem('accessToken')
    set({ accessToken: null, user: null })
  }
}))

export const getAccessToken = () => {
  const localToken = localStorage.getItem('accessToken')
  if (localToken) {
    useAuthStore.getState().setAccessToken(localToken)
  }
  return useAuthStore.getState().accessToken
}
export const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token)
  useAuthStore.getState().setAccessToken(token)
}
export const getUser = () => useAuthStore.getState().user
export const setUser = (user: User) => {
  useAuthStore.getState().setUser(user)
}
export const clearAuth = () => useAuthStore.getState().clearAuth()
export const isAuthenticated = () => {
  const accessToken = getAccessToken()
  console.log(accessToken, 'accessToken getting ')
  return accessToken !== null
}
