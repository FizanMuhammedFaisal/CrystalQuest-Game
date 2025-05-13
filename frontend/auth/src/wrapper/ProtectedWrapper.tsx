import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/store'

interface ProtectedWrapperProps {
  children: React.ReactNode
}

export const ProtectedWrapper: React.FC<ProtectedWrapperProps> = ({
  children
}) => {
  const navigate = useNavigate()
  const accessToken = useAuthStore(state => state.accessToken)
  useEffect(() => {
    if (accessToken === null) {
      navigate('/login')
    }
  }, [accessToken, navigate])

  return <>{children}</>
}
