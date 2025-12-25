'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  FiAward,
  FiBookmark,
  FiMail,
  FiSend
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
      name: 'StreamVault Team',
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
  const router = useRouter()

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

  const handleArticleClick = (articleId: string) => {
    router.push(`/gaming/news/${articleId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <main className="pt-20">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30"></div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <div className="relative">
                  <FiInfo className="w-16 h-16 text-blue-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    News & Updates
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
              >
                Stay ahead of the curve with the latest StreamVault Gaming news, exclusive updates, and groundbreaking features
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-12 text-gray-400 mb-12"
              >
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {mockArticles.length}
                  </div>
                  <div className="text-sm uppercase tracking-wider">Articles</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                    {mockArticles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
                  </div>
                  <div className="text-sm uppercase tracking-wider">Total Views</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {mockArticles.reduce((sum, article) => sum + article.likes, 0)}
                  </div>
                  <div className="text-sm uppercase tracking-wider">Total Likes</div>
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
                  <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25">
                    <FiTag className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Subscribe to Updates
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Filters */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105 border border-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <category.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-400'
                  }`} />
                  <span className="text-sm uppercase tracking-wider">{category.label}</span>
                </div>
                {selectedCategory === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Featured Article */}
          {featuredArticle && selectedCategory === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-16"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Featured Article</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
              </div>

              <div
                onClick={() => handleArticleClick(featuredArticle.id)}
                className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="md:flex relative z-10">
                  <div className="md:w-1/2 relative overflow-hidden rounded-l-3xl">
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      width={600}
                      height={400}
                      className="w-full h-80 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span className="inline-flex items-center px-4 py-2 bg-red-600/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg">
                        ⭐ FEATURED
                      </span>
                    </div>
                    <div className="absolute top-6 right-6">
                      <span className={`inline-flex items-center px-4 py-2 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg ${getCategoryColor(featuredArticle.category)}`}>
                        {featuredArticle.category.charAt(0).toUpperCase() + featuredArticle.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <FiStar className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm">Breaking News</span>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-blue-300 transition-colors duration-300">
                        {featuredArticle.title}
                      </h3>

                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                      <Image
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-gray-600"
                      />
                      <div>
                        <div className="text-white font-semibold text-lg">{featuredArticle.author.name}</div>
                        <div className="text-gray-400 text-sm">{featuredArticle.author.role}</div>
                      </div>
                      <div className="text-gray-400 text-sm ml-auto">
                        <div>{formatDate(featuredArticle.publishedAt)}</div>
                        <div>{featuredArticle.readTime} min read</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-6 text-gray-400">
                        <div className="flex items-center gap-2">
                          <FiEye className="w-5 h-5" />
                          <span className="font-semibold">{featuredArticle.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiHeart className="w-5 h-5" />
                          <span className="font-semibold">{featuredArticle.likes}</span>
                        </div>
                      </div>
                    </div>

                    <button className="group/btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-3">
                      <span>Read Full Article</span>
                      <FiChevronLeft className="w-5 h-5 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                onClick={() => handleArticleClick(article.id)}
                className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg ${getCategoryColor(article.category)}`}>
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FiBookmark className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                      {article.title}
                    </h3>

                    <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={36}
                        height={36}
                        className="rounded-full border-2 border-gray-600"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-semibold">{article.author.name}</div>
                        <div className="text-gray-400 text-xs">{formatDate(article.publishedAt)}</div>
                      </div>
                      <div className="text-gray-400 text-xs text-right">
                        <div>{article.readTime} min</div>
                        <div>read</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <FiEye className="w-4 h-4" />
                          <span className="font-semibold">{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiHeart className="w-4 h-4" />
                          <span className="font-semibold">{article.likes}</span>
                        </div>
                      </div>
                    </div>

                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full border border-gray-600/50">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button className="group/btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-2">
                      <span>Read Article</span>
                      <FiChevronLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
                <FiInfo className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No articles found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Try selecting a different category or check back later for new content.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                View All Articles
              </button>
            </motion.div>
          )}

          {/* Enhanced Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-20 relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
            <div className="relative z-10 p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Stay in the Game</h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Subscribe to our newsletter to get the latest news, feature updates, tournament announcements, and exclusive gaming content delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-2">
                  <FiSend className="w-5 h-5" />
                  <span>Subscribe</span>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-6">No spam, unsubscribe at any time.</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}