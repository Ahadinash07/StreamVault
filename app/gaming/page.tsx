'use client'

import { useState, useEffect, useMemo } from 'react'
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
  FiFilter,
  FiSearch,
  FiGrid,
  FiList,
  FiShoppingCart,
  FiMessageSquare,
  FiUser
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { addNotification } from '@/app/features/notifications/notificationsSlice'
import {
  setActiveTab,
  setFilters,
  setSearchQuery,
  startGameSession,
  toggleFavorite,
  rateGame,
  setLoading
} from '@/app/features/gaming/gamingSlice'

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
  },
  {
    id: 'game-5',
    title: 'Cinematic Puzzles',
    description: 'Solve intricate puzzles inspired by famous movie plots and scenes',
    genre: 'Puzzle',
    rating: 8.9,
    players: '1-2 Players',
    duration: '25-45 min',
    difficulty: 'Medium',
    image: 'https://picsum.photos/seed/game5/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    featured: true,
    new: false,
    tags: ['Puzzle', 'Brain Teaser', 'Movie-themed']
  },
  {
    id: 'game-6',
    title: 'Streaming Legends',
    description: 'Build your streaming empire and compete with other content creators',
    genre: 'Strategy',
    rating: 9.1,
    players: '1-8 Players',
    duration: '60-120 min',
    difficulty: 'Hard',
    image: 'https://picsum.photos/seed/game6/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    featured: false,
    new: true,
    tags: ['Strategy', 'Business', 'Multiplayer']
  },
  {
    id: 'game-7',
    title: 'Genre Blender',
    description: 'Mix and match movie genres to create hilarious and unexpected combinations',
    genre: 'Card Game',
    rating: 8.7,
    players: '3-6 Players',
    duration: '20-35 min',
    difficulty: 'Easy',
    image: 'https://picsum.photos/seed/game7/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    featured: false,
    new: false,
    tags: ['Card Game', 'Party', 'Creative']
  },
  {
    id: 'game-8',
    title: 'Plot Twister',
    description: 'Rewrite famous movie plots with unexpected twists and endings',
    genre: 'Creative',
    rating: 9.3,
    players: '2-4 Players',
    duration: '40-70 min',
    difficulty: 'Medium',
    image: 'https://picsum.photos/seed/game8/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    featured: true,
    new: true,
    tags: ['Creative', 'Writing', 'Co-op']
  },
  {
    id: 'game-9',
    title: 'Oscar Night',
    description: 'Host your own virtual Oscars and vote on the best movie moments',
    genre: 'Party',
    rating: 8.4,
    players: '4-12 Players',
    duration: '45-90 min',
    difficulty: 'Easy',
    image: 'https://picsum.photos/seed/game9/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    featured: false,
    new: false,
    tags: ['Party', 'Voting', 'Celebration']
  },
  {
    id: 'game-10',
    title: 'Script Doctor',
    description: 'Diagnose and fix plot holes in famous movie scripts',
    genre: 'Puzzle',
    rating: 8.6,
    players: '1-4 Players',
    duration: '30-50 min',
    difficulty: 'Medium',
    image: 'https://picsum.photos/seed/game10/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    featured: false,
    new: false,
    tags: ['Puzzle', 'Educational', 'Analysis']
  },
  {
    id: 'game-11',
    title: 'Stream Wars',
    description: 'Epic battles between streaming platforms in a sci-fi universe',
    genre: 'Strategy',
    rating: 9.4,
    players: '2-6 Players',
    duration: '90-150 min',
    difficulty: 'Hard',
    image: 'https://picsum.photos/seed/game11/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    featured: true,
    new: true,
    tags: ['Strategy', 'Sci-Fi', 'Competitive']
  },
  {
    id: 'game-12',
    title: 'Memory Reel',
    description: 'Test your memory with movie scenes, quotes, and character names',
    genre: 'Memory',
    rating: 8.3,
    players: '2-8 Players',
    duration: '15-25 min',
    difficulty: 'Easy',
    image: 'https://picsum.photos/seed/game12/400/300',
    trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    featured: false,
    new: false,
    tags: ['Memory', 'Quick Play', 'Educational']
  }
]

