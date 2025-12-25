'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiUsers,
  FiMessageSquare,
  FiHeart,
  FiShare,
  FiChevronLeft,
  FiTrendingUp,
  FiClock,
  FiThumbsUp,
  FiFlag,
  FiUser,
  FiHash,
  FiAward,
  FiSearch,
  FiPlus,
  FiFilter
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface CommunityPost {
  id: string
  author: {
    id: string
    username: string
    avatar: string
    level: number
    badges: string[]
  }
  title: string
  content: string
  category: 'general' | 'tips' | 'tournaments' | 'bugs' | 'suggestions'
  gameId?: string
  gameName?: string
  images?: string[]
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isPinned?: boolean
  tags: string[]
}

interface Discussion {
  id: string
  title: string
  description: string
  category: string
  participants: number
  lastActivity: string
  isActive: boolean
}

const mockPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: {
      id: 'user-1',
      username: 'GameMaster2024',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      level: 45,
      badges: ['Champion', 'Mentor']
    },
    title: 'My strategy for winning Trivia tournaments!',
    content: 'After months of practice, I\'ve developed a system that consistently gets me to the top. Here are my key tips: 1) Study the classics first, 2) Practice speed reading, 3) Know your weak categories, 4) Stay calm under pressure. What are your strategies?',
    category: 'tips',
    gameId: 'movie-trivia-master',
    gameName: 'Movie Trivia Master',
    timestamp: '2024-01-20T14:30:00Z',
    likes: 127,
    comments: 23,
    shares: 8,
    isLiked: false,
    tags: ['strategy', 'trivia', 'tournaments']
  },
  {
    id: 'post-2',
    author: {
      id: 'user-2',
      username: 'CineGamer',
      avatar: 'https://picsum.photos/seed/user2/100/100',
      level: 32,
      badges: ['Puzzle Master']
    },
    title: 'New achievement unlocked: Plot Twister Master!',
    content: 'Finally got the "Plot Twister Master" achievement after creating what I think is my best plot twist yet. The judges really liked the unexpected romance subplot. Here\'s a hint: sometimes the butler isn\'t the culprit... 🎭',
    category: 'general',
    gameId: 'plot-twister',
    gameName: 'Plot Twister',
    images: ['https://picsum.photos/seed/achievement/400/200'],
    timestamp: '2024-01-19T09:15:00Z',
    likes: 89,
    comments: 12,
    shares: 5,
    isLiked: true,
    tags: ['achievement', 'plot-twister']
  },
  {
    id: 'post-3',
    author: {
      id: 'user-3',
      username: 'BugHunter99',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      level: 28,
      badges: ['Bug Hunter']
    },
    title: 'Found a bug in Stream Quest - timer doesn\'t reset properly',
    content: 'During the final challenge in Stream Quest, the timer sometimes doesn\'t reset between rounds. This happened to me twice in the last tournament. Has anyone else experienced this? Steps to reproduce: 1) Start Stream Quest, 2) Get to round 3, 3) Fail the challenge, 4) Notice timer continues from previous round.',
    category: 'bugs',
    gameId: 'stream-quest',
    gameName: 'Stream Quest',
    timestamp: '2024-01-18T16:45:00Z',
    likes: 34,
    comments: 8,
    shares: 2,
    isLiked: false,
    tags: ['bug', 'stream-quest', 'timer']
  },
  {
    id: 'post-4',
    author: {
      id: 'user-4',
      username: 'CommunityMod',
      avatar: 'https://picsum.photos/seed/mod/100/100',
      level: 50,
      badges: ['Moderator', 'Legend']
    },
    title: 'Weekly Tournament Schedule - January 22-28',
    content: 'Here\'s what\'s coming up this week: 🏆 Monday: Trivia Championship (6 PM EST) 🎭 Tuesday: Plot Twister Creative Contest (8 PM EST) ⚡ Wednesday: Speedrun Challenge (7 PM EST) 🏅 Thursday: Achievement Hunt (9 PM EST) Don\'t miss out on the prizes!',
    category: 'tournaments',
    timestamp: '2024-01-17T12:00:00Z',
    likes: 156,
    comments: 31,
    shares: 45,
    isLiked: true,
    isPinned: true,
    tags: ['tournaments', 'schedule', 'weekly']
  }
]

