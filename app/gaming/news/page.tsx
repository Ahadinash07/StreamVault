'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import {
  FiInfo,
  FiChevronLeft,
  FiCalendar,
  FiUser,
  FiEye,
  FiHeart,
  FiShare,
  FiTag,
  FiTrendingUp,
  FiStar,
  FiZap,
  FiAward
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string
  category: 'announcements' | 'updates' | 'features' | 'events' | 'tournaments'
  tags: string[]
  image: string
  featured: boolean
  views: number
  likes: number
  readTime: number
}

const mockArticles: NewsArticle[] = [
  {
    id: 'article-1',
    title: 'New Tournament System Launches Next Week!',
    excerpt: 'We\'re excited to announce a complete overhaul of our tournament system with new formats, bigger prizes, and enhanced matchmaking.',
    content: 'Full article content here...',
    author: {
      name: 'Aurora Team',
      avatar: 'https://picsum.photos/seed/team/100/100',
      role: 'Game Director'
    },
    publishedAt: '2024-01-20T10:00:00Z',
    category: 'announcements',
    tags: ['tournaments', 'new-features', 'prizes'],
    image: 'https://picsum.photos/seed/news1/600/300',
    featured: true,
    views: 2450,
    likes: 156,
    readTime: 3
  },
  {
    id: 'article-2',
    title: 'January Achievement Challenges Are Live!',
    excerpt: 'Complete these special challenges this month to earn exclusive rewards and climb the seasonal leaderboard.',
    content: 'Full article content here...',
    author: {
      name: 'Community Manager',
      avatar: 'https://picsum.photos/seed/cm/100/100',
      role: 'Community Manager'
    },
    publishedAt: '2024-01-15T14:30:00Z',
    category: 'events',
    tags: ['achievements', 'challenges', 'seasonal'],
    image: 'https://picsum.photos/seed/news2/600/300',
    featured: false,
    views: 1890,
    likes: 98,
    readTime: 2
  },
  {
    id: 'article-3',
    title: 'Behind the Scenes: Creating Movie Trivia Master',
    excerpt: 'Learn about the development process behind our most popular game, including the challenges we faced and lessons learned.',
    content: 'Full article content here...',
    author: {
      name: 'Lead Developer',
      avatar: 'https://picsum.photos/seed/dev/100/100',
      role: 'Lead Developer'
    },
    publishedAt: '2024-01-12T09:15:00Z',
    category: 'features',
    tags: ['development', 'trivia', 'behind-scenes'],
    image: 'https://picsum.photos/seed/news3/600/300',
    featured: false,
    views: 3120,
    likes: 234,
    readTime: 5
  },
  {
    id: 'article-4',
    title: 'Weekly Update: Bug Fixes and Balance Changes',
    excerpt: 'This week\'s update includes several important bug fixes and balance adjustments to improve your gaming experience.',
    content: 'Full article content here...',
    author: {
      name: 'QA Team',
      avatar: 'https://picsum.photos/seed/qa/100/100',
      role: 'QA Lead'
    },
    publishedAt: '2024-01-08T16:45:00Z',
    category: 'updates',
    tags: ['bug-fixes', 'balance', 'patch-notes'],
    image: 'https://picsum.photos/seed/news4/600/300',
    featured: false,
    views: 1650,
    likes: 67,
    readTime: 4
  },
  {
    id: 'article-5',
    title: 'Community Spotlight: Top Players of the Month',
    excerpt: 'Celebrating our amazing community members who dominated the leaderboards and tournaments this month.',
    content: 'Full article content here...',
    author: {
      name: 'Community Manager',
      avatar: 'https://picsum.photos/seed/cm2/100/100',
      role: 'Community Manager'
    },
    publishedAt: '2024-01-05T11:20:00Z',
    category: 'events',
    tags: ['community', 'spotlight', 'monthly'],
    image: 'https://picsum.photos/seed/news5/600/300',
    featured: false,
    views: 2780,
    likes: 189,
    readTime: 3
  }
]

export default function GamingNewsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All News', icon: FiInfo },
    { id: 'announcements', label: 'Announcements', icon: FiStar },
    { id: 'updates', label: 'Updates', icon: FiZap },
    { id: 'features', label: 'Features', icon: FiTrendingUp },
    { id: 'events', label: 'Events', icon: FiCalendar },
    { id: 'tournaments', label: 'Tournaments', icon: FiAward }
  ]

  const filteredArticles = mockArticles.filter(article =>
    selectedCategory === 'all' || article.category === selectedCategory
  )

  const featuredArticle = mockArticles.find(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  const getCategoryColor = (category: string) => {
    const colors = {
      announcements: 'bg-red-600',
      updates: 'bg-blue-600',
      features: 'bg-green-600',
      events: 'bg-purple-600',
      tournaments: 'bg-yellow-600'
    }
    return colors[category as keyof typeof colors] || colors.announcements
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-teal-900/20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiInfo className="w-12 h-12 text-blue-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  News & Updates
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Stay up to date with the latest Aurora Gaming news, features, and events
              </p>

              <div className="flex justify-center gap-8 text-gray-400 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{mockArticles.length}</div>
                  <div className="text-sm">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockArticles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
                  </div>
                  <div className="text-sm">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {mockArticles.reduce((sum, article) => sum + article.likes, 0)}
                  </div>
                  <div className="text-sm">Total Likes</div>
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
                    <FiTag className="w-5 h-5 mr-2" />
                    Subscribe to Updates
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
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

          {/* Featured Article */}
          {featuredArticle && selectedCategory === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      width={600}
                      height={300}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">FEATURED</span>
                      <span className={`px-3 py-1 rounded-full text-xs text-white ${getCategoryColor(featuredArticle.category)}`}>
                        {featuredArticle.category.toUpperCase()}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-gray-300 mb-6">{featuredArticle.excerpt}</p>

                    <div className="flex items-center gap-4 mb-6">
                      <Image
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="text-white font-semibold">{featuredArticle.author.name}</div>
                        <div className="text-gray-400 text-sm">{featuredArticle.author.role}</div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {formatDate(featuredArticle.publishedAt)} • {featuredArticle.readTime} min read
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1 text-gray-400">
                        <FiEye className="w-4 h-4" />
                        <span>{featuredArticle.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <FiHeart className="w-4 h-4" />
                        <span>{featuredArticle.likes}</span>
                      </div>
                    </div>

                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Read Full Article
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-100 rounded-lg overflow-hidden border border-dark-200 hover:border-purple-500/30 transition-colors"
              >
                <div className="relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-white text-sm font-semibold">{article.author.name}</div>
                      <div className="text-gray-500 text-xs">{formatDate(article.publishedAt)}</div>
                    </div>
                    <div className="text-gray-500 text-xs">{article.readTime} min</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiHeart className="w-4 h-4" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-dark-200 text-gray-400 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Read More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <FiInfo className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-8 text-center">
            <FiInfo className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest news, feature updates, and tournament announcements delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}