export default function GamingPage() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const {
    games,
    userGameStats,
    leaderboard,
    activeTab,
    filters,
    searchQuery,
    loading
  } = useAppSelector((state) => state.gaming)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showGameModal, setShowGameModal] = useState(false)

  // Use Redux games if available, otherwise use mock data
  const gamesData = games.length > 0 ? games : mockGames

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGenre = filters.genre === 'all' || game.genre.toLowerCase() === filters.genre.toLowerCase()
      const matchesDifficulty = filters.difficulty === 'all' || game.difficulty === filters.difficulty

      return matchesSearch && matchesGenre && matchesDifficulty
    })

    // Sort games
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'duration':
        filtered.sort((a, b) => {
          const aDuration = parseInt(a.duration.split('-')[0])
          const bDuration = parseInt(b.duration.split('-')[0])
          return aDuration - bDuration
        })
        break
      default:
        break
    }

    return filtered
  }, [gamesData, searchQuery, filters, activeTab])

  const handlePlayGame = (game: Game) => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to play games',
        timestamp: new Date().toISOString(),
        isRead: false
      }))
      return
    }

    // Start game session
    dispatch(startGameSession({ gameId: game.id }))

    // Navigate to game page
    window.location.href = `/gaming/${game.id}`
  }

  const handleFavoriteToggle = (gameId: string) => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to add favorites',
        timestamp: new Date().toISOString(),
        isRead: false
      }))
      return
    }

    dispatch(toggleFavorite(gameId))
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Favorite Updated',
      message: 'Game added to favorites',
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const handleRateGame = (gameId: string, rating: number) => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to rate games',
        timestamp: new Date().toISOString(),
        isRead: false
      }))
      return
    }

    dispatch(rateGame({ gameId, rating }))
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Rating Submitted',
      message: `You rated this game ${rating} stars`,
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const getUserGameStats = (gameId: string) => {
    return userGameStats.find(stats => stats.gameId === gameId)
  }

  const tabs = [
    { id: 'games', label: 'Games', icon: FiPlay },
    { id: 'leaderboard', label: 'Leaderboard', icon: FiAward },
    { id: 'tournaments', label: 'Tournaments', icon: FiTarget },
    { id: 'library', label: 'My Library', icon: FiUsers },
    { id: 'news', label: 'News', icon: FiTrendingUp },
    { id: 'streams', label: 'Streams', icon: FiPlay },
    { id: 'community', label: 'Community', icon: FiMessageSquare },
    { id: 'achievements', label: 'Achievements', icon: FiAward },
    { id: 'challenges', label: 'Challenges', icon: FiTarget },
    { id: 'store', label: 'Store', icon: FiShoppingCart },
    { id: 'profile', label: 'Profile', icon: FiUser }
  ]

  const genres = ['all', 'Adventure', 'Trivia', 'Creative', 'Puzzle', 'Action', 'Party', 'Strategy']
  const difficulties = ['all', 'Easy', 'Medium', 'Hard']
  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'duration', label: 'Shortest First' }
  ]

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
                  Aurora Gaming
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Play interactive games designed for movie lovers and streamers
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{gamesData.length}</div>
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
                <button
                  onClick={() => dispatch(setActiveTab('games'))}
                  className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <FiPlay className="w-5 h-5 mr-2" />
                  Browse Games
                </button>
                <button
                  onClick={() => dispatch(setActiveTab('leaderboard'))}
                  className="inline-flex items-center px-8 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold rounded-lg transition-colors"
                >
                  <FiAward className="w-5 h-5 mr-2" />
                  View Leaderboard
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <div className="bg-dark-100 rounded-lg p-1 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setActiveTab(tab.id))}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Games Tab */}
          {activeTab === 'games' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-gray-300 hover:bg-dark-200 transition-colors"
                  >
                    <FiFilter className="w-5 h-5" />
                  </button>
                  <div className="flex bg-dark-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                    >
                      <FiGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                    >
                      <FiList className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-dark-100 rounded-lg p-6 space-y-4"
                    >
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* Genre Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                          <select
                            value={filters.genre}
                            onChange={(e) => dispatch(setFilters({ genre: e.target.value }))}
                            className="w-full px-3 py-2 bg-dark-200 border border-dark-300 rounded-md text-white focus:outline-none focus:border-purple-500"
                          >
                            {genres.map((genre) => (
                              <option key={genre} value={genre}>
                                {genre === 'all' ? 'All Genres' : genre}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                          <select
                            value={filters.difficulty}
                            onChange={(e) => dispatch(setFilters({ difficulty: e.target.value }))}
                            className="w-full px-3 py-2 bg-dark-200 border border-dark-300 rounded-md text-white focus:outline-none focus:border-purple-500"
                          >
                            {difficulties.map((difficulty) => (
                              <option key={difficulty} value={difficulty}>
                                {difficulty === 'all' ? 'All Difficulties' : difficulty}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Sort Options */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                          <select
                            value={filters.sortBy}
                            onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
                            className="w-full px-3 py-2 bg-dark-200 border border-dark-300 rounded-md text-white focus:outline-none focus:border-purple-500"
                          >
                            {sortOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Games Grid/List */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading games...</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className={viewMode === 'grid'
                    ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                  }
                >
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={viewMode === 'grid'
                        ? "bg-dark-100 rounded-lg border border-dark-200 overflow-hidden hover:border-purple-500 transition-colors group"
                        : "bg-dark-100 rounded-lg border border-dark-200 p-4 hover:border-purple-500 transition-colors group"
                      }
                    >
                      {viewMode === 'grid' ? (
                        <>
                          {/* Grid View */}
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={game.image}
                              alt={game.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {game.new && (
                              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                NEW
                              </div>
                            )}
                            {game.featured && (
                              <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                                FEATURED
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                                {game.title}
                              </h3>
                              <div className="flex items-center gap-1">
                                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-300">{game.rating}</span>
                              </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                              {game.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <FiUsers className="w-3 h-3" />
                                {game.players}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {game.duration}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                                {game.difficulty}
                              </span>
                              <span className="text-xs text-gray-500 bg-dark-200 px-2 py-1 rounded">
                                {game.genre}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePlayGame(game)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded transition-colors"
                              >
                                <FiPlay className="w-4 h-4 mr-1" />
                                Play Now
                              </button>
                              <button
                                onClick={() => handleFavoriteToggle(game.id)}
                                className={`p-2 rounded transition-colors ${
                                  getUserGameStats(game.id)?.favorite
                                    ? 'bg-red-600 text-white'
                                    : 'bg-dark-200 text-gray-400 hover:text-red-400'
                                }`}
                              >
                                <FiHeart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* List View */}
                          <div className="flex gap-4">
                            <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded">
                              <Image
                                src={game.image}
                                alt={game.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="text-lg font-bold text-white truncate">
                                  {game.title}
                                </h3>
                                <div className="flex items-center gap-1 ml-2">
                                  <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-300">{game.rating}</span>
                                </div>
                              </div>

                              <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                                {game.description}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <span>{game.genre}</span>
                                <span className="flex items-center gap-1">
                                  <FiUsers className="w-3 h-3" />
                                  {game.players}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {game.duration}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                                  {game.difficulty}
                                </span>
                                <div className="flex gap-1 ml-auto">
                                  <button
                                    onClick={() => handlePlayGame(game)}
                                    className="inline-flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded transition-colors"
                                  >
                                    <FiPlay className="w-3 h-3 mr-1" />
                                    Play
                                  </button>
                                  <button
                                    onClick={() => handleFavoriteToggle(game.id)}
                                    className={`p-1 rounded transition-colors ${
                                      getUserGameStats(game.id)?.favorite
                                        ? 'bg-red-600 text-white'
                                        : 'bg-dark-200 text-gray-400 hover:text-red-400'
                                    }`}
                                  >
                                    <FiHeart className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {filteredGames.length === 0 && !loading && (
                <div className="text-center py-16">
                  <FiPlay className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No games found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Leaderboard Tab */}
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
                {leaderboard.slice(0, 3).map((player, index) => (
                  <div key={player.id} className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {player.username}
                    </h3>
                    <p className="text-yellow-400 font-semibold">
                      {player.score} points
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {player.gamesPlayed} games played
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
                  {leaderboard.map((player, index) => (
                    <div key={player.id} className="p-4 flex items-center gap-4">
                      <div className="w-8 h-8 bg-dark-200 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{player.username}</h4>
                        <p className="text-gray-400 text-sm">{player.score} points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{player.gamesPlayed} games</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tournaments Tab */}
          {activeTab === 'tournaments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">🏆 Tournaments</h2>
                <p className="text-gray-400">Compete in exciting gaming tournaments</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tournament Cards */}
                <div className="bg-dark-100 rounded-lg border border-dark-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiTarget className="w-8 h-8 text-purple-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Winter Championship</h3>
                      <p className="text-gray-400 text-sm">Stream Quest Tournament</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="text-yellow-400 font-semibold">$5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Participants:</span>
                      <span className="text-white">42/64</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Entry Fee:</span>
                      <span className="text-white">$50</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                      Join Tournament
                    </button>
                    <button className="px-4 py-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white rounded transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">📚 My Gaming Library</h2>
                <p className="text-gray-400">Your gaming history and favorites</p>
              </div>

              {userGameStats.length === 0 ? (
                <div className="text-center py-16">
                  <FiUsers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No games played yet</h3>
                  <p className="text-gray-500">Start playing games to build your library</p>
                  <button
                    onClick={() => dispatch(setActiveTab('games'))}
                    className="mt-4 inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <FiPlay className="w-5 h-5 mr-2" />
                    Browse Games
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userGameStats.map((stats) => {
                    const game = gamesData.find(g => g.id === stats.gameId)
                    if (!game) return null

                    return (
                      <div key={stats.gameId} className="bg-dark-100 rounded-lg border border-dark-200 p-4">
                        <div className="flex gap-3 mb-3">
                          <Image
                            src={game.image}
                            alt={game.title}
                            width={60}
                            height={45}
                            className="rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{game.title}</h3>
                            <p className="text-gray-400 text-sm">{game.genre}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Play Time:</span>
                            <span className="text-white">{Math.round(stats.totalPlayTime / 60000)} min</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Sessions:</span>
                            <span className="text-white">{stats.sessionsPlayed}</span>
                          </div>
                          {stats.bestScore && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Best Score:</span>
                              <span className="text-yellow-400">{stats.bestScore}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePlayGame(game)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-3 rounded transition-colors"
                          >
                            Play Again
                          </button>
                          <button
                            onClick={() => handleFavoriteToggle(stats.gameId)}
                            className={`p-2 rounded transition-colors ${
                              stats.favorite ? 'bg-red-600 text-white' : 'bg-dark-200 text-gray-400'
                            }`}
                          >
                            <FiHeart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">📰 Gaming News</h2>
                <p className="text-gray-400">Latest updates and announcements</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-dark-100 rounded-lg border border-dark-200 overflow-hidden hover:border-purple-500/50 transition-colors">
                    <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <FiTrendingUp className="w-12 h-12 text-purple-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">Gaming Update #{item}</h3>
                      <p className="text-gray-400 text-sm mb-3">Exciting new features and improvements coming to Aurora Play gaming.</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>2 hours ago</span>
                        <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">News</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Streams Tab */}
          {activeTab === 'streams' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">🎥 Live Streams</h2>
                <p className="text-gray-400">Watch gamers play live</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((stream) => (
                  <div key={stream} className="bg-dark-100 rounded-lg border border-dark-200 overflow-hidden hover:border-purple-500/50 transition-colors">
                    <div className="aspect-video bg-gradient-to-br from-red-600/20 to-pink-600/20 flex items-center justify-center relative">
                      <FiPlay className="w-12 h-12 text-red-400" />
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">Stream #{stream}</h3>
                      <p className="text-gray-400 text-sm mb-3">Watch this amazing gaming session live on Aurora Play.</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>1.2K viewers</span>
                        <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded">Live</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">👥 Community Hub</h2>
                <p className="text-gray-400 mb-8">Join discussions, share strategies, and connect with fellow gamers</p>

                <Link
                  href="/gaming/community"
                  className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  <FiMessageSquare className="w-6 h-6 mr-3" />
                  Enter Community
                </Link>
              </div>

              {/* Quick Community Stats */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-dark-100 rounded-lg border border-dark-200 p-6 text-center">
                  <FiUsers className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">12,847</h3>
                  <p className="text-gray-400">Active Members</p>
                </div>

                <div className="bg-dark-100 rounded-lg border border-dark-200 p-6 text-center">
                  <FiMessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">3,421</h3>
                  <p className="text-gray-400">Discussions</p>
                </div>

                <div className="bg-dark-100 rounded-lg border border-dark-200 p-6 text-center">
                  <FiTrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">89</h3>
                  <p className="text-gray-400">Posts Today</p>
                </div>
              </div>

              {/* Recent Activity Preview */}
              <div className="bg-dark-100 rounded-lg border border-dark-200 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((activity) => (
                    <div key={activity} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">
                          <span className="font-semibold">Gamer{activity}</span> shared a new strategy guide
                        </p>
                        <p className="text-gray-400 text-sm">{activity * 5} minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/gaming/community"
                    className="inline-flex items-center px-6 py-3 bg-dark-200 hover:bg-dark-300 text-gray-300 hover:text-white rounded-lg transition-colors"
                  >
                    View All Activity
                    <FiChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">🏆 Achievements</h2>
                <p className="text-gray-400 mb-8">Unlock achievements and showcase your gaming skills</p>

                <Link
                  href="/gaming/achievements"
                  className="inline-flex items-center px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  <FiAward className="w-6 h-6 mr-3" />
                  View Achievements
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((achievement) => (
                  <div key={achievement} className="bg-dark-100 rounded-lg border border-dark-200 p-4 text-center hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiAward className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Achievement #{achievement}</h3>
                    <p className="text-gray-400 text-sm">Complete challenges to unlock this achievement.</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">🎯 Challenges</h2>
                <p className="text-gray-400 mb-8">Take on exciting gaming challenges and earn rewards</p>

                <Link
                  href="/gaming/challenges"
                  className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  <FiTarget className="w-6 h-6 mr-3" />
                  View Challenges
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((challenge) => (
                  <div key={challenge} className="bg-dark-100 rounded-lg border border-dark-200 p-6 hover:border-orange-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTarget className="w-8 h-8 text-orange-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Challenge #{challenge}</h3>
                        <p className="text-gray-400">Daily Challenge</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">Complete this challenge to earn rewards and climb the leaderboard.</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">Progress: 0/10</span>
                      <span className="text-sm text-orange-400 font-semibold">50 XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Store Tab */}
          {activeTab === 'store' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">🛒 Gaming Store</h2>
                <p className="text-gray-400 mb-8">Purchase games, items, and exclusive content</p>

                <Link
                  href="/gaming/store"
                  className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  <FiShoppingCart className="w-6 h-6 mr-3" />
                  Browse Store
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-dark-100 rounded-lg border border-dark-200 overflow-hidden hover:border-green-500/50 transition-colors">
                    <div className="aspect-square bg-gradient-to-br from-green-600/20 to-blue-600/20 flex items-center justify-center">
                      <FiShoppingCart className="w-12 h-12 text-green-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">Store Item #{item}</h3>
                      <p className="text-gray-400 text-sm mb-3">Exclusive gaming content and items.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 font-bold">$9.99</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">👤 Gaming Profile</h2>
                <p className="text-gray-400 mb-8">Manage your gaming profile and view your statistics</p>

                <Link
                  href="/gaming/profile"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  <FiUser className="w-6 h-6 mr-3" />
                  View Profile
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-dark-100 rounded-lg border border-dark-200 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Your Profile</h3>
                      <p className="text-gray-400">Level 15 Gamer</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Games Played:</span>
                      <span className="text-white">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Score:</span>
                      <span className="text-yellow-400">15,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Achievements:</span>
                      <span className="text-blue-400">8/25</span>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-100 rounded-lg border border-dark-200 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((activity) => (
                      <div key={activity} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <FiPlay className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm">Played Game #{activity}</p>
                          <p className="text-gray-400 text-xs">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-100 rounded-lg border border-dark-200 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/gaming/profile" className="block w-full text-left p-2 rounded hover:bg-dark-200 text-gray-300 hover:text-white transition-colors">
                      Edit Profile
                    </Link>
                    <Link href="/gaming/library" className="block w-full text-left p-2 rounded hover:bg-dark-200 text-gray-300 hover:text-white transition-colors">
                      My Library
                    </Link>
                    <Link href="/gaming/achievements" className="block w-full text-left p-2 rounded hover:bg-dark-200 text-gray-300 hover:text-white transition-colors">
                      Achievements
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
