import { motion } from 'framer-motion'
import { Activity, Clock, Gamepad2, Home, Settings, Users } from 'lucide-react'
import { useState } from 'react'
import Dashboard from './Dashboard'
import Players from './Players'
import SettingsTab from './Settings'
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard />
      case 'players':
        return <Players />
      case 'settings':
        return <SettingsTab />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-[#101827] text-gray-200'>
      <div className='flex h-screen overflow-hidden'>
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='hidden md:flex flex-col w-64 bg-gray-800/70 border-r border-gray-700/50'
        >
          <div className='p-4 border-b border-gray-700/50'>
            <div className='flex items-center gap-3'>
              <Gamepad2 className='w-8 h-8 text-indigo-400' />
              <h1 className='text-xl font-bold'>Game Admin</h1>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto py-4'>
            <nav className='px-2 space-y-1'>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Home className='w-5 h-5' />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('players')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'players'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Users className='w-5 h-5' />
                <span>Players</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Settings className='w-5 h-5' />
                <span>Settings</span>
              </button>
            </nav>
          </div>
          <div className='p-4 border-t border-gray-700/50'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold'>
                A
              </div>
              <div>
                <p className='font-medium'>Admin User</p>
                <p className='text-xs text-gray-400'>admin@game.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile sidebar toggle */}
        <div className='md:hidden fixed top-4 left-4 z-50'>
          <button
            className='bg-gray-800/90 text-gray-200 p-2 rounded-lg border border-gray-700/50'
            onClick={() => {
              const sidebar = document.getElementById('mobile-sidebar')
              if (sidebar) {
                sidebar.classList.toggle('translate-x-0')
                sidebar.classList.toggle('-translate-x-full')
              }
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>

        {/* Mobile sidebar */}
        <div
          id='mobile-sidebar'
          className='fixed inset-y-0 left-0 z-40 w-64 bg-gray-800/95 border-r border-gray-700/50 transform -translate-x-full transition-transform duration-300 md:hidden'
        >
          <div className='p-4 border-b border-gray-700/50'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Gamepad2 className='w-8 h-8 text-indigo-400' />
                <h1 className='text-xl font-bold'>Game Admin</h1>
              </div>
              <button
                className='text-gray-400 hover:text-white'
                onClick={() => {
                  const sidebar = document.getElementById('mobile-sidebar')
                  if (sidebar) {
                    sidebar.classList.toggle('translate-x-0')
                    sidebar.classList.toggle('-translate-x-full')
                  }
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto py-4'>
            <nav className='px-2 space-y-1'>
              <button
                onClick={() => {
                  setActiveTab('overview')
                  const sidebar = document.getElementById('mobile-sidebar')
                  if (sidebar) {
                    sidebar.classList.toggle('translate-x-0')
                    sidebar.classList.toggle('-translate-x-full')
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Home className='w-5 h-5' />
                <span>Overview</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('players')
                  const sidebar = document.getElementById('mobile-sidebar')
                  if (sidebar) {
                    sidebar.classList.toggle('translate-x-0')
                    sidebar.classList.toggle('-translate-x-full')
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'players'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Users className='w-5 h-5' />
                <span>Players</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('activity')
                  const sidebar = document.getElementById('mobile-sidebar')
                  if (sidebar) {
                    sidebar.classList.toggle('translate-x-0')
                    sidebar.classList.toggle('-translate-x-full')
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'activity'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Activity className='w-5 h-5' />
                <span>Activity</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings')
                  const sidebar = document.getElementById('mobile-sidebar')
                  if (sidebar) {
                    sidebar.classList.toggle('translate-x-0')
                    sidebar.classList.toggle('-translate-x-full')
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Settings className='w-5 h-5' />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1 overflow-y-auto'>
          <header className='bg-gray-800/50 border-b border-gray-700/50 p-4 sticky top-0 z-10'>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-bold'>
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'players' && 'Player Management'}
                {activeTab === 'activity' && 'Activity Log'}
                {activeTab === 'settings' && 'System Settings'}
              </h1>
              <div className='flex items-center gap-4'>
                <div className='bg-gray-800/70 rounded-lg px-4 py-2 flex items-center gap-2'>
                  <Clock className='w-4 h-4 text-indigo-400' />
                  <span className='text-sm'>Last updated: 2 minutes ago</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className='bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                >
                  Refresh Data
                </motion.button>
              </div>
            </div>
          </header>
          <main className='p-6'>{renderTabContent()}</main>
        </div>
      </div>
    </div>
  )
}
