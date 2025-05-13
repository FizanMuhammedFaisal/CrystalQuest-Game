import { useEffect, useState } from 'react'
import {
  clearAuth,
  getAccessToken,
  setAccessToken,
  setUser
} from '../store/authStore'
import apiClient from '../api/apiClient'

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
          console.log(response.data, 'response data')
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
