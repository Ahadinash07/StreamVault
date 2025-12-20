'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import {
  FiUser,
  FiChevronLeft,
  FiAward,
  FiTarget,
  FiClock,
  FiStar,
  FiTrendingUp,
  FiCalendar,
  FiEdit,
  FiSettings,
  FiShare,
  FiHeart,
  FiZap,
  FiPlay
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface UserStats {
  level: number
  xp: number
  xpToNext: number
  totalGamesPlayed: number
  totalPlayTime: number
  winRate: number
  currentStreak: number
  bestStreak: number
  achievementsUnlocked: number
  totalAchievements: number
  rank: number
  totalPlayers: number
  coins: number
  badges: string[]
}

interface RecentActivity {
  id: string
  type: 'game' | 'achievement' | 'tournament' | 'challenge'
  title: string
  description: string
  timestamp: string
  gameId?: string
  gameName?: string
  points?: number
  icon: string
}

interface FavoriteGame {
  id: string
  gameId: string
  gameName: string
  gameIcon: string
  lastPlayed: string
  playTime: number
  highScore: number
  achievements: number
}

const mockUserStats: UserStats = {
  level: 42,
  xp: 8750,
  xpToNext: 1250,
  totalGamesPlayed: 234,
  totalPlayTime: 156, // hours
  winRate: 78.5,
  currentStreak: 12,
  bestStreak: 25,
  achievementsUnlocked: 67,
  totalAchievements: 120,
  rank: 156,
  totalPlayers: 15420,
  coins: 4520,
  badges: ['Champion', 'Speedster', 'Strategist', 'Community Hero']
}

const mockRecentActivity: RecentActivity[] = [
  {
    id: 'activity-1',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    description: 'Earned "Trivia Master" badge',
    timestamp: '2024-01-20T15:30:00Z',
    points: 100,
    icon: '🏆'
  },
  {
    id: 'activity-2',
    type: 'game',
    title: 'High Score!',
    description: 'New personal best in Movie Trivia Master',
    timestamp: '2024-01-20T14:45:00Z',
    gameId: 'movie-trivia-master',
    gameName: 'Movie Trivia Master',
    points: 2500,
    icon: '🎬'
  },
  {
    id: 'activity-3',
    type: 'tournament',
    title: 'Tournament Win!',
    description: '1st place in Weekly Trivia Championship',
    timestamp: '2024-01-19T20:15:00Z',
    points: 500,
    icon: '🥇'
  },
  {
    id: 'activity-4',
    type: 'challenge',
    title: 'Challenge Completed',
    description: 'Daily Speed Demon challenge finished',
    timestamp: '2024-01-19T12:30:00Z',
    points: 50,
    icon: '⚡'
  },
  {
    id: 'activity-5',
    type: 'achievement',
    title: 'Level Up!',
    description: 'Reached level 42',
    timestamp: '2024-01-18T16:20:00Z',
    points: 200,
    icon: '⬆️'
  }
]

const mockFavoriteGames: FavoriteGame[] = [
  {
    id: 'fav-1',
    gameId: 'movie-trivia-master',
    gameName: 'Movie Trivia Master',
    gameIcon: '🎬',
    lastPlayed: '2024-01-20T15:30:00Z',
    playTime: 45,
    highScore: 9850,
    achievements: 8
  },
  {
    id: 'fav-2',
    gameId: 'plot-twister',
    gameName: 'Plot Twister',
    gameIcon: '🎭',
    lastPlayed: '2024-01-19T18:45:00Z',
    playTime: 32,
    highScore: 8750,
    achievements: 6
  },
  {
    id: 'fav-3',
    gameId: 'stream-quest',
    gameName: 'Stream Quest',
    gameIcon: '🏆',
    lastPlayed: '2024-01-18T20:15:00Z',
    playTime: 28,
    highScore: 12400,
    achievements: 5
  }
]

