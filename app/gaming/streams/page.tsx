'use client'

import { useState } from 'react'
import Link from 'next/link'
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-900/20 via-purple-900/20 to-pink-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiPlay className="w-12 h-12 text-red-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Live Streams
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Watch live gaming streams, esports tournaments, and community events
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{liveStreams.length}</div>
                  <div className="text-sm">Live Now</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{formatViewerCount(totalViewers)}</div>
                  <div className="text-sm">Total Viewers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockStreams.length}</div>
                  <div className="text-sm">Total Streams</div>
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
                {isAuthenticated && (
                  <button className="inline-flex items-center px-8 py-3 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black font-semibold rounded-lg transition-colors">
                    <FiPlay className="w-5 h-5 mr-2" />
                    Go Live
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {mockCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                className="bg-dark-100 rounded-lg p-4 text-center border border-dark-200 hover:border-purple-500/30 transition-colors cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="text-white font-semibold mb-1">{category.name}</h3>
                <div className="text-sm text-gray-400">
                  {category.streamCount} streams • {formatViewerCount(category.viewerCount)} viewers
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex bg-dark-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'All Streams' },
                { id: 'live', label: 'Live Now' },
                { id: 'scheduled', label: 'Scheduled' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setViewMode(option.id as any)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === option.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Streams Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-100 rounded-lg overflow-hidden border border-dark-200 hover:border-purple-500/30 transition-colors"
              >
                <div className="relative">
                  <Image
                    src={stream.thumbnail}
                    alt={stream.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {stream.isLive ? (
                      <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                        SCHEDULED
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {stream.quality}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <FiEye className="w-4 h-4" />
                      <span>{formatViewerCount(stream.viewerCount)}</span>
                    </div>
                  </div>
                  {stream.isLive && stream.startedAt && (
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(stream.startedAt)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Image
                      src={stream.streamer.avatar}
                      alt={stream.streamer.username}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-dark-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold line-clamp-2 mb-1">{stream.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">{stream.streamer.username}</span>
                        {stream.streamer.isVerified && (
                          <FiStar className="w-3 h-3 text-yellow-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{stream.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{stream.gameIcon}</span>
                    <span className="text-gray-300 text-sm">{stream.gameName}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {stream.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-dark-200 text-gray-400 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {!stream.isLive && stream.scheduledFor && (
                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                      <FiCalendar className="w-4 h-4" />
                      <span>Scheduled for {formatScheduledTime(stream.scheduledFor)}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <FiPlay className="w-4 h-4" />
                      {stream.isLive ? 'Watch Live' : 'Set Reminder'}
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      stream.isFollowing
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-dark-200 hover:bg-dark-300 text-gray-400'
                    }`}>
                      <FiHeart className={`w-5 h-5 ${stream.isFollowing ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredStreams.length === 0 && (
            <div className="text-center py-16">
              <FiPlay className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No streams found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later</p>
            </div>
          )}

          {/* Stream Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiPlay className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{liveStreams.length}</div>
              <div className="text-gray-400">Live Streams</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiEye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{formatViewerCount(totalViewers)}</div>
              <div className="text-gray-400">Total Viewers</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiUsers className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockStreams.reduce((sum, s) => sum + s.streamer.followerCount, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Streamer Followers</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiTrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{mockCategories.length}</div>
              <div className="text-gray-400">Categories</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}