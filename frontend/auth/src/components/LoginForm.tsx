'use client'
import { useState } from 'react'
import { motion } from 'motion/react'
import { PixelButton } from 'game/GameUI.tsx'
import { Eye, EyeOff, User, Lock } from 'lucide-react'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login submitted:', formData)
    // Add your login logic here
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
          <h1 className='font-pixel text-4xl text-white'>PLAYER LOGIN</h1>
          <p className='mt-2 font-pixel text-sm text-[#9CA3AF]'>
            ENTER YOUR CREDENTIALS TO CONTINUE
          </p>
        </motion.div>

        <motion.div
          className='border-4 border-t-[#4ADE80] border-l-[#4ADE80] border-r-[#166534] border-b-[#166534] bg-[#0F172A] p-6'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <label className='font-pixel text-sm text-white'>USERNAME</label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <User className='h-5 w-5 text-[#4ADE80]' />
                </div>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                  placeholder='ENTER USERNAME'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='font-pixel text-sm text-white'>PASSWORD</label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Lock className='h-5 w-5 text-[#4ADE80]' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                  placeholder='ENTER PASSWORD'
                  required
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

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 border-[#4ADE80] bg-[#1F2937] text-[#4ADE80] focus:ring-[#4ADE80]'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block font-pixel text-xs text-[#9CA3AF]'
                >
                  REMEMBER ME
                </label>
              </div>
              <div className='text-sm'>
                <a
                  href='/auth/forgot'
                  className='font-pixel text-xs text-[#4ADE80] hover:text-[#22C55E]'
                >
                  FORGOT PASSWORD?
                </a>
              </div>
            </div>

            <div className='pt-4'>
              <PixelButton
                variant='primary'
                key={'login-button'}
                size='md'
                className='w-full'
              >
                LOGIN
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
            NEW PLAYER?{' '}
            <a
              href='/auth/signup'
              className='text-[#4ADE80] hover:text-[#22C55E]'
            >
              SIGN UP
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
