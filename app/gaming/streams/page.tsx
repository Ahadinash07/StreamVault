'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import {
  FiPlay,
  FiChevronLeft,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiShare,
  FiUser,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiStar,
  FiUsers
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface Stream {
  id: string
  title: string
  description: string
  streamer: {
    id: string
    username: string
    avatar: string
    isVerified: boolean
    followerCount: number
  }
  gameId: string
  gameName: string
  gameIcon: string
  thumbnail: string
  isLive: boolean
  viewerCount: number
  startedAt?: string
  scheduledFor?: string
  duration?: number
  tags: string[]
  category: 'gaming' | 'esports' | 'creative' | 'community'
  quality: '720p' | '1080p' | '4K'
  language: string
  chatEnabled: boolean
  isFollowing: boolean
}

interface StreamCategory {
  id: string
  name: string
  icon: string
  streamCount: number
  viewerCount: number
}

const mockStreams: Stream[] = [
  {
    id: 'stream-1',
    title: 'Movie Trivia Championship - Live Tournament!',
    description: 'Join me for the weekly movie trivia championship! Testing knowledge on classics, blockbusters, and hidden gems.',
    streamer: {
      id: 'streamer-1',
      username: 'TriviaMaster',
      avatar: 'https://picsum.photos/seed/streamer1/100/100',
      isVerified: true,
      followerCount: 15420
    },
    gameId: 'movie-trivia-master',
    gameName: 'Movie Trivia Master',
    gameIcon: '🎬',
    thumbnail: 'https://picsum.photos/seed/stream1/400/225',
    isLive: true,
    viewerCount: 2847,
    startedAt: '2024-01-20T19:30:00Z',
    tags: ['trivia', 'championship', 'movies', 'competition'],
    category: 'esports',
    quality: '1080p',
    language: 'English',
    chatEnabled: true,
    isFollowing: true
  },
  {
    id: 'stream-2',
    title: 'Creative Plot Twisting - Building Stories Together',
    description: 'Let\'s create the most creative and unexpected plot twists! Community participation encouraged.',
    streamer: {
      id: 'streamer-2',
      username: 'StoryWeaver',
      avatar: 'https://picsum.photos/seed/streamer2/100/100',
      isVerified: true,
      followerCount: 8920
    },
    gameId: 'plot-twister',
    gameName: 'Plot Twister',
    gameIcon: '🎭',
    thumbnail: 'https://picsum.photos/seed/stream2/400/225',
    isLive: true,
    viewerCount: 1234,
    startedAt: '2024-01-20T18:15:00Z',
    tags: ['creative', 'storytelling', 'community'],
    category: 'creative',
    quality: '720p',
    language: 'English',
    chatEnabled: true,
    isFollowing: false
  },
  {
    id: 'stream-3',
    title: 'Speedrun Challenge - Can We Beat The Record?',
    description: 'Attempting to break the speedrun record for Binge Watch Challenge. Tips and tricks included!',
    streamer: {
      id: 'streamer-3',
      username: 'SpeedRunner99',
      avatar: 'https://picsum.photos/seed/streamer3/100/100',
      isVerified: false,
      followerCount: 5670
    },
    gameId: 'binge-watch-challenge',
    gameName: 'Binge Watch Challenge',
    gameIcon: '⚡',
    thumbnail: 'https://picsum.photos/seed/stream3/400/225',
    isLive: true,
    viewerCount: 756,
    startedAt: '2024-01-20T20:00:00Z',
    tags: ['speedrun', 'challenge', 'records'],
    category: 'gaming',
    quality: '1080p',
    language: 'English',
    chatEnabled: true,
    isFollowing: true
  },
  {
    id: 'stream-4',
    title: 'Watch Party - Classic Movie Marathon',
    description: 'Join us for a relaxing watch party featuring timeless classics. Chat and discuss!',
    streamer: {
      id: 'streamer-4',
      username: 'MovieNightHost',
      avatar: 'https://picsum.photos/seed/streamer4/100/100',
      isVerified: true,
      followerCount: 12340
    },
    gameId: 'stream-quest',
    gameName: 'Stream Quest',
    gameIcon: '🏆',
    thumbnail: 'https://picsum.photos/seed/stream4/400/225',
    isLive: true,
    viewerCount: 2156,
    startedAt: '2024-01-20T17:00:00Z',
    tags: ['watch-party', 'marathon', 'classics'],
    category: 'community',
    quality: '4K',
    language: 'English',
    chatEnabled: true,
    isFollowing: false
  },
  {
    id: 'stream-5',
    title: 'Esports Tournament - Grand Finals',
    description: 'The moment you\'ve all been waiting for! Grand finals of the monthly esports tournament.',
    streamer: {
      id: 'streamer-5',
      username: 'EsportsOfficial',
      avatar: 'https://picsum.photos/seed/streamer5/100/100',
      isVerified: true,
      followerCount: 45670
    },
    gameId: 'streaming-legends',
    gameName: 'Streaming Legends',
    gameIcon: '🏅',
    thumbnail: 'https://picsum.photos/seed/stream5/400/225',
    isLive: false,
    viewerCount: 0,
    scheduledFor: '2024-01-22T19:00:00Z',
    tags: ['esports', 'tournament', 'finals'],
    category: 'esports',
    quality: '4K',
    language: 'English',
    chatEnabled: true,
    isFollowing: true
  },
  {
    id: 'stream-6',
    title: 'Puzzle Solving - Expert Level Challenges',
    description: 'Taking on the hardest cinematic puzzles. Can we solve them all?',
    streamer: {
      id: 'streamer-6',
      username: 'PuzzlePro',
      avatar: 'https://picsum.photos/seed/streamer6/100/100',
      isVerified: false,
      followerCount: 3450
    },
    gameId: 'cinematic-puzzles',
    gameName: 'Cinematic Puzzles',
    gameIcon: '🧩',
    thumbnail: 'https://picsum.photos/seed/stream6/400/225',
    isLive: true,
    viewerCount: 423,
    startedAt: '2024-01-20T21:30:00Z',
    tags: ['puzzles', 'expert', 'challenging'],
    category: 'gaming',
    quality: '720p',
    language: 'English',
    chatEnabled: true,
    isFollowing: false
  }
]

