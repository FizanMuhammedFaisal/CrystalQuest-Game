import { useState } from 'react'
import { PixelButton } from 'game/GameUI.tsx'
interface NavbarProps {
  navigate: (path: string) => void
}

const Navbar = ({ navigate }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false)
    } else {
      navigate('/auth/login')
    }
  }

  const navigateHome = () => {
    navigate('/')
  }

  return (
    <nav className='bg-[#111827] shadow-lg'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between h-16 items-center'>
          {/* Logo/Brand */}
          <div className='flex items-center'>
            <button
              onClick={navigateHome}
              className='text-white font-bold text-xl cursor-pointer'
            >
              Crystal Quest
            </button>
          </div>

          {/* Navigation Links */}
          <div className='flex items-center space-x-4'>
            <PixelButton
              variant='warning'
              key={'home-naviagte-button'}
              size='md'
              onClick={navigateHome}
              className='text-gray-300 hover:text-white px-3 py-2'
            >
              Home
            </PixelButton>
            <PixelButton
              variant='warning'
              key={'login-button-home'}
              size='md'
              onClick={handleLogin}
              className={`px-4 py-2 rounded ${
                isLoggedIn
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#4ADE80] hover:bg-[#3BC76D]'
              } text-white`}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </PixelButton>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
