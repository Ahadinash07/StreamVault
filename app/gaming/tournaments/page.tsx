'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiAward,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiChevronLeft,
  FiPlay,
  FiEye,
  FiCalendar,
  FiTarget,
  FiZap,
  FiTrendingUp
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface Tournament {
  id: string
  title: string
  description: string
  gameId: string
  gameName: string
  gameIcon: string
  status: 'upcoming' | 'active' | 'completed'
  startDate: string
  endDate: string
  entryFee: number
  prizePool: number
  maxParticipants: number
  currentParticipants: number
  format: 'single-elimination' | 'double-elimination' | 'round-robin' | 'swiss'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  rules: string[]
  prizes: {
    position: number
    reward: string
    amount?: number
  }[]
  image: string
}

const mockTournaments: Tournament[] = [
  {
    id: 'weekly-trivia-championship',
    title: 'Weekly Trivia Championship',
    description: 'Test your movie knowledge in this weekly trivia tournament',
    gameId: 'movie-trivia-master',
    gameName: 'Movie Trivia Master',
    gameIcon: '🎬',
    status: 'active',
    startDate: '2024-01-20T18:00:00Z',
    endDate: '2024-01-27T18:00:00Z',
    entryFee: 50,
    prizePool: 2500,
    maxParticipants: 100,
    currentParticipants: 67,
    format: 'single-elimination',
    difficulty: 'intermediate',
    rules: [
      'Answer questions as quickly and accurately as possible',
      'Each round consists of 10 questions',
      'Wrong answers deduct points',
      'Top 16 advance to elimination rounds'
    ],
    prizes: [
      { position: 1, reward: 'StreamVault Coins', amount: 1000 },
      { position: 2, reward: 'StreamVault Coins', amount: 500 },
      { position: 3, reward: 'StreamVault Coins', amount: 250 },
      { position: 4, reward: 'Exclusive Badge', amount: 0 }
    ],
    image: 'https://picsum.photos/seed/tournament1/400/200'
  },
  {
    id: 'monthly-streaming-legends',
    title: 'Monthly Streaming Legends',
    description: 'The ultimate test of streaming knowledge and strategy',
    gameId: 'streaming-legends',
    gameName: 'Streaming Legends',
    gameIcon: '🏆',
    status: 'upcoming',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-29T23:59:59Z',
    entryFee: 100,
    prizePool: 10000,
    maxParticipants: 200,
    currentParticipants: 45,
    format: 'double-elimination',
    difficulty: 'advanced',
    rules: [
      'Complete all challenges within time limits',
      'Strategy and speed are equally important',
      'Bonus points for creative solutions',
      'Final round is head-to-head competition'
    ],
    prizes: [
      { position: 1, reward: 'StreamVault Coins', amount: 5000 },
      { position: 2, reward: 'StreamVault Coins', amount: 2500 },
      { position: 3, reward: 'StreamVault Coins', amount: 1500 },
      { position: 4, reward: 'Premium Subscription', amount: 0 },
      { position: 5, reward: 'Exclusive Avatar', amount: 0 }
    ],
    image: 'https://picsum.photos/seed/tournament2/400/200'
  },
  {
    id: 'plot-twister-masters',
    title: 'Plot Twister Masters',
    description: 'Show your creativity in this plot-twisting competition',
    gameId: 'plot-twister',
    gameName: 'Plot Twister',
    gameIcon: '🎭',
    status: 'completed',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-15T23:59:59Z',
    entryFee: 25,
    prizePool: 1250,
    maxParticipants: 50,
    currentParticipants: 50,
    format: 'round-robin',
    difficulty: 'expert',
    rules: [
      'Create the most creative plot twists',
      'Judged by creativity and coherence',
      'Community voting in final round',
      'Originality is key'
    ],
    prizes: [
      { position: 1, reward: 'StreamVault Coins', amount: 500 },
      { position: 2, reward: 'StreamVault Coins', amount: 300 },
      { position: 3, reward: 'StreamVault Coins', amount: 200 }
    ],
    image: 'https://picsum.photos/seed/tournament3/400/200'
  },
  {
    id: 'speedrun-challenge',
    title: 'Speedrun Challenge',
    description: 'Who can complete games the fastest?',
    gameId: 'binge-watch-challenge',
    gameName: 'Binge Watch Challenge',
    gameIcon: '⚡',
    status: 'upcoming',
    startDate: '2024-01-25T12:00:00Z',
    endDate: '2024-01-25T18:00:00Z',
    entryFee: 10,
    prizePool: 500,
    maxParticipants: 50,
    currentParticipants: 23,
    format: 'swiss',
    difficulty: 'beginner',
    rules: [
      'Complete the challenge as fast as possible',
      'No wrong answers allowed',
      'Time penalties for hints used',
      'Speed and accuracy matter'
    ],
    prizes: [
      { position: 1, reward: 'StreamVault Coins', amount: 200 },
      { position: 2, reward: 'StreamVault Coins', amount: 150 },
      { position: 3, reward: 'StreamVault Coins', amount: 100 }
    ],
    image: 'https://picsum.photos/seed/tournament4/400/200'
  }
]

