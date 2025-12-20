'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import {
  FiTarget,
  FiChevronLeft,
  FiPlay,
  FiClock,
  FiStar,
  FiAward,
  FiZap,
  FiCheck,
  FiLock,
  FiCalendar,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  gameId?: string
  gameName?: string
  gameIcon?: string
  requirements: {
    description: string
    target: number
    current?: number
  }[]
  rewards: {
    type: 'coins' | 'xp' | 'badge' | 'title'
    amount?: number
    name?: string
  }[]
  timeLimit?: number // in hours
  startDate: string
  endDate: string
  participants: number
  completedBy: number
  isCompleted: boolean
  isActive: boolean
  progress: number // 0-100
  streak?: number
}

const mockChallenges: Challenge[] = [
  {
    id: 'daily-trivia-master',
    title: 'Trivia Master',
    description: 'Answer 10 trivia questions correctly in a row',
    type: 'daily',
    difficulty: 'easy',
    gameId: 'movie-trivia-master',
    gameName: 'Movie Trivia Master',
    gameIcon: '🎬',
    requirements: [
      { description: 'Correct answers in a row', target: 10, current: 7 }
    ],
    rewards: [
      { type: 'coins', amount: 50 },
      { type: 'xp', amount: 100 }
    ],
    timeLimit: 24,
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-01-21T00:00:00Z',
    participants: 1250,
    completedBy: 456,
    isCompleted: false,
    isActive: true,
    progress: 70
  },
  {
    id: 'weekly-speed-demon',
    title: 'Speed Demon',
    description: 'Complete 5 games in under 2 minutes each',
    type: 'weekly',
    difficulty: 'medium',
    requirements: [
      { description: 'Fast completions', target: 5, current: 3 }
    ],
    rewards: [
      { type: 'coins', amount: 200 },
      { type: 'badge', name: 'Speedster' }
    ],
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-22T00:00:00Z',
    participants: 890,
    completedBy: 234,
    isCompleted: false,
    isActive: true,
    progress: 60
  },
  {
    id: 'monthly-completionist',
    title: 'Completionist',
    description: 'Unlock all achievements in any single game',
    type: 'monthly',
    difficulty: 'hard',
    requirements: [
      { description: 'Achievements unlocked', target: 12, current: 8 }
    ],
    rewards: [
      { type: 'coins', amount: 1000 },
      { type: 'title', name: 'Completionist' },
      { type: 'badge', name: 'Master' }
    ],
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    participants: 567,
    completedBy: 23,
    isCompleted: false,
    isActive: true,
    progress: 67
  },
  {
    id: 'seasonal-marathon',
    title: 'Gaming Marathon',
    description: 'Play for 10 hours total this month',
    type: 'seasonal',
    difficulty: 'medium',
    requirements: [
      { description: 'Hours played', target: 10, current: 6.5 }
    ],
    rewards: [
      { type: 'coins', amount: 500 },
      { type: 'xp', amount: 1000 },
      { type: 'badge', name: 'Marathoner' }
    ],
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    participants: 2100,
    completedBy: 345,
    isCompleted: false,
    isActive: true,
    progress: 65,
    streak: 12
  },
  {
    id: 'daily-social-butterfly',
    title: 'Social Butterfly',
    description: 'Join 3 watch parties today',
    type: 'daily',
    difficulty: 'easy',
    requirements: [
      { description: 'Watch parties joined', target: 3, current: 1 }
    ],
    rewards: [
      { type: 'coins', amount: 25 },
      { type: 'xp', amount: 50 }
    ],
    timeLimit: 24,
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-01-21T00:00:00Z',
    participants: 678,
    completedBy: 234,
    isCompleted: false,
    isActive: true,
    progress: 33
  },
  {
    id: 'weekly-puzzle-solver',
    title: 'Puzzle Solver',
    description: 'Solve 20 cinematic puzzles this week',
    type: 'weekly',
    difficulty: 'medium',
    gameId: 'cinematic-puzzles',
    gameName: 'Cinematic Puzzles',
    gameIcon: '🧩',
    requirements: [
      { description: 'Puzzles solved', target: 20, current: 14 }
    ],
    rewards: [
      { type: 'coins', amount: 150 },
      { type: 'xp', amount: 300 }
    ],
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-22T00:00:00Z',
    participants: 445,
    completedBy: 123,
    isCompleted: false,
    isActive: true,
    progress: 70
  }
]

