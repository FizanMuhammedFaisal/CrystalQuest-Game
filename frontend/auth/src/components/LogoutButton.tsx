import React from 'react'

import apiClient from '../api/apiClient'
import { clearAuth } from '../store/store'

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await apiClient.get('/auth/logout')
      clearAuth()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '10px',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}
    >
      Logout
    </button>
  )
}

export default LogoutButton
