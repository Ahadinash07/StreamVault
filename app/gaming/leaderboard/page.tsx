'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiStar,
  FiTarget,
  FiZap,
  FiChevronLeft,
  FiTrendingDown
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  score: number
  gamesPlayed: number
  winRate: number
  level: number
  badges: string[]
  trend: 'up' | 'down' | 'same'
  change: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-1',
    username: 'GameMaster2024',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    score: 15420,
    gamesPlayed: 247,
    winRate: 89.5,
    level: 45,
    badges: ['Champion', 'Speedster', 'Strategist'],
    trend: 'up',
    change: 2
  },
  {
    rank: 2,
    userId: 'user-2',
    username: 'CineGamer',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    score: 14850,
    gamesPlayed: 223,
    winRate: 87.2,
    level: 42,
    badges: ['Puzzle Master', 'Trivia King'],
    trend: 'down',
    change: 1
  },
  {
    rank: 3,
    userId: 'user-3',
    username: 'StreamQueen',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    score: 14200,
    gamesPlayed: 198,
    winRate: 91.3,
    level: 41,
    badges: ['Social Player', 'Quick Thinker'],
    trend: 'up',
    change: 1
  },
  {
    rank: 4,
    userId: 'user-4',
    username: 'MovieBuff99',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    score: 13890,
    gamesPlayed: 234,
    winRate: 85.6,
    level: 39,
    badges: ['Trivia Expert', 'Memory Master'],
    trend: 'same',
    change: 0
  },
  {
    rank: 5,
    userId: 'user-5',
    username: 'PlotTwister',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    score: 13500,
    gamesPlayed: 189,
    winRate: 88.9,
    level: 38,
    badges: ['Creative Mind', 'Storyteller'],
    trend: 'up',
    change: 3
  },
  // Add more entries...
  ...Array.from({ length: 45 }, (_, i) => ({
    rank: i + 6,
    userId: `user-${i + 6}`,
    username: `Player${i + 6}`,
    avatar: `https://picsum.photos/seed/user${i + 6}/100/100`,
    score: 13500 - (i * 150),
    gamesPlayed: 150 - (i * 3),
    winRate: 75 - (i * 0.5),
    level: 35 - i,
    badges: ['Player'],
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'same' as 'up' | 'down' | 'same',
    change: Math.floor(Math.random() * 5)
  }))
]

