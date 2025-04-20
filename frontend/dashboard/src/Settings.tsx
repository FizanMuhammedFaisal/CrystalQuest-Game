import { LogOut } from 'lucide-react'

function Settings() {
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...')
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6 text-white'>Settings</h1>

      <div className='flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700/50'>
        <div>
          <p className='text-gray-400 text-sm'>Logged in as</p>
          <p className='text-white'>admin@game.com</p>
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
