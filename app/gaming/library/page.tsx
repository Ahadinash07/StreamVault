'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiBook,
  FiChevronLeft,
  FiPlay,
  FiStar,
  FiClock,
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiFilter,
  FiGrid,
  FiList,
  FiSearch,
  FiHeart,
  FiBookmark
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface GameLibraryItem {
  id: string
  gameId: string
  gameName: string
  gameIcon: string
  lastPlayed: string
  totalPlayTime: number // in minutes
  highScore: number
  achievements: number
  totalAchievements: number
  favorite: boolean
  completionRate: number
  currentLevel: number
  bestStreak: number
  gamesPlayed: number
  winRate: number
  status: 'completed' | 'in-progress' | 'not-started'
}

const mockLibraryItems: GameLibraryItem[] = [
  {
    id: 'lib-1',
    gameId: 'movie-trivia-master',
    gameName: 'Movie Trivia Master',
    gameIcon: '🎬',
    lastPlayed: '2024-01-20T15:30:00Z',
    totalPlayTime: 450,
    highScore: 9850,
    achievements: 8,
    totalAchievements: 12,
    favorite: true,
    completionRate: 75,
    currentLevel: 15,
    bestStreak: 25,
    gamesPlayed: 67,
    winRate: 89.5,
    status: 'in-progress'
  },
  {
    id: 'lib-2',
    gameId: 'stream-quest',
    gameName: 'Stream Quest',
    gameIcon: '🏆',
    lastPlayed: '2024-01-19T20:15:00Z',
    totalPlayTime: 320,
    highScore: 12400,
    achievements: 6,
    totalAchievements: 10,
    favorite: false,
    completionRate: 60,
    currentLevel: 12,
    bestStreak: 18,
    gamesPlayed: 45,
    winRate: 76.7,
    status: 'in-progress'
  },
  {
    id: 'lib-3',
    gameId: 'plot-twister',
    gameName: 'Plot Twister',
    gameIcon: '🎭',
    lastPlayed: '2024-01-18T14:45:00Z',
    totalPlayTime: 280,
    highScore: 8750,
    achievements: 5,
    totalAchievements: 8,
    favorite: true,
    completionRate: 100,
    currentLevel: 10,
    bestStreak: 15,
    gamesPlayed: 38,
    winRate: 92.1,
    status: 'completed'
  },
  {
    id: 'lib-4',
    gameId: 'binge-watch-challenge',
    gameName: 'Binge Watch Challenge',
    gameIcon: '⚡',
    lastPlayed: '2024-01-17T10:20:00Z',
    totalPlayTime: 195,
    highScore: 6750,
    achievements: 3,
    totalAchievements: 6,
    favorite: false,
    completionRate: 30,
    currentLevel: 8,
    bestStreak: 12,
    gamesPlayed: 28,
    winRate: 67.9,
    status: 'in-progress'
  },
  {
    id: 'lib-5',
    gameId: 'cinematic-puzzles',
    gameName: 'Cinematic Puzzles',
    gameIcon: '🧩',
    lastPlayed: '2024-01-16T16:30:00Z',
    totalPlayTime: 150,
    highScore: 5200,
    achievements: 2,
    totalAchievements: 8,
    favorite: false,
    completionRate: 15,
    currentLevel: 6,
    bestStreak: 8,
    gamesPlayed: 22,
    winRate: 54.5,
    status: 'in-progress'
  }
]