export default function GamingLeaderboardPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all')
  const [category, setCategory] = useState<'overall' | 'trivia' | 'puzzle' | 'creative'>('overall')

  const topThree = mockLeaderboard.slice(0, 3)
  const restOfLeaderboard = mockLeaderboard.slice(3)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <FiAward className="w-6 h-6 text-yellow-400" />
      case 2: return <FiStar className="w-6 h-6 text-gray-400" />
      case 3: return <FiAward className="w-6 h-6 text-amber-600" />
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (change === 0) return null
    return trend === 'up' ? (
      <FiTrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <FiTrendingDown className="w-4 h-4 text-red-400" />
    )
  }

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      'Champion': 'bg-yellow-600',
      'Speedster': 'bg-blue-600',
      'Strategist': 'bg-purple-600',
      'Puzzle Master': 'bg-green-600',
      'Trivia King': 'bg-orange-600',
      'Social Player': 'bg-pink-600',
      'Quick Thinker': 'bg-cyan-600',
      'Trivia Expert': 'bg-red-600',
      'Memory Master': 'bg-indigo-600',
      'Creative Mind': 'bg-teal-600',
      'Storyteller': 'bg-lime-600',
      'Player': 'bg-gray-600'
    }
    return colors[badge] || 'bg-gray-600'
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-900/20 via-orange-900/20 to-red-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiAward className="w-12 h-12 text-yellow-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Leaderboard
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Compete with players worldwide and climb the ranks
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockLeaderboard.length.toLocaleString()}</div>
                  <div className="text-sm">Total Players</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">🏆</div>
                  <div className="text-sm">Champions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">🎯</div>
                  <div className="text-sm">Games Played</div>
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
                  <button className="inline-flex items-center px-8 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-colors">
                    <FiTarget className="w-5 h-5 mr-2" />
                    View My Rank
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex bg-dark-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'month', label: 'This Month' },
                { id: 'week', label: 'This Week' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTimeframe(option.id as any)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    timeframe === option.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex bg-dark-100 rounded-lg p-1">
              {[
                { id: 'overall', label: 'Overall' },
                { id: 'trivia', label: 'Trivia' },
                { id: 'puzzle', label: 'Puzzle' },
                { id: 'creative', label: 'Creative' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setCategory(option.id as any)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    category === option.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-1 md:order-1"
            >
              <div className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 border border-gray-500/30 rounded-lg p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-6">
                  <Image
                    src={topThree[1]?.avatar}
                    alt={topThree[1]?.username}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4 border-4 border-gray-500"
                  />
                  <h3 className="text-xl font-bold text-white mb-1">{topThree[1]?.username}</h3>
                  <p className="text-gray-400 text-sm mb-2">2nd Place</p>
                  <div className="text-2xl font-bold text-gray-300">{topThree[1]?.score.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-2 md:order-2"
            >
              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <FiAward className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-8">
                  <Image
                    src={topThree[0]?.avatar}
                    alt={topThree[0]?.username}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto mb-4 border-4 border-yellow-500"
                  />
                  <h3 className="text-2xl font-bold text-white mb-1">{topThree[0]?.username}</h3>
                  <p className="text-yellow-400 text-sm mb-2 font-semibold">🥇 Champion</p>
                  <div className="text-3xl font-bold text-yellow-400">{topThree[0]?.score.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">points</div>
                </div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-3 md:order-3"
            >
              <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-lg p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-6">
                  <Image
                    src={topThree[2]?.avatar}
                    alt={topThree[2]?.username}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4 border-4 border-amber-600"
                  />
                  <h3 className="text-xl font-bold text-white mb-1">{topThree[2]?.username}</h3>
                  <p className="text-gray-400 text-sm mb-2">3rd Place</p>
                  <div className="text-2xl font-bold text-gray-300">{topThree[2]?.score.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full Leaderboard */}
          <div className="bg-dark-100 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-dark-200">
              <h2 className="text-lg font-semibold text-white">Full Rankings</h2>
            </div>
            <div className="divide-y divide-dark-200">
              {restOfLeaderboard.map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-dark-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank)}
                    </div>

                    <Image
                      src={entry.avatar}
                      alt={entry.username}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-dark-200"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{entry.username}</h3>
                        <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                          Level {entry.level}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.badges.slice(0, 3).map(badge => (
                          <span key={badge} className={`text-xs px-2 py-0.5 rounded text-white ${getBadgeColor(badge)}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{entry.score.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">points</div>
                    </div>

                    <div className="text-center min-w-[60px]">
                      <div className="text-white font-semibold">{entry.winRate}%</div>
                      <div className="text-gray-400 text-xs">win rate</div>
                    </div>

                    <div className="text-center min-w-[60px]">
                      <div className="text-white font-semibold">{entry.gamesPlayed}</div>
                      <div className="text-gray-400 text-xs">games</div>
                    </div>

                    <div className="flex items-center gap-1 min-w-[40px]">
                      {getTrendIcon(entry.trend, entry.change)}
                      {entry.change > 0 && (
                        <span className={`text-xs font-semibold ${
                          entry.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {entry.change}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiUsers className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{mockLeaderboard.length.toLocaleString()}</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiTarget className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockLeaderboard.reduce((sum, entry) => sum + entry.gamesPlayed, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Games Played</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiStar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {(mockLeaderboard.reduce((sum, entry) => sum + entry.winRate, 0) / mockLeaderboard.length).toFixed(1)}%
              </div>
              <div className="text-gray-400">Avg Win Rate</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiZap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.max(...mockLeaderboard.map(entry => entry.level))}
              </div>
              <div className="text-gray-400">Highest Level</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}