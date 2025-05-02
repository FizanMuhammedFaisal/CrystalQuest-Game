import type React from 'react'

import { useState } from 'react'
import { motion } from 'motion/react'
import { PixelButton } from 'game/GameUI.tsx'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Check } from 'lucide-react'

export function ForgotPasswordForm() {
  // Form state management
  const [formStep, setFormStep] = useState<'email' | 'reset'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCodeVerified, setIsCodeVerified] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Reset email submitted:', formData.email)
    // In a real app, you would send a request to your backend here
    // For demo purposes, we'll just move to the next step
    setFormStep('reset')
  }

  const handleCodeVerify = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Verifying code:', formData.code)
    // In a real app, you would verify the code with your backend
    // For demo purposes, we'll just set it as verified
    setIsCodeVerified(true)
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    console.log('Password reset submitted:', {
      email: formData.email,
      code: formData.code,
      newPassword: formData.newPassword
    })
    // Add your password reset logic here
  }

  const goBack = () => {
    if (formStep === 'reset') {
      setFormStep('email')
      setIsCodeVerified(false)
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
          <h1 className='font-pixel text-4xl text-white'>RESET PASSWORD</h1>
          <p className='mt-2 font-pixel text-sm text-[#9CA3AF]'>
            {formStep === 'email'
              ? 'ENTER YOUR EMAIL TO RECEIVE A RESET CODE'
              : 'ENTER YOUR CODE AND NEW PASSWORD'}
          </p>
        </motion.div>

        <motion.div
          className='border-4 border-t-[#4ADE80] border-l-[#4ADE80] border-r-[#166534] border-b-[#166534] bg-[#0F172A] p-6'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          key={formStep} // This forces a re-render of the animation when the step changes
        >
          {formStep === 'email' ? (
            <form onSubmit={handleEmailSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <label className='font-pixel text-sm text-white'>EMAIL</label>
                <div className='relative'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <Mail className='h-5 w-5 text-[#4ADE80]' />
                  </div>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                    placeholder='ENTER YOUR EMAIL'
                    required
                  />
                </div>
              </div>

              <div className='pt-4'>
                <PixelButton
                  variant='primary'
                  key={'send-code-button'}
                  size='md'
                  className='w-full'
                >
                  SEND RESET CODE
                </PixelButton>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className='space-y-6'>
              {/* Verification Code Input */}
              {!isCodeVerified && (
                <div className='space-y-2'>
                  <label className='font-pixel text-sm text-white'>
                    VERIFICATION CODE
                  </label>
                  <div className='flex space-x-2'>
                    <input
                      type='text'
                      name='code'
                      value={formData.code}
                      onChange={handleChange}
                      className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 text-white focus:outline-none'
                      placeholder='ENTER CODE'
                      required
                    />
                    <PixelButton
                      variant='secondary'
                      key={'verify-code-button'}
                      size='sm'
                      onClick={() => {
                        handleCodeVerify(
                          new Event('click') as unknown as React.FormEvent
                        )
                      }}
                      className='whitespace-nowrap'
                    >
                      VERIFY
                    </PixelButton>
                  </div>
                </div>
              )}

              {/* Code Verified Message */}
              {isCodeVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex items-center space-x-2 bg-[#065F46]/20 p-3 border-l-2 border-[#4ADE80]'
                >
                  <Check className='h-5 w-5 text-[#4ADE80]' />
                  <span className='font-pixel text-xs text-[#4ADE80]'>
                    CODE VERIFIED SUCCESSFULLY
                  </span>
                </motion.div>
              )}

              {/* New Password Fields - Only show after code is verified */}
              {isCodeVerified && (
                <>
                  <div className='space-y-2'>
                    <label className='font-pixel text-sm text-white'>
                      NEW PASSWORD
                    </label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <Lock className='h-5 w-5 text-[#4ADE80]' />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name='newPassword'
                        value={formData.newPassword}
                        onChange={handleChange}
                        className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                        placeholder='ENTER NEW PASSWORD'
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

                  <div className='space-y-2'>
                    <label className='font-pixel text-sm text-white'>
                      CONFIRM PASSWORD
                    </label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <Lock className='h-5 w-5 text-[#4ADE80]' />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className='font-pixel w-full border-4 border-t-[#4B5563] border-l-[#4B5563] border-r-[#1F2937] border-b-[#1F2937] bg-[#1F2937] p-2 pl-10 text-white focus:outline-none'
                        placeholder='CONFIRM NEW PASSWORD'
                        required
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                      variant='primary'
                      key={'reset-password-button'}
                      size='md'
                      className='w-full'
                    >
                      RESET PASSWORD
                    </PixelButton>
                  </div>
                </>
              )}
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='mt-6 flex justify-between items-center'
        >
          <button
            onClick={goBack}
            className={`flex items-center font-pixel text-sm text-[#9CA3AF] hover:text-[#4ADE80] ${
              formStep === 'email' ? 'invisible' : ''
            }`}
          >
            <ArrowLeft className='h-4 w-4 mr-1' />
            BACK
          </button>

          <p className='font-pixel text-sm text-[#9CA3AF]'>
            REMEMBER PASSWORD?{' '}
            <a
              href='/auth/login'
              className='text-[#4ADE80] hover:text-[#22C55E]'
            >
              LOGIN
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
