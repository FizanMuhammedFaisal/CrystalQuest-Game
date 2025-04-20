import { useState } from 'react'
import { motion } from 'motion/react'
import { Activity, Clock, Diamond, Package, Users } from 'lucide-react'
function Dashboard() {
  // Mock data - in a real app, this would come from your API
  //@ts-expect-error later
  const [stats, setStats] = useState({
    totalPlayers: 12467,
    activePlayers: 3842,
    totalHours: 28945,
    avgSessionTime: '42m',
    totalCrystals: 1458923,
    crystalsDelivered: 876543,
    sessionsCompleted: 45672
  })
  //@ts-expect-error later
  const [recentLogins, setRecentLogins] = useState([
    {
      id: 1,
      name: 'CosmicGatherer',
      time: '2 minutes ago',
      duration: '42m',
      crystals: 145
    },
    {
      id: 2,
      name: 'GalaxyHunter',
      time: '5 minutes ago',
      duration: '1h 12m',
      crystals: 287
    },
    {
      id: 3,
      name: 'StarDust42',
      time: '15 minutes ago',
      duration: '24m',
      crystals: 67
    },
    {
      id: 4,
      name: 'NebulaNinja',
      time: '30 minutes ago',
      duration: '45m',
      crystals: 132
    },
    {
      id: 5,
      name: 'VoidSeeker',
      time: '1 hour ago',
      duration: '32m',
      crystals: 89
    }
  ])

  return (
    <div>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.03 }}
          className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 backdrop-blur-sm'
        >
          <div className='flex justify-between items-start mb-4'>
            <div className='bg-blue-500/20 p-2 rounded-lg'>
              <Users className='w-6 h-6 text-blue-500' />
            </div>
            <div className='text-right'>
              <span className='text-2xl font-bold'>
                {stats.totalPlayers.toLocaleString()}
              </span>
              <p className='text-xs text-gray-400'>+24 today</p>
            </div>
          </div>
          <h3 className='text-gray-400 text-sm'>Total Players</h3>
          <p className='text-sm mt-2'>
            <span className='text-green-400'>
              {stats.activePlayers.toLocaleString()}
            </span>{' '}
            currently active
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.03 }}
          className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 backdrop-blur-sm'
        >
          <div className='flex justify-between items-start mb-4'>
            <div className='bg-purple-500/20 p-2 rounded-lg'>
              <Clock className='w-6 h-6 text-purple-500' />
            </div>
            <div className='text-right'>
              <span className='text-2xl font-bold'>
                {stats.totalHours.toLocaleString()}
              </span>
              <p className='text-xs text-gray-400'>hours played</p>
            </div>
          </div>
          <h3 className='text-gray-400 text-sm'>Total Playtime</h3>
          <p className='text-sm mt-2'>
            Avg. session:{' '}
            <span className='text-purple-400'>{stats.avgSessionTime}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 backdrop-blur-sm'
        >
          <div className='flex justify-between items-start mb-4'>
            <div className='bg-indigo-500/20 p-2 rounded-lg'>
              <Diamond className='w-6 h-6 text-indigo-500' />
            </div>
            <div className='text-right'>
              <span className='text-2xl font-bold'>
                {stats.totalCrystals.toLocaleString()}
              </span>
              <p className='text-xs text-gray-400'>total collected</p>
            </div>
          </div>
          <h3 className='text-gray-400 text-sm'>Crystals Collected</h3>
          <p className='text-sm mt-2'>
            Avg. per player:{' '}
            <span className='text-indigo-400'>
              {Math.round(stats.totalCrystals / stats.totalPlayers)}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 backdrop-blur-sm'
        >
          <div className='flex justify-between items-start mb-4'>
            <div className='bg-green-500/20 p-2 rounded-lg'>
              <Package className='w-6 h-6 text-green-500' />
            </div>
            <div className='text-right'>
              <span className='text-2xl font-bold'>
                {stats.crystalsDelivered.toLocaleString()}
              </span>
              <p className='text-xs text-gray-400'>total delivered</p>
            </div>
          </div>
          <h3 className='text-gray-400 text-sm'>Crystals Delivered</h3>
          <p className='text-sm mt-2'>
            Completion rate:{' '}
            <span className='text-green-400'>
              {Math.round(
                (stats.crystalsDelivered / stats.totalCrystals) * 100
              )}
              %
            </span>
          </p>
        </motion.div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm lg:col-span-3'
        >
          <div className='p-5 border-b border-gray-700/50'>
            <div className='flex items-center gap-2'>
              <Activity className='w-5 h-5 text-green-500' />
              <h2 className='text-xl font-bold'>Recent Logins</h2>
            </div>
          </div>
          <div className='p-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {recentLogins.map((login, index) => (
                <motion.div
                  key={login.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors'
                >
                  <div className='bg-blue-500/20 p-2 rounded-lg'>
                    <Users className='w-5 h-5 text-blue-500' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between'>
                      <p className='font-medium'>{login.name}</p>
                      <p className='text-xs text-gray-400'>{login.time}</p>
                    </div>
                    <div className='flex justify-between mt-1 text-sm'>
                      <span className='text-gray-400'>
                        Session: {login.duration}
                      </span>
                      <span className='text-indigo-400'>
                        {login.crystals} crystals
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className='mt-4 text-center'>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className='text-indigo-400 hover:text-indigo-300 text-sm font-medium'
              >
                View All Activity
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Game Stats
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className='bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm mb-8'
      >
        <div className='p-5 border-b border-gray-700/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <LineChart className='w-5 h-5 text-indigo-500' />
              <h2 className='text-xl font-bold'>Game Performance</h2>
            </div>
            <div className='flex gap-4'>
              <button className='text-sm text-gray-400 hover:text-white'>
                Daily
              </button>
              <button className='text-sm text-indigo-400 font-medium'>
                Weekly
              </button>
              <button className='text-sm text-gray-400 hover:text-white'>
                Monthly
              </button>
            </div>
          </div>
        </div>
        <div className='p-5'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-gray-700/30 rounded-lg p-4'>
              <h3 className='text-gray-400 text-sm mb-2'>Sessions Completed</h3>
              <p className='text-2xl font-bold'>
                {stats.sessionsCompleted.toLocaleString()}
              </p>
              <p className='text-sm text-green-400 mt-1'>+12% from last week</p>
            </div>
            <div className='bg-gray-700/30 rounded-lg p-4'>
              <h3 className='text-gray-400 text-sm mb-2'>
                Avg. Session Duration
              </h3>
              <p className='text-2xl font-bold'>{stats.avgSessionTime}</p>
              <p className='text-sm text-red-400 mt-1'>-3% from last week</p>
            </div>
            <div className='bg-gray-700/30 rounded-lg p-4'>
              <h3 className='text-gray-400 text-sm mb-2'>
                Crystals Per Session
              </h3>
              <p className='text-2xl font-bold'>
                {Math.round(stats.totalCrystals / stats.sessionsCompleted)}
              </p>
              <p className='text-sm text-green-400 mt-1'>+8% from last week</p>
            </div>
          </div>

        
          <div className='mt-6 h-64 bg-gray-700/30 rounded-lg flex items-center justify-center'>
            <p className='text-gray-400'>
              Weekly performance chart would go here
            </p>
          </div>
        </div>
      </motion.div> */}
    </div>
  )
}

export default Dashboard
