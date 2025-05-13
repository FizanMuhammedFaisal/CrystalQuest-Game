import { LogOut } from 'lucide-react'
import apiClient from '../api/apiClient'
import { clearAuth, getUser, setUser } from '../store/authStore'
import { useEffect, useState } from 'react'

function Settings() {
  const handleLogout = async () => {
    try {
      await apiClient.get('/auth/logout')
      clearAuth()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  const [user, setUser] = useState()

  useEffect(() => {
    console.log(user, 'user ')
    if (!user) {
      async function fetchUser() {
        try {
          const response = await apiClient.get('/auth/profile')
          console.log(response, 'response ')
          if (response.data.success) {
            setUser(response.data.data.user)
          }
        } catch (error) {
          console.error('Failed to fetch user:', error)
        }
      }
      fetchUser()
    }
  }, [])
  console.log(user, 'user ')
  console.log(user, 'user ')
  console.log(user, 'userasdfasfasdfasdf ')
  console.log(user, 'user ')
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6 text-white'>Settings</h1>

      <div className='flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700/50'>
        <div>
          <p className='text-gray-400 text-sm'>
            Logged in as{' '}
            <span className='font-bold text-white/80'>{user?.email}</span>
          </p>
          <p className='text-white'></p>
        </div>

        <button
          onClick={handleLogout}
          className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors'
        >
          <LogOut className='w-4 h-4' />
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Settings
