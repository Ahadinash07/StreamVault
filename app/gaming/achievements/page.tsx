'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiAward,
  FiStar,
  FiTarget,
  FiZap,
  FiLock,
  FiCheck,
  FiChevronLeft,
  FiTrendingUp,
  FiUsers,
  FiClock
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'gameplay' | 'social' | 'progression' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  unlocked: boolean
  progress?: number
  maxProgress?: number
  unlockedDate?: string
  gameId?: string
}

const mockAchievements: Achievement[] = [
  // Gameplay Achievements
  {
    id: 'first-win',
    title: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    category: 'gameplay',
    rarity: 'common',
    points: 10,
    unlocked: true,
    unlockedDate: '2024-01-15'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a game in under 30 seconds',
    icon: '⚡',
    category: 'gameplay',
    rarity: 'rare',
    points: 50,
    unlocked: true,
    unlockedDate: '2024-01-20'
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Achieve a perfect score in any game',
    icon: '💯',
    category: 'gameplay',
    rarity: 'epic',
    points: 100,
    unlocked: false,
    progress: 95,
    maxProgress: 100
  },
  {
    id: 'marathon-player',
    title: 'Marathon Player',
    description: 'Play for 10 hours straight',
    icon: '🏃',
    category: 'gameplay',
    rarity: 'legendary',
    points: 500,
    unlocked: false,
    progress: 7.5,
    maxProgress: 10
  },

  // Social Achievements
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Join 5 watch parties',
    icon: '🦋',
    category: 'social',
    rarity: 'common',
    points: 25,
    unlocked: true,
    unlockedDate: '2024-01-18'
  },
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Win 10 multiplayer games',
    icon: '🤝',
    category: 'social',
    rarity: 'rare',
    points: 75,
    unlocked: false,
    progress: 7,
    maxProgress: 10
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'Share 50 game results on social media',
    icon: '📱',
    category: 'social',
    rarity: 'epic',
    points: 150,
    unlocked: false,
    progress: 23,
    maxProgress: 50
  },

  // Progression Achievements
  {
    id: 'level-up',
    title: 'Level Up',
    description: 'Reach level 10',
    icon: '⬆️',
    category: 'progression',
    rarity: 'common',
    points: 20,
    unlocked: true,
    unlockedDate: '2024-01-16'
  },
  {
    id: 'high-scorer',
    title: 'High Scorer',
    description: 'Score over 10,000 points total',
    icon: '📊',
    category: 'progression',
    rarity: 'rare',
    points: 60,
    unlocked: true,
    unlockedDate: '2024-01-22'
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Complete all games at least once',
    icon: '✅',
    category: 'progression',
    rarity: 'legendary',
    points: 1000,
    unlocked: false,
    progress: 8,
    maxProgress: 12
  },

  // Special Achievements
  {
    id: 'early-adopter',
    title: 'Early Adopter',
    description: 'Play Aurora Gaming on launch day',
    icon: '🚀',
    category: 'special',
    rarity: 'epic',
    points: 200,
    unlocked: true,
    unlockedDate: '2024-01-01'
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Reach the top of the leaderboard',
    icon: '👑',
    category: 'special',
    rarity: 'legendary',
    points: 1000,
    unlocked: false
  }
]

export default function GamingAchievementsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All', icon: FiAward },
    { id: 'gameplay', label: 'Gameplay', icon: FiTarget },
    { id: 'social', label: 'Social', icon: FiUsers },
    { id: 'progression', label: 'Progression', icon: FiTrendingUp },
    { id: 'special', label: 'Special', icon: FiStar }
  ]

  const rarities = [
    { id: 'all', label: 'All Rarities' },
    { id: 'common', label: 'Common', color: 'text-gray-400' },
    { id: 'rare', label: 'Rare', color: 'text-blue-400' },
    { id: 'epic', label: 'Epic', color: 'text-purple-400' },
    { id: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
  ]

  const filteredAchievements = mockAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity
    return categoryMatch && rarityMatch
  })

  const unlockedAchievements = mockAchievements.filter(a => a.unlocked)
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
  const completionRate = Math.round((unlockedAchievements.length / mockAchievements.length) * 100)

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-500 bg-gray-500/10',
      rare: 'border-blue-500 bg-blue-500/10',
      epic: 'border-purple-500 bg-purple-500/10',
      legendary: 'border-yellow-500 bg-yellow-500/10'
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getRarityIcon = (rarity: string) => {
    const icons = {
      common: '⭐',
      rare: '💎',
      epic: '🔥',
      legendary: '👑'
    }
    return icons[rarity as keyof typeof icons] || icons.common
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiAward className="w-12 h-12 text-yellow-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Achievements
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Track your progress and unlock rewards as you play
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{unlockedAchievements.length}</div>
                  <div className="text-sm">Unlocked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</div>
                  <div className="text-sm">Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{completionRate}%</div>
                  <div className="text-sm">Complete</div>
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
                  <Link
                    href="/gaming/profile"
                    className="inline-flex items-center px-8 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-colors"
                  >
                    <FiAward className="w-5 h-5 mr-2" />
                    View Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex bg-dark-100 rounded-lg p-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>

            <div className="flex bg-dark-100 rounded-lg p-1">
              {rarities.map((rarity) => (
                <button
                  key={rarity.id}
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedRarity === rarity.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {rarity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-dark-100 border-2 rounded-lg p-6 transition-all hover:scale-105 ${
                  achievement.unlocked
                    ? getRarityColor(achievement.rarity)
                    : 'border-gray-600 bg-gray-900/50'
                }`}
              >
                {achievement.unlocked ? (
                  <div className="absolute top-4 right-4">
                    <FiCheck className="w-6 h-6 text-green-400" />
                  </div>
                ) : (
                  <div className="absolute top-4 right-4">
                    <FiLock className="w-6 h-6 text-gray-500" />
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className={`text-4xl mb-2 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-sm">{getRarityIcon(achievement.rarity)}</span>
                    <span className={`text-xs font-semibold capitalize ${
                      achievement.rarity === 'common' ? 'text-gray-400' :
                      achievement.rarity === 'rare' ? 'text-blue-400' :
                      achievement.rarity === 'epic' ? 'text-purple-400' :
                      'text-yellow-400'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>

                <h3 className={`text-lg font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {achievement.title}
                </h3>

                <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>

                {achievement.progress !== undefined && achievement.maxProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-dark-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className={`text-sm font-semibold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {achievement.points} pts
                  </div>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="text-xs text-gray-500">
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-16">
              <FiAward className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No achievements found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}

          {/* Achievement Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
              <div className="text-gray-400">Achievements Unlocked</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiStar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</div>
              <div className="text-gray-400">Total Points</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiTarget className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{completionRate}%</div>
              <div className="text-gray-400">Completion Rate</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiZap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockAchievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}
              </div>
              <div className="text-gray-400">Legendary Achievements</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}