export default function GamingLibraryPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'playtime' | 'completion' | 'score'>('recent')
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'completed' | 'in-progress'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAndSortedItems = mockLibraryItems
    .filter(item => {
      const matchesFilter =
        filterBy === 'all' ||
        (filterBy === 'favorites' && item.favorite) ||
        (filterBy === 'completed' && item.status === 'completed') ||
        (filterBy === 'in-progress' && item.status === 'in-progress')

      const matchesSearch = searchQuery === '' ||
        item.gameName.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
        case 'playtime':
          return b.totalPlayTime - a.totalPlayTime
        case 'completion':
          return b.completionRate - a.completionRate
        case 'score':
          return b.highScore - a.highScore
        default:
          return 0
      }
    })

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatLastPlayed = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'text-green-400',
      'in-progress': 'text-yellow-400',
      'not-started': 'text-gray-400'
    }
    return colors[status as keyof typeof colors] || colors['not-started']
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <FiBook className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-8">Please sign in to view your gaming library</p>
            <Link
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-900/20 via-teal-900/20 to-cyan-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiBook className="w-12 h-12 text-green-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  My Library
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Track your gaming progress, achievements, and statistics
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockLibraryItems.length}</div>
                  <div className="text-sm">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {formatPlayTime(mockLibraryItems.reduce((sum, item) => sum + item.totalPlayTime, 0))}
                  </div>
                  <div className="text-sm">Total Play Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockLibraryItems.reduce((sum, item) => sum + item.achievements, 0)}
                  </div>
                  <div className="text-sm">Achievements</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/gaming"
                  className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <FiChevronLeft className="w-5 h-5 mr-2" />
                  Back to Gaming
                </Link>
                <Link
                  href="/gaming/achievements"
                  className="inline-flex items-center px-8 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-colors"
                >
                  <FiAward className="w-5 h-5 mr-2" />
                  View Achievements
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* View Mode */}
            <div className="flex bg-dark-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="recent">Recently Played</option>
              <option value="playtime">Most Played</option>
              <option value="completion">Completion Rate</option>
              <option value="score">High Score</option>
            </select>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Games</option>
              <option value="favorites">Favorites</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          {/* Library Items */}
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-100 rounded-lg overflow-hidden border border-dark-200 hover:border-purple-500/30 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{item.gameIcon}</div>
                      <div className="flex gap-2">
                        {item.favorite && <FiHeart className="w-5 h-5 text-red-400 fill-current" />}
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)} bg-current/10`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{item.gameName}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Played:</span>
                        <span className="text-white">{formatLastPlayed(item.lastPlayed)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Play Time:</span>
                        <span className="text-white">{formatPlayTime(item.totalPlayTime)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">High Score:</span>
                        <span className="text-yellow-400">{item.highScore.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Completion:</span>
                        <span className="text-green-400">{item.completionRate}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-400">
                        Level {item.currentLevel}
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.achievements}/{item.totalAchievements} achievements
                      </div>
                    </div>

                    <Link
                      href={`/gaming/${item.gameId}`}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiPlay className="w-4 h-4" />
                      Play Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-dark-100 rounded-lg p-6 border border-dark-200 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-4xl">{item.gameIcon}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{item.gameName}</h3>
                        {item.favorite && <FiHeart className="w-5 h-5 text-red-400 fill-current" />}
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)} bg-current/10`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Last Played:</span>
                          <div className="text-white">{formatLastPlayed(item.lastPlayed)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Play Time:</span>
                          <div className="text-white">{formatPlayTime(item.totalPlayTime)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">High Score:</span>
                          <div className="text-yellow-400">{item.highScore.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Completion:</span>
                          <div className="text-green-400">{item.completionRate}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-2">
                        Level {item.currentLevel} • {item.achievements}/{item.totalAchievements} achievements
                      </div>
                      <Link
                        href={`/gaming/${item.gameId}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                      >
                        <FiPlay className="w-4 h-4" />
                        Play Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-16">
              <FiBook className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No games found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Library Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiClock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {formatPlayTime(mockLibraryItems.reduce((sum, item) => sum + item.totalPlayTime, 0))}
              </div>
              <div className="text-gray-400">Total Play Time</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiTarget className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(mockLibraryItems.reduce((sum, item) => sum + item.completionRate, 0) / mockLibraryItems.length)}%
              </div>
              <div className="text-gray-400">Avg Completion</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockLibraryItems.reduce((sum, item) => sum + item.achievements, 0)}
              </div>
              <div className="text-gray-400">Total Achievements</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiTrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.max(...mockLibraryItems.map(item => item.bestStreak))}
              </div>
              <div className="text-gray-400">Best Streak</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}