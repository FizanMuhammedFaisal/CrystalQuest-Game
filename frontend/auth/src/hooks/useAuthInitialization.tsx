import { useEffect, useState } from 'react'
import { clearAuth, getAccessToken, setAccessToken } from '../store/store'
import apiClient from '../api/apiClient'
import { setUser } from 'authStore/AuthStore'

export const useAuthInitialization = (): boolean => {
  const [isInitialized, setIsInitialized] = useState(false)
  const assessToken = getAccessToken()

  useEffect(() => {
    const initializeAuth = async () => {
      if (assessToken === null) {
        try {
          const response = await apiClient.get('/auth/refresh-token')

          const { accessToken } = response.data.data

          setAccessToken(accessToken)
          setUser(response.data.data.user)
          setIsInitialized(true)
        } catch (error) {
          console.error('Failed to refresh access token:', error)
          clearAuth()
          setIsInitialized(true)
        }
      }
    }

    if (assessToken === null) {
      initializeAuth()
    } else {
      setIsInitialized(true)
    }
  }, [assessToken])

  return isInitialized
}