export default function GamingProfilePage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'achievements' | 'favorites'>('overview')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <FiUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-8">Please sign in to view your gaming profile</p>
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

  const formatPlayTime = (hours: number) => {
    return `${hours}h`
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getActivityColor = (type: string) => {
    const colors = {
      game: 'text-blue-400',
      achievement: 'text-yellow-400',
      tournament: 'text-green-400',
      challenge: 'text-purple-400'
    }
    return colors[type as keyof typeof colors] || colors.game
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Profile Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  <Image
                    src="https://picsum.photos/seed/profile/150/150"
                    alt="Profile"
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-purple-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                    Lv. {mockUserStats.level}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{user?.name || 'Gaming Pro'}</h1>
                    <div className="flex gap-2">
                      <button className="bg-dark-100 hover:bg-dark-200 text-gray-300 p-2 rounded-lg transition-colors">
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button className="bg-dark-100 hover:bg-dark-200 text-gray-300 p-2 rounded-lg transition-colors">
                        <FiSettings className="w-5 h-5" />
                      </button>
                      <button className="bg-dark-100 hover:bg-dark-200 text-gray-300 p-2 rounded-lg transition-colors">
                        <FiShare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                    {mockUserStats.badges.map(badge => (
                      <span key={badge} className="bg-yellow-600/20 text-yellow-400 text-sm px-3 py-1 rounded-full border border-yellow-500/30">
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">#{mockUserStats.rank}</div>
                      <div className="text-gray-400 text-sm">Global Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{mockUserStats.coins.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">Coins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{mockUserStats.achievementsUnlocked}</div>
                      <div className="text-gray-400 text-sm">Achievements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{mockUserStats.winRate}%</div>
                      <div className="text-gray-400 text-sm">Win Rate</div>
                    </div>
                  </div>

                  {/* XP Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Level {mockUserStats.level}</span>
                      <span>{mockUserStats.xp}/{mockUserStats.xp + mockUserStats.xpToNext} XP</span>
                    </div>
                    <div className="w-full bg-dark-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${(mockUserStats.xp / (mockUserStats.xp + mockUserStats.xpToNext)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <Link
                      href="/gaming"
                      className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <FiChevronLeft className="w-5 h-5 mr-2" />
                      Back to Gaming
                    </Link>
                    <Link
                      href="/gaming/achievements"
                      className="inline-flex items-center px-6 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-colors"
                    >
                      <FiAward className="w-5 h-5 mr-2" />
                      View Achievements
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <div className="flex bg-dark-100 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: FiUser },
                { id: 'activity', label: 'Activity', icon: FiClock },
                { id: 'achievements', label: 'Achievements', icon: FiAward },
                { id: 'favorites', label: 'Favorites', icon: FiHeart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-dark-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiTarget className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Gaming Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Games Played</span>
                    <span className="text-white">{mockUserStats.totalGamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Play Time</span>
                    <span className="text-white">{formatPlayTime(mockUserStats.totalPlayTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-white">{mockUserStats.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-white">{mockUserStats.currentStreak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Streak</span>
                    <span className="text-white">{mockUserStats.bestStreak}</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiAward className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Achievements</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unlocked</span>
                    <span className="text-white">{mockUserStats.achievementsUnlocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total</span>
                    <span className="text-white">{mockUserStats.totalAchievements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Completion</span>
                    <span className="text-white">
                      {Math.round((mockUserStats.achievementsUnlocked / mockUserStats.totalAchievements) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-dark-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${(mockUserStats.achievementsUnlocked / mockUserStats.totalAchievements) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-dark-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Ranking</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Global Rank</span>
                    <span className="text-white">#{mockUserStats.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Players</span>
                    <span className="text-white">{mockUserStats.totalPlayers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Percentile</span>
                    <span className="text-white">
                      {Math.round((1 - mockUserStats.rank / mockUserStats.totalPlayers) * 100)}th
                    </span>
                  </div>
                </div>
              </div>

              {/* Favorite Games Preview */}
              <div className="md:col-span-2 lg:col-span-3">
                <div className="bg-dark-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Favorite Games</h3>
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockFavoriteGames.slice(0, 3).map((game) => (
                      <div key={game.id} className="flex items-center gap-3 p-3 bg-dark-200 rounded-lg">
                        <span className="text-2xl">{game.gameIcon}</span>
                        <div>
                          <div className="text-white font-semibold">{game.gameName}</div>
                          <div className="text-gray-400 text-sm">
                            {formatPlayTime(game.playTime)} • High Score: {game.highScore.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-100 rounded-lg p-6 border border-dark-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-2xl ${getActivityColor(activity.type)}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{activity.title}</h3>
                        {activity.points && (
                          <span className="text-yellow-400 text-sm">+{activity.points} XP</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{activity.description}</p>
                      {activity.gameName && (
                        <div className="text-purple-400 text-sm mb-2">{activity.gameName}</div>
                      )}
                      <div className="text-gray-500 text-xs">{formatTimeAgo(activity.timestamp)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="text-center py-16">
              <FiAward className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Achievements Section</h3>
              <p className="text-gray-500 mb-4">View detailed achievements</p>
              <Link
                href="/gaming/achievements"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View All Achievements
              </Link>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFavoriteGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-100 rounded-lg p-6 border border-dark-200 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{game.gameIcon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{game.gameName}</h3>
                      <div className="text-gray-400 text-sm">Last played {formatTimeAgo(game.lastPlayed)}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Play Time</span>
                      <span className="text-white">{formatPlayTime(game.playTime)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">High Score</span>
                      <span className="text-yellow-400">{game.highScore.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Achievements</span>
                      <span className="text-white">{game.achievements}</span>
                    </div>
                  </div>

                  <Link
                    href={`/gaming/${game.gameId}`}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPlay className="w-4 h-4" />
                    Play Now
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}