export default function GamingChallengesPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const types = [
    { id: 'all', label: 'All Challenges', icon: FiTarget },
    { id: 'daily', label: 'Daily', icon: FiClock },
    { id: 'weekly', label: 'Weekly', icon: FiCalendar },
    { id: 'monthly', label: 'Monthly', icon: FiStar },
    { id: 'seasonal', label: 'Seasonal', icon: FiAward }
  ]

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'easy', label: 'Easy', color: 'text-green-400' },
    { id: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { id: 'hard', label: 'Hard', color: 'text-orange-400' },
    { id: 'expert', label: 'Expert', color: 'text-red-400' }
  ]

  const filteredChallenges = mockChallenges.filter(challenge => {
    const typeMatch = selectedType === 'all' || challenge.type === selectedType
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty
    return typeMatch && difficultyMatch
  })

  const getTypeColor = (type: string) => {
    const colors = {
      daily: 'bg-blue-600',
      weekly: 'bg-green-600',
      monthly: 'bg-purple-600',
      seasonal: 'bg-yellow-600'
    }
    return colors[type as keyof typeof colors] || colors.daily
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-400 border-green-400/30',
      medium: 'text-yellow-400 border-yellow-400/30',
      hard: 'text-orange-400 border-orange-400/30',
      expert: 'text-red-400 border-red-400/30'
    }
    return colors[difficulty as keyof typeof colors] || colors.easy
  }

  const formatTimeRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffInHours = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Less than 1 hour'
    if (diffInHours < 24) return `${diffInHours} hours`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days`
  }

  const getRewardIcon = (type: string) => {
    const icons = {
      coins: '🪙',
      xp: '⭐',
      badge: '🏆',
      title: '👑'
    }
    return icons[type as keyof typeof icons] || '🎁'
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-900/20 via-red-900/20 to-pink-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiTarget className="w-12 h-12 text-orange-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Challenges
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Take on exciting challenges and earn rewards for your achievements
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockChallenges.filter(c => c.isCompleted).length}
                  </div>
                  <div className="text-sm">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockChallenges.filter(c => c.isActive).length}
                  </div>
                  <div className="text-sm">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockChallenges.reduce((sum, c) => sum + c.rewards.filter(r => r.type === 'coins').reduce((s, r) => s + (r.amount || 0), 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm">Coins to Earn</div>
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
                    <FiAward className="w-5 h-5 mr-2" />
                    My Progress
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex bg-dark-100 rounded-lg p-1">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    selectedType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>

            <div className="flex bg-dark-100 rounded-lg p-1">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-dark-100 rounded-lg border-2 p-6 transition-all hover:scale-105 ${
                  challenge.isCompleted
                    ? 'border-green-500 bg-green-900/10'
                    : challenge.isActive
                      ? `border-purple-500/30 ${getDifficultyColor(challenge.difficulty)}`
                      : 'border-gray-600 bg-gray-900/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {challenge.gameIcon && <span className="text-2xl">{challenge.gameIcon}</span>}
                    <div>
                      <span className={`text-xs px-2 py-1 rounded ${getTypeColor(challenge.type)} text-white`}>
                        {challenge.type.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ml-2 ${getDifficultyColor(challenge.difficulty)} border`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>
                  {challenge.isCompleted ? (
                    <FiCheck className="w-6 h-6 text-green-400" />
                  ) : challenge.isActive ? (
                    <FiPlay className="w-6 h-6 text-purple-400" />
                  ) : (
                    <FiLock className="w-6 h-6 text-gray-500" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>

                {challenge.gameName && (
                  <div className="text-sm text-gray-400 mb-4">
                    Game: {challenge.gameName}
                  </div>
                )}

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Requirements:</h4>
                  {challenge.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{req.description}</span>
                      <span className="text-white">
                        {req.current !== undefined ? `${req.current}/${req.target}` : req.target}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-dark-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>

                {/* Rewards */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Rewards:</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.rewards.map((reward, rewardIndex) => (
                      <div key={rewardIndex} className="flex items-center gap-1 text-xs bg-dark-200 px-2 py-1 rounded">
                        <span>{getRewardIcon(reward.type)}</span>
                        <span className="text-gray-300">
                          {reward.amount ? reward.amount : reward.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <span>{challenge.participants.toLocaleString()} participants</span>
                  <span>{challenge.completedBy.toLocaleString()} completed</span>
                </div>

                {/* Time Remaining */}
                {challenge.timeLimit && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                    <FiClock className="w-3 h-3" />
                    <span>{formatTimeRemaining(challenge.endDate)} remaining</span>
                  </div>
                )}

                {/* Action Button */}
                {challenge.isCompleted ? (
                  <div className="text-center py-2">
                    <span className="text-green-400 font-semibold">Completed! 🎉</span>
                  </div>
                ) : challenge.isActive ? (
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Continue Challenge
                  </button>
                ) : (
                  <button className="w-full bg-gray-600 text-gray-400 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                    Not Available
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-16">
              <FiTarget className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No challenges found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}

          {/* Challenge Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiTarget className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{mockChallenges.length}</div>
              <div className="text-gray-400">Total Challenges</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockChallenges.filter(c => c.isCompleted).length}
              </div>
              <div className="text-gray-400">Completed</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiUsers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockChallenges.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Total Participants</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockChallenges.reduce((sum, c) => sum + c.rewards.filter(r => r.type === 'coins').reduce((s, r) => s + (r.amount || 0), 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Coins Available</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}