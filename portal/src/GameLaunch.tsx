import type React from 'react'

import { useState } from 'react'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { PixelButton } from 'game/GameUI.tsx'
import { Diamond, Clock, Users, Sparkles, ChevronRight } from 'lucide-react'
interface GameLaunchProps {
  onNavigate: (path: string) => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
}
//

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
}

const pixelVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.04,
      type: 'spring',
      stiffness: 200,
      damping: 10
    }
  })
}

const titleVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const letterVariants: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
}

// Crystal decoration component
const CrystalDecoration = ({ className = '' }: { className?: string }) => {
  const crystals = Array.from({ length: 9 }, (_, i) => i)

  return (
    <div className={`grid grid-cols-3 gap-1 ${className}`}>
      {crystals.map(i => (
        <motion.div
          key={i}
          custom={i}
          variants={pixelVariants}
          initial='hidden'
          animate='visible'
          className={`w-3 h-5 rotate-45 ${
            i % 3 === 0
              ? 'bg-pink-500'
              : i % 3 === 1
              ? 'bg-purple-400'
              : 'bg-blue-500'
          }`}
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />
      ))}
    </div>
  )
}

export default function GameLaunchScreen({ onNavigate }: GameLaunchProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const gameTitle = 'CRYSTAL QUEST'
  const toggleStats = () => {
    setShowStats(!showStats)
  }
  const handleLaunch = () => {
    setIsLoading(true)
    // Simulate loading before navigation
    onNavigate('/game')
  }

  return (
    <motion.div
      className='relative flex flex-col h-screen w-full bg-[#111827] text-white font-mono overflow-hidden'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      {/* Background crystal grid */}
      <div className='absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-5 pointer-events-none'>
        {Array.from({ length: 400 }, (_, i) => (
          <div
            key={i}
            className={`border border-gray-700 ${
              i % 11 === 0 ? 'bg-pink-900' : i % 13 === 0 ? 'bg-purple-900' : ''
            }`}
          ></div>
        ))}
      </div>

      {/* Decorative elements */}
      <CrystalDecoration className='absolute top-8 left-8' />
      <CrystalDecoration className='absolute bottom-8 right-8' />
      <CrystalDecoration className='absolute top-8 right-8' />
      <CrystalDecoration className='absolute bottom-8 left-8' />

      {/* Game title */}
      <motion.div className='mt-12 text-center' variants={titleVariants}>
        <div className='flex justify-center space-x-2'>
          {gameTitle.split('').map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className='text-5xl md:text-7xl font-bold inline-block'
              style={{
                textShadow:
                  '0 0 10px rgba(236, 72, 153, 0.7), 0 0 20px rgba(236, 72, 153, 0.5)',
                color: index % 2 === 0 ? '#ec4899' : '#a855f7'
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.p
          className='text-lg text-gray-300 mt-2'
          variants={itemVariants}
        >
          Collect crystals, serve the kingdom
        </motion.p>
      </motion.div>

      {/* Main content */}
      <div className='flex flex-col md:flex-row flex-1 p-6 gap-8'>
        {/* Game Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className='w-full md:w-1/3 p-6 border-2 border-pink-900/50 rounded-lg bg-gray-900/50 backdrop-blur-sm'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <motion.h2
                className='text-2xl mb-6 flex items-center gap-2 text-pink-400 border-b-2 border-pink-900/30 pb-2'
                variants={itemVariants}
              >
                <Diamond className='h-5 w-5' />
                Crystal Stats
              </motion.h2>

              <div className='space-y-4'>
                <StatItem
                  icon={<Diamond className='h-4 w-4 text-pink-400' />}
                  label='Collected Crystals'
                  value='1,248'
                  delay={0.1}
                />
                <StatItem
                  icon={<Users className='h-4 w-4 text-purple-400' />}
                  label='Total Served'
                  value='342'
                  delay={0.2}
                />
                <StatItem
                  icon={<Clock className='h-4 w-4 text-blue-400' />}
                  label='Play Time'
                  value='24h 18m'
                  delay={0.3}
                />
              </div>

              <motion.div
                className='mt-8 p-4 bg-gray-800/80 rounded-md border-2 border-pink-900/30'
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className='text-lg mb-2 text-pink-400 flex items-center gap-2'>
                  <Sparkles className='h-4 w-4' />
                  Last Session
                </h3>
                <p className='text-sm text-gray-300'>Crystals: 86</p>
                <p className='text-sm text-gray-300'>Served: 24</p>
                <p className='text-sm text-gray-300'>Time: 1h 45m</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launch Button Area */}
        <motion.div
          className='flex-1 flex flex-col items-center justify-center'
          variants={containerVariants}
        >
          <motion.div
            className='relative'
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className='absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur-lg opacity-75'
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse'
              }}
            />
            <PixelButton
              size='lg'
              variant='warning'
              onClick={handleLaunch}
              disabled={isLoading}
              icon={<Diamond className='h-6 w-6' />}
              className='px-12 py-6 text-xl relative'
            >
              {isLoading ? 'LAUNCHING...' : 'START QUEST'}
            </PixelButton>
          </motion.div>

          <motion.div
            className='mt-8 flex items-center gap-2 text-pink-300'
            variants={itemVariants}
            animate={{
              x: [0, 5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse'
            }}
          >
            Press to begin your journey <ChevronRight className='h-4 w-4' />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <PixelButton
              variant='warning'
              className={`${isLoading ? 'hidden' : ''} mt-10`}
              onClick={toggleStats}
            >
              Show Stats
            </PixelButton>
          </motion.div>

          {/* Crystal counter animation */}
          <motion.div
            className='absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2'
            animate={{
              y: [0, -5, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse'
            }}
          >
            <Diamond className='h-5 w-5 text-pink-400' />
            <span className='text-pink-300 text-sm'>Crystals await...</span>
          </motion.div>

          {/* Version info */}
          <motion.div
            className='absolute bottom-4 right-4 text-xs text-pink-300/50'
            variants={itemVariants}
          >
            v2.1.5
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Helper component for stat items with animation
interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
  delay: number
}

function StatItem({ icon, label, value, delay }: StatItemProps) {
  return (
    <motion.div
      className='flex items-center justify-between p-3 bg-gray-800/80 rounded-md border-2 border-pink-900/30'
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
    >
      <div className='flex items-center gap-2'>
        {icon}
        <span className='text-gray-300'>{label}</span>
      </div>
      <motion.span
        className='font-bold text-pink-400'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {value}
      </motion.span>
    </motion.div>
  )
}
