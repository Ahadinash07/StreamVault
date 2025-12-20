'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiPlay,
  FiUsers,
  FiAward,
  FiTarget,
  FiZap,
  FiStar,
  FiClock,
  FiTrendingUp,
  FiChevronRight,
  FiDownload,
  FiShare,
  FiHeart,
  FiX
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { addNotification } from '@/app/features/notifications/notificationsSlice'

interface Game {
  id: string
  title: string
  description: string
  genre: string
  rating: number
  players: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  image: string
  trailer: string
  featured: boolean
  new: boolean
  tags: string[]
}

const mockGames: Game[] = [
  {
    id: 'game-1',
    title: 'Stream Quest',
    description: 'An epic adventure game designed for streamers and viewers to play together',
    genre: 'Adventure',
    rating: 9.2,
    players: '1-4 Players',
    duration: '30-60 min',
    difficulty: 'Medium',
    image: 'https://picsum.photos/seed/game1/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featured: true,
    new: true,
    tags: ['Multiplayer', 'Adventure', 'Co-op']
  },
  {
    id: 'game-2',
    title: 'Movie Trivia Master',
    description: 'Test your movie knowledge with friends in this interactive trivia game',
    genre: 'Trivia',
    rating: 8.8,
    players: '2-8 Players',
    duration: '15-30 min',
    difficulty: 'Easy',
    image: 'https://picsum.photos/seed/game2/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    featured: true,
    new: false,
    tags: ['Trivia', 'Educational', 'Party']
  },
  {
    id: 'game-3',
    title: 'Director\'s Cut',
    description: 'Create your own movie scenes and compete with other aspiring directors',
    genre: 'Creative',
    rating: 9.0,
    players: '1-6 Players',
    duration: '45-90 min',
    difficulty: 'Hard',
    image: 'https://picsum.photos/seed/game3/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    featured: false,
    new: true,
    tags: ['Creative', 'Strategy', 'Educational']
  },
  {
    id: 'game-4',
    title: 'Binge Watch Challenge',
    description: 'Race against time to identify movie scenes and quotes',
    genre: 'Puzzle',
    rating: 8.5,
    players: '1-4 Players',
    duration: '20-40 min',
    difficulty: 'Medium',
    image: 'https://picsum.photos/seed/game4/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    featured: false,
    new: false,
    tags: ['Puzzle', 'Quick Play', 'Competitive']
  }
]

export default function GamingPage() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState<'featured' | 'all' | 'new' | 'leaderboard'>('featured')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showGameModal, setShowGameModal] = useState(false)

  const featuredGames = mockGames.filter(game => game.featured)
  const newGames = mockGames.filter(game => game.new)
  const allGames = mockGames

  const getCurrentGames = () => {
    switch (activeTab) {
      case 'featured': return featuredGames
      case 'new': return newGames
      case 'all': return allGames
      default: return featuredGames
    }
  }

  const handlePlayGame = (game: Game) => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        id: `login-required-${Date.now()}`,
        type: 'warning',
        title: 'Login Required',
        message: 'Please log in to play games',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: '/login',
        actionText: 'Login'
      }))
      return
    }

    setSelectedGame(game)
    setShowGameModal(true)

    dispatch(addNotification({
      id: `game-started-${Date.now()}`,
      type: 'success',
      title: 'Game Started!',
      message: `Enjoy playing ${game.title}`,
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'Hard': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiPlay className="w-12 h-12 text-purple-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  GameZone
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Play interactive games designed for movie lovers and streamers
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockGames.length}</div>
                  <div className="text-sm">Games Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">🎮</div>
                  <div className="text-sm">Interactive Fun</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">🏆</div>
                  <div className="text-sm">Achievements</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                  <FiPlay className="w-5 h-5 mr-2" />
                  Play Featured Game
                </button>
                <button className="inline-flex items-center px-8 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold rounded-lg transition-colors">
                  <FiAward className="w-5 h-5 mr-2" />
                  View Leaderboard
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Game Tabs */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-dark-200 pb-4">
            {[
              { id: 'featured', label: 'Featured', icon: FiStar, count: featuredGames.length },
              { id: 'new', label: 'New Releases', icon: FiZap, count: newGames.length },
              { id: 'all', label: 'All Games', icon: FiPlay, count: allGames.length },
              { id: 'leaderboard', label: 'Leaderboard', icon: FiAward, count: null }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-1 px-2 py-0.5 bg-dark-200 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Games Grid */}
          {activeTab !== 'leaderboard' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {getCurrentGames().map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-dark-100 rounded-lg overflow-hidden hover:bg-dark-200 transition-colors group"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {game.new && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                          NEW
                        </span>
                      )}
                      {game.featured && (
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{game.rating}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {game.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        {game.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {game.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Players:</span>
                        <span className="text-white ml-1">{game.players}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-white ml-1">{game.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlayGame(game)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <FiPlay className="w-4 h-4 mr-2" />
                        Play Now
                      </button>
                      <button className="p-2 bg-dark-200 hover:bg-dark-300 text-gray-400 hover:text-white rounded-lg transition-colors">
                        <FiHeart className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-dark-200 hover:bg-dark-300 text-gray-400 hover:text-white rounded-lg transition-colors">
                        <FiShare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Leaderboard */}
          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">🏆 Gaming Leaderboard</h2>
                <p className="text-gray-400">Top players across all games</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Top 3 Players */}
                {[1, 2, 3].map((position) => (
                  <div key={position} className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-2">
                      {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {position === 1 ? 'MovieMaster2024' : position === 2 ? 'Cinephile99' : 'StreamKing'}
                    </h3>
                    <p className="text-yellow-400 font-semibold">
                      {1500 - (position - 1) * 200} points
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {25 - (position - 1) * 3} games played
                    </p>
                  </div>
                ))}
              </div>

              {/* Full Leaderboard */}
              <div className="bg-dark-100 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-dark-200">
                  <h3 className="text-lg font-semibold text-white">Full Rankings</h3>
                </div>
                <div className="divide-y divide-dark-200">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                      <div className="w-8 h-8 bg-dark-200 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                        {i + 4}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">Player{i + 4}</h4>
                        <p className="text-gray-400 text-sm">{1200 - i * 50} points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{20 - i} games</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Game Modal */}
        <AnimatePresence>
          {showGameModal && selectedGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setShowGameModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-dark-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-video bg-dark-200">
                  <Image
                    src={selectedGame.image}
                    alt={selectedGame.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <FiPlay className="w-16 h-16 text-white mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedGame.title}</h3>
                      <p className="text-gray-300">Game would load here in a real implementation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGameModal(false)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedGame.title}</h2>
                      <p className="text-gray-400">{selectedGame.genre} • {selectedGame.difficulty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{selectedGame.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">{selectedGame.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="text-gray-500">Players:</span>
                      <span className="text-white ml-2">{selectedGame.players}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-white ml-2">{selectedGame.duration}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                      Start Game
                    </button>
                    <button
                      onClick={() => setShowGameModal(false)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}