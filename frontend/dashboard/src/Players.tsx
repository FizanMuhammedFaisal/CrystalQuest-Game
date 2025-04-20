import { useState } from 'react'
import { motion } from 'motion/react'
import { Trophy } from 'lucide-react'
function Players() {
  //@ts-expect-error later
  const [topPlayers, setTopPlayers] = useState([
    {
      id: 1,
      name: 'CrystalMaster99',
      crystals: 12453,
      sessions: 342,
      lastActive: '2h ago'
    },
    {
      id: 2,
      name: 'GalaxyHunter',
      crystals: 10876,
      sessions: 289,
      lastActive: '5m ago'
    },
    {
      id: 3,
      name: 'StarCollector',
      crystals: 9654,
      sessions: 276,
      lastActive: '1h ago'
    },
    {
      id: 4,
      name: 'CosmicGatherer',
      crystals: 8765,
      sessions: 254,
      lastActive: 'Just now'
    },
    {
      id: 5,
      name: 'NebulaNinja',
      crystals: 7890,
      sessions: 231,
      lastActive: '30m ago'
    },
    {
      id: 6,
      name: 'VoidWalker',
      crystals: 6543,
      sessions: 198,
      lastActive: '4h ago'
    },
    {
      id: 7,
      name: 'AstralHunter',
      crystals: 5432,
      sessions: 187,
      lastActive: '1d ago'
    },
    {
      id: 8,
      name: 'QuantumRaider',
      crystals: 4987,
      sessions: 165,
      lastActive: '3h ago'
    },
    {
      id: 9,
      name: 'StellarNomad',
      crystals: 4321,
      sessions: 154,
      lastActive: '2d ago'
    },
    {
      id: 10,
      name: 'GalacticPioneer',
      crystals: 3876,
      sessions: 132,
      lastActive: '5h ago'
    },
    {
      id: 11,
      name: 'CosmicVoyager',
      crystals: 3654,
      sessions: 128,
      lastActive: '12h ago'
    },
    {
      id: 12,
      name: 'StardustSeeker',
      crystals: 3421,
      sessions: 119,
      lastActive: '1d ago'
    }
  ])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm mb-8'
      >
        <div className='p-5 border-b border-gray-700/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Trophy className='w-5 h-5 text-yellow-500' />
              <h2 className='text-xl font-bold'>Top Players</h2>
            </div>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search players...'
                  className='bg-gray-700/50 border border-gray-600/50 rounded-lg py-2 px-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
              </div>
              <select className='bg-gray-700/50 border border-gray-600/50 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                <option>Sort by: Crystals</option>
                <option>Sort by: Sessions</option>
                <option>Sort by: Last Active</option>
              </select>
            </div>
          </div>
        </div>
        <div className='p-5'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='text-left text-gray-400 text-sm'>
                  <th className='pb-3 font-medium'>Rank</th>
                  <th className='pb-3 font-medium'>Player</th>
                  <th className='pb-3 font-medium text-right'>Crystals</th>
                  <th className='pb-3 font-medium text-right'>Sessions</th>
                  <th className='pb-3 font-medium text-right'>Last Active</th>
                  <th className='pb-3 font-medium text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player, index) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='border-b border-gray-700/30 hover:bg-gray-700/20'
                  >
                    <td className='py-3 pr-4'>
                      <div className='flex items-center'>
                        {index < 3 ? (
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : index === 1
                                ? 'bg-gray-400/20 text-gray-400'
                                : 'bg-amber-700/20 text-amber-700'
                            }`}
                          >
                            {index + 1}
                          </div>
                        ) : (
                          <div className='w-6 h-6 rounded-full flex items-center justify-center text-xs'>
                            {index + 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='py-3 pr-4 font-medium'>{player.name}</td>
                    <td className='py-3 pr-4 text-right font-mono'>
                      {player.crystals.toLocaleString()}
                    </td>
                    <td className='py-3 pr-4 text-right'>{player.sessions}</td>
                    <td className='py-3 pr-4 text-right text-gray-400 text-sm'>
                      {player.lastActive}
                    </td>
                    <td className='py-3 text-right'>
                      <button className='text-indigo-400 hover:text-indigo-300 text-sm mr-2'>
                        View
                      </button>
                      <button className='text-gray-400 hover:text-gray-300 text-sm'>
                        Edit
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-6 flex justify-between items-center'>
            <div className='text-sm text-gray-400'>
              Showing <span className='font-medium text-white'>1-12</span> of{' '}
              <span className='font-medium text-white'>1,245</span> players
            </div>
            <div className='flex gap-2'>
              <button className='bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1 text-sm'>
                Previous
              </button>
              <button className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1 text-sm'>
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Players