const mockCategories: StreamCategory[] = [
  { id: 'gaming', name: 'Gaming', icon: '🎮', streamCount: 45, viewerCount: 12500 },
  { id: 'esports', name: 'Esports', icon: '🏆', streamCount: 23, viewerCount: 8900 },
  { id: 'creative', name: 'Creative', icon: '🎨', streamCount: 18, viewerCount: 5600 },
  { id: 'community', name: 'Community', icon: '👥', streamCount: 31, viewerCount: 7800 }
]

export default function GamingStreamsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'all' | 'live' | 'scheduled'>('all')
  const router = useRouter()

  const filteredStreams = mockStreams.filter(stream => {
    const categoryMatch = selectedCategory === 'all' || stream.category === selectedCategory
    const viewModeMatch =
      viewMode === 'all' ||
      (viewMode === 'live' && stream.isLive) ||
      (viewMode === 'scheduled' && !stream.isLive)
    return categoryMatch && viewModeMatch
  })

  const liveStreams = mockStreams.filter(s => s.isLive)
  const totalViewers = liveStreams.reduce((sum, stream) => sum + stream.viewerCount, 0)

  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatDuration = (startedAt: string) => {
    const start = new Date(startedAt)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60))
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  const formatScheduledTime = (scheduledFor: string) => {
    const date = new Date(scheduledFor)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStreamClick = (streamId: string) => {
    router.push(`/gaming/streams/${streamId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <main className="pt-20">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-purple-900/30 to-pink-900/30"></div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <FiPlay className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white">
                  Live Streams
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
              >
                Watch live gaming streams, esports tournaments, creative content, and community events
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-12 text-gray-400 mb-12"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FiPlay className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{liveStreams.length}</div>
                  <div className="text-sm font-semibold">Live Now</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FiEye className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{formatViewerCount(totalViewers)}</div>
                  <div className="text-sm font-semibold">Total Viewers</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FiTrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{mockStreams.length}</div>
                  <div className="text-sm font-semibold">Total Streams</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <Link
                  href="/gaming"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600"
                >
                  <FiChevronLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                  Back to Gaming
                </Link>
                {isAuthenticated && (
                  <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25">
                    <FiPlay className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Go Live
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Categories */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {mockCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className={`group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border p-6 text-center cursor-pointer transition-all duration-500 shadow-2xl hover:shadow-xl ${
                  selectedCategory === category.id
                    ? 'border-red-500/50 shadow-red-500/10 scale-105'
                    : 'border-gray-700/50 hover:border-red-500/30 hover:scale-105'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-300 transition-colors">{category.name}</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <FiPlay className="w-3 h-3" />
                      <span>{category.streamCount} streams</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <FiEye className="w-3 h-3" />
                      <span>{formatViewerCount(category.viewerCount)} viewers</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex justify-center gap-3 mb-12"
          >
            <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
              {[
                { id: 'all', label: 'All Streams', icon: FiTrendingUp },
                { id: 'live', label: 'Live Now', icon: FiPlay },
                { id: 'scheduled', label: 'Scheduled', icon: FiCalendar }
              ].map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(option.id as 'all' | 'live' | 'scheduled')}
                  className={`group relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    viewMode === option.id
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <option.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    viewMode === option.id ? 'text-white' : 'text-gray-400'
                  }`} />
                  <span className="text-sm uppercase tracking-wider">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Streams Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStreams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                onClick={() => handleStreamClick(stream.id)}
                className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-500 shadow-2xl hover:shadow-red-500/10 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <Image
                      src={stream.thumbnail}
                      alt={stream.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    <div className="absolute top-4 left-4">
                      {stream.isLive ? (
                        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="font-bold">LIVE</span>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-gray-600 to-gray-500 text-white text-xs px-3 py-2 rounded-full shadow-lg backdrop-blur-sm">
                          <span className="font-bold">SCHEDULED</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full border border-gray-600/50">
                        {stream.quality}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
                        <FiEye className="w-4 h-4" />
                        <span className="font-semibold">{formatViewerCount(stream.viewerCount)}</span>
                      </div>
                    </div>

                    {stream.isLive && stream.startedAt && (
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full border border-gray-600/50">
                          {formatDuration(stream.startedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Image
                        src={stream.streamer.avatar}
                        alt={stream.streamer.username}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-gray-600 shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg line-clamp-2 mb-2 group-hover:text-red-300 transition-colors duration-300 leading-tight">
                          {stream.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm font-semibold">{stream.streamer.username}</span>
                          {stream.streamer.isVerified && (
                            <FiStar className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {stream.description}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-lg">{stream.gameIcon}</span>
                      </div>
                      <span className="text-gray-200 text-sm font-semibold">{stream.gameName}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {stream.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full border border-gray-600/50">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {!stream.isLive && stream.scheduledFor && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-gray-800/30 px-3 py-2 rounded-xl">
                        <FiCalendar className="w-4 h-4" />
                        <span>Scheduled for {formatScheduledTime(stream.scheduledFor)}</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 flex items-center justify-center gap-2">
                        <FiPlay className="w-4 h-4" />
                        <span>{stream.isLive ? 'Watch Live' : 'Set Reminder'}</span>
                      </button>
                      <button className={`p-3 rounded-2xl transition-all duration-300 shadow-lg ${
                        stream.isFollowing
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-red-500/25'
                          : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 border border-gray-600/50'
                      }`}>
                        <FiHeart className={`w-5 h-5 ${stream.isFollowing ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredStreams.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
                <FiPlay className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No streams found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Try adjusting your filters or check back later for new live streams.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setViewMode('all');
                }}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25"
              >
                View All Streams
              </button>
            </motion.div>
          )}

          {/* Enhanced Stream Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="grid md:grid-cols-4 gap-8 mt-20"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-pink-900/10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiPlay className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{liveStreams.length}</div>
                <div className="text-gray-400 font-semibold">Live Streams</div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-cyan-900/10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiEye className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{formatViewerCount(totalViewers)}</div>
                <div className="text-gray-400 font-semibold">Total Viewers</div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-emerald-900/10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiUsers className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {mockStreams.reduce((sum, s) => sum + s.streamer.followerCount, 0).toLocaleString()}
                </div>
                <div className="text-gray-400 font-semibold">Streamer Followers</div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiTrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{mockCategories.length}</div>
                <div className="text-gray-400 font-semibold">Categories</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}