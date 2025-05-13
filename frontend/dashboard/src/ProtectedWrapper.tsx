import React from 'react'
import { isAuthenticated } from './store/authStore'
import { useNavigate } from 'react-router-dom'

function ProtectedWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  if (!isAuthenticated()) {
    navigate('/auth/login')
  }
  return <>{children}</>
}

export default ProtectedWrapper