const mockDiscussions: Discussion[] = [
  {
    id: 'disc-1',
    title: 'Advanced Trivia Strategies',
    description: 'Discuss advanced techniques for movie trivia mastery',
    category: 'tips',
    participants: 45,
    lastActivity: '2024-01-20T15:30:00Z',
    isActive: true
  },
  {
    id: 'disc-2',
    title: 'Bug Reports & Technical Issues',
    description: 'Report bugs and get help with technical problems',
    category: 'bugs',
    participants: 23,
    lastActivity: '2024-01-19T11:20:00Z',
    isActive: true
  },
  {
    id: 'disc-3',
    title: 'Tournament Preparation',
    description: 'Share tips and strategies for upcoming tournaments',
    category: 'tournaments',
    participants: 67,
    lastActivity: '2024-01-18T20:15:00Z',
    isActive: true
  }
]

export default function GamingCommunityPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest')

  const categories = [
    { id: 'all', label: 'All Posts', icon: FiHash },
    { id: 'general', label: 'General', icon: FiMessageSquare },
    { id: 'tips', label: 'Tips & Tricks', icon: FiTrendingUp },
    { id: 'tournaments', label: 'Tournaments', icon: FiAward },
    { id: 'bugs', label: 'Bug Reports', icon: FiFlag },
    { id: 'suggestions', label: 'Suggestions', icon: FiPlus }
  ]

  const filteredPosts = mockPosts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory
    const searchMatch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return categoryMatch && searchMatch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.comments) - (a.likes + a.comments)
      case 'trending':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-gray-600',
      tips: 'bg-blue-600',
      tournaments: 'bg-yellow-600',
      bugs: 'bg-red-600',
      suggestions: 'bg-green-600'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiUsers className="w-12 h-12 text-purple-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Community
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Connect with fellow gamers, share strategies, and discuss everything StreamVault Gaming
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockPosts.length}</div>
                  <div className="text-sm">Active Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockPosts.reduce((sum, post) => sum + post.likes, 0)}
                  </div>
                  <div className="text-sm">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockDiscussions.reduce((sum, disc) => sum + disc.participants, 0)}
                  </div>
                  <div className="text-sm">Community Members</div>
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
                    <FiPlus className="w-5 h-5 mr-2" />
                    Create Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex bg-dark-100 rounded-lg p-1">
              {[
                { id: 'latest', label: 'Latest' },
                { id: 'popular', label: 'Popular' },
                { id: 'trending', label: 'Trending' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id as any)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    sortBy === option.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pinned Post */}
          {filteredPosts.find(post => post.isPinned) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={filteredPosts.find(post => post.isPinned)?.author.avatar || ''}
                    alt={filteredPosts.find(post => post.isPinned)?.author.username || 'User'}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-yellow-400"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">PINNED</span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(filteredPosts.find(post => post.isPinned)?.category || 'general')}`}>
                      {filteredPosts.find(post => post.isPinned)?.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {filteredPosts.find(post => post.isPinned)?.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {filteredPosts.find(post => post.isPinned)?.content.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{filteredPosts.find(post => post.isPinned)?.author.username}</span>
                    <span>•</span>
                    <span>{formatTime(filteredPosts.find(post => post.isPinned)?.timestamp || '')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.filter(post => !post.isPinned).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-100 rounded-lg p-6 border border-dark-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.username}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-dark-200"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">{post.author.username}</span>
                      <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                        Level {post.author.level}
                      </span>
                      {post.author.badges.slice(0, 2).map(badge => (
                        <span key={badge} className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                          {badge}
                        </span>
                      ))}
                      <span className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>

                    <p className="text-gray-300 mb-4">{post.content}</p>

                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        <Image
                          src={post.images[0]}
                          alt="Post image"
                          width={400}
                          height={200}
                          className="rounded-lg max-w-full h-auto"
                        />
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs bg-dark-200 text-gray-400 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{formatTime(post.timestamp)}</span>
                        {post.gameName && (
                          <>
                            <span>•</span>
                            <Link href={`/gaming/${post.gameId}`} className="text-purple-400 hover:text-purple-300">
                              {post.gameName}
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <button className={`flex items-center gap-1 text-sm transition-colors ${
                          post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                        }`}>
                          <FiHeart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                          <FiMessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-green-400 transition-colors">
                          <FiShare className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <FiMessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Active Discussions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Active Discussions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDiscussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-100 rounded-lg p-6 border border-dark-200 hover:border-purple-500/30 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{discussion.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{discussion.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiUsers className="w-4 h-4" />
                      <span>{discussion.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{formatTime(discussion.lastActivity)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs text-white ${getCategoryColor(discussion.category)}`}>
                      {discussion.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}