export default function GamingTournamentsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const statusOptions = [
    { id: 'all', label: 'All Tournaments' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ]

  const difficultyOptions = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner', color: 'text-green-400' },
    { id: 'intermediate', label: 'Intermediate', color: 'text-yellow-400' },
    { id: 'advanced', label: 'Advanced', color: 'text-orange-400' },
    { id: 'expert', label: 'Expert', color: 'text-red-400' }
  ]

  const filteredTournaments = mockTournaments.filter(tournament => {
    const statusMatch = selectedStatus === 'all' || tournament.status === selectedStatus
    const difficultyMatch = selectedDifficulty === 'all' || tournament.difficulty === selectedDifficulty
    return statusMatch && difficultyMatch
  })

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-600',
      active: 'bg-green-600',
      completed: 'bg-gray-600'
    }
    return colors[status as keyof typeof colors] || colors.upcoming
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-orange-400',
      expert: 'text-red-400'
    }
    return colors[difficulty as keyof typeof colors] || colors.beginner
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
        <div className="relative overflow-hidden bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiAward className="w-12 h-12 text-yellow-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Tournaments
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Compete in exciting tournaments and win amazing prizes
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockTournaments.filter(t => t.status === 'active').length}</div>
                  <div className="text-sm">Active Now</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    ${mockTournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()}
                  </div>
                  <div className="text-sm">Total Prize Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockTournaments.reduce((sum, t) => sum + t.currentParticipants, 0)}
                  </div>
                  <div className="text-sm">Participants</div>
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
                    My Tournaments
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
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedStatus === status.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            <div className="flex bg-dark-100 rounded-lg p-1">
              {difficultyOptions.map((difficulty) => (
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

          {/* Tournament Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-100 rounded-lg overflow-hidden border border-dark-200"
              >
                <div className="relative">
                  <Image
                    src={tournament.image}
                    alt={tournament.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(tournament.status)}`}>
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white ${getDifficultyColor(tournament.difficulty)}`}>
                      {tournament.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{tournament.title}</h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-lg">{tournament.gameIcon}</span>
                        <span>{tournament.gameName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">${tournament.prizePool.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Prize Pool</div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{tournament.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {tournament.currentParticipants}/{tournament.maxParticipants} players
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        Entry: ${tournament.entryFee}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {tournament.status === 'active' ? 'Ends' : 'Starts'}: {formatDate(tournament.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTarget className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300 capitalize">
                        {tournament.format.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Prizes */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Prizes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tournament.prizes.slice(0, 3).map((prize, prizeIndex) => (
                        <div key={prizeIndex} className="flex items-center gap-1 text-xs bg-dark-200 px-2 py-1 rounded">
                          <FiAward className="w-3 h-3 text-yellow-400" />
                          <span className="text-gray-300">#{prize.position}:</span>
                          <span className="text-white">
                            {prize.amount ? `${prize.amount} ${prize.reward}` : prize.reward}
                          </span>
                        </div>
                      ))}
                      {tournament.prizes.length > 3 && (
                        <div className="text-xs text-gray-500 px-2 py-1">
                          +{tournament.prizes.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rules Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-2">Rules:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {tournament.rules.slice(0, 2).map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                      {tournament.rules.length > 2 && (
                        <li className="text-gray-500">...and {tournament.rules.length - 2} more rules</li>
                      )}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {tournament.status === 'active' && (
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <FiPlay className="w-4 h-4" />
                        Join Tournament
                      </button>
                    )}
                    {tournament.status === 'upcoming' && (
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <FiClock className="w-4 h-4" />
                        Register
                      </button>
                    )}
                    {tournament.status === 'completed' && (
                      <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <FiEye className="w-4 h-4" />
                        View Results
                      </button>
                    )}
                    <Link
                      href={`/gaming/${tournament.gameId}`}
                      className="bg-dark-200 hover:bg-dark-300 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiTarget className="w-4 h-4" />
                      Play Game
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="text-center py-16">
              <FiAward className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No tournaments found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later</p>
            </div>
          )}

          {/* Tournament Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{mockTournaments.length}</div>
              <div className="text-gray-400">Total Tournaments</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiDollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                ${mockTournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Total Prize Money</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiUsers className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockTournaments.reduce((sum, t) => sum + t.currentParticipants, 0)}
              </div>
              <div className="text-gray-400">Total Participants</div>
            </div>
            <div className="bg-dark-100 rounded-lg p-6 text-center">
              <FiTrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(mockTournaments.reduce((sum, t) => sum + t.currentParticipants, 0) / mockTournaments.reduce((sum, t) => sum + t.maxParticipants, 0) * 100)}%
              </div>
              <div className="text-gray-400">Avg. Participation</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}