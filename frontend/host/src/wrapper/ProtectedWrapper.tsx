import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAccessToken } from '../store/authStore'

interface ProtectedWrapperProps {
  children: React.ReactNode
}

const ProtectedWrapper: React.FC<ProtectedWrapperProps> = ({ children }) => {
  const navigate = useNavigate()
  const accessToken = getAccessToken()
  useEffect(() => {
    if (accessToken === null) {
      navigate('/auth/login')
    }
  }, [accessToken, navigate])

  return <>{children}</>
}

export default ProtectedWrapper
