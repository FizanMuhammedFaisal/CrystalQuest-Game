'use client'

import type React from 'react'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Trophy,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Edit,
  Filter
} from 'lucide-react'
import { motion } from 'motion/react'
import apiClient from '../api/apiClient'

// Define types
interface Player {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

interface PaginationData {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

interface PlayersResponse {
  players: Player[]
  pagination: PaginationData
}

export default function PlayersPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [sort, setSort] = useState('username')
  const [order, setOrder] = useState('desc')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setTimeout(() => {
      setDebouncedSearch(e.target.value)
      setPage(1) // Reset to first page on new search
    }, 300)
  }

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)
    setPage(1) // Reset to first page on sort change
  }

  // Handle order change
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value)
    setPage(1) // Reset to first page on order change
  }

  // Fetch players data
  const { data, isLoading, isError } = useQuery<PlayersResponse>({
    queryKey: ['players', page, limit, sort, order, debouncedSearch],
    queryFn: async () => {
      const response = await apiClient.get(
        `dashboard/players?page=${page}&limit=${limit}&sort=${sort}&order=${order}&search=${debouncedSearch}`
      )
      return response.data.data
    }
  })

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (data && page < data.pagination.totalPages) {
      setPage(page + 1)
    }
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <Trophy className='w-6 h-6 text-yellow-500' />
          Players Management
        </h1>
        {/* <div className='flex gap-2'>
          <button className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors'>
            <UserPlus className='w-4 h-4' />
            Add Player
          </button>
          <button className='bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors'>
            <Download className='w-4 h-4' />
            Export
          </button>
        </div> */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm mb-8 shadow-lg'
      >
        <div className='p-5 border-b border-gray-700/50'>
          <div className='flex items-center justify-between flex-col md:flex-row gap-4'>
            <div className='flex items-center gap-2'>
              <h2 className='text-xl font-medium'>All Players</h2>
              <span className='bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full'>
                {data?.pagination?.totalItems || 0} total
              </span>
            </div>
            <div className='flex items-center gap-4 flex-col sm:flex-row w-full md:w-auto'>
              <div className='relative w-full sm:w-64'>
                <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search players...'
                  value={search}
                  onChange={handleSearchChange}
                  className='bg-gray-700/50 border border-gray-600/50 rounded-lg py-2 pl-9 pr-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
                />
              </div>
              <div className='flex gap-2 w-full sm:w-auto'>
                <button className='bg-gray-700/50 border border-gray-600/50 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex items-center gap-1'>
                  <Filter className='w-4 h-4' />
                  Filter
                </button>
                <select
                  className='bg-gray-700/50 border border-gray-600/50 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-auto'
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value='username'>Sort by: Username</option>
                  <option value='email'>Sort by: Email</option>
                  <option value='createdAt'>Sort by: Created</option>
                </select>
                <select
                  className='bg-gray-700/50 border border-gray-600/50 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-auto'
                  value={order}
                  onChange={handleOrderChange}
                >
                  <option value='desc'>Order: Desc</option>
                  <option value='asc'>Order: Asc</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='p-5'>
          <div className='overflow-x-auto'>
            {isLoading ? (
              <div className='flex justify-center items-center py-20'>
                <Loader2 className='w-8 h-8 text-indigo-500 animate-spin' />
              </div>
            ) : isError ? (
              <div className='text-center py-10 text-red-400'>
                Error loading players data. Please try again.
              </div>
            ) : data?.players?.length === 0 ? (
              <div className='text-center py-10 text-gray-400'>
                No players found. Try adjusting your search criteria.
              </div>
            ) : (
              <table className='w-full'>
                <thead>
                  <tr className='text-left text-gray-400 text-sm'>
                    <th className='pb-3 font-medium'>ID</th>
                    <th className='pb-3 font-medium'>Player</th>
                    <th className='pb-3 font-medium'>Email</th>
                    <th className='pb-3 font-medium'>Created</th>
                    <th className='pb-3 font-medium text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.players?.map((player, index) => {
                    return (
                      <motion.tr
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className='border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors'
                      >
                        <td className='py-3 pr-4 text-gray-400'>
                          #{player.id}
                        </td>
                        <td className='py-3 pr-4'>
                          <div className='flex items-center'>
                            <div className='font-medium text-white'>
                              {player.username}
                            </div>
                            {player.role === 'admin' && (
                              <span className='ml-2 px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full'>
                                Admin
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          className='py-3 pr-4 text-gray-300 truncate max-w-[200px]'
                          title={player.email}
                        >
                          {player.email}
                        </td>
                        <td className='py-3 pr-4 text-gray-400'>
                          {formatDate(player.createdAt)}
                        </td>
                        <td className='py-3 text-right'>
                          <button
                            className='text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 p-1.5 rounded-md transition-colors mr-1'
                            title='View player'
                          >
                            <Eye className='w-4 h-4' />
                          </button>
                          <button
                            className='text-gray-400 hover:text-gray-300 hover:bg-gray-500/20 p-1.5 rounded-md transition-colors'
                            title='Edit player'
                          >
                            <Edit className='w-4 h-4' />
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className='mt-6 flex justify-between items-center flex-col sm:flex-row gap-4'>
            <div className='text-sm text-gray-400 order-2 sm:order-1'>
              {data && (
                <>
                  Showing{' '}
                  <span className='font-medium text-white'>
                    {(page - 1) * limit + 1}-
                    {Math.min(page * limit, data?.pagination?.totalItems)}
                  </span>{' '}
                  of{' '}
                  <span className='font-medium text-white'>
                    {data?.pagination?.totalItems}
                  </span>{' '}
                  players
                </>
              )}
            </div>
            <div className='flex gap-2 order-1 sm:order-2'>
              <button
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
                  page <= 1
                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                } transition-colors`}
                onClick={handlePrevPage}
                disabled={page <= 1}
              >
                <ChevronLeft className='h-4 w-4' /> Previous
              </button>
              <button
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
                  !data || page >= data?.pagination?.totalPages
                    ? 'bg-indigo-600/50 text-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                } transition-colors`}
                onClick={handleNextPage}
                disabled={!data || page >= data?.pagination?.totalPages}
              >
                Next <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
