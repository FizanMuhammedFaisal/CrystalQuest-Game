import type React from 'react'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PixelButton } from 'game/GameUI.tsx'
import { Eye, EyeOff, User, Mail, Lock, Shield } from 'lucide-react'
import apiClient from '../api/apiClient'
import { setAccessToken, setUser } from '../store/store'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null) // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { username, email, password, confirmPassword } = formData

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return setError('All fields are required.')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address.')
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.')
    }

    // Submit to backend
    try {
      const res = await apiClient.post('/auth/register', { ...formData })
      setAccessToken(res.data.data.accessToken)
      setUser(res.data.data.user)
      setSuccess(true)
      setError(null)
    } catch (err) {
      setError('Failed to register. Please try again.')
      console.error(err)
    }
  }
  return (
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex min-h-screen flex-col items-center justify-center bg-[#111827] p-4'
    >
      <div className='w-full max-w-md'>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className='mb-8 text-center'
        >
          <h1 className='font-pixel text-4xl text-white'>NEW PLAYER</h1>
          <p className='mt-2 font-pixel text-sm text-[#9CA3AF]'>
            CREATE YOUR ACCOUNT TO JOIN THE ADVENTURE
          </p>
        </motion.div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        {success && (
          <p className='text-green-600 text-sm'>Registration successful!</p>
        )}

        <motion.div
          className='border-4 border-t-[#93C5FD] border-l-[#93C5FD] border-r-[#1D4ED8] border-b-[#1D4ED8] bg-[#0F172A] p-6'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <label className='font-pixel text-sm text-white'>USERNAME</label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <User className='h-5 w-5 text-[#93C5FD]' />
                </div>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                  placeholder='CHOOSE USERNAME'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='font-pixel text-sm text-white'>EMAIL</label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Mail className='h-5 w-5 text-[#93C5FD]' />
                </div>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                  placeholder='ENTER EMAIL'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='font-pixel text-sm text-white'>PASSWORD</label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Lock className='h-5 w-5 text-[#93C5FD]' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                  placeholder='CREATE PASSWORD'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 flex items-center pr-3'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-[#9CA3AF]' />
                  ) : (
                    <Eye className='h-5 w-5 text-[#9CA3AF]' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='font-pixel text-sm text-white'>
                CONFIRM PASSWORD
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Shield className='h-5 w-5 text-[#93C5FD]' />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                  placeholder='CONFIRM PASSWORD'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 flex items-center pr-3'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5 text-[#9CA3AF]' />
                  ) : (
                    <Eye className='h-5 w-5 text-[#9CA3AF]' />
                  )}
                </button>
              </div>
            </div>

            <div className='pt-4'>
              <PixelButton
                variant='secondary'
                key={'signup-button'}
                size='md'
                className='w-full'
              >
                CREATE ACCOUNT
              </PixelButton>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='mt-6 text-center'
        >
          <p className='font-pixel text-sm text-[#9CA3AF]'>
            ALREADY HAVE AN ACCOUNT?{' '}
            <a
              href='/auth/login'
              className='text-[#93C5FD] hover:text-[#60A5FA]'
            >
              LOGIN
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
