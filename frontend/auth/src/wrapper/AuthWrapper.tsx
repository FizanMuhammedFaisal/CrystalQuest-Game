import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/store'

interface AuthWrapperProps {
  children: React.ReactNode
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const navigate = useNavigate()
  const accessToken = useAuthStore(state => state.accessToken)
  useEffect(() => {
    if (accessToken !== null) {
      navigate('/j')
    }
  }, [accessToken, navigate])

  return <>{children}</>
}
