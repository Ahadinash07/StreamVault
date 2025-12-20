'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Movie } from '@/types/content'
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiHeart,
  FiPlay,
  FiChevronDown,
  FiX,
  FiSliders,
  FiZap,
  FiTarget,
  FiCompass
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterOptions {
  genres: string[]
  rating: number
  year: string
  type: 'all' | 'movie' | 'series'
  duration: string
  language: string
  mood: string
}

export default function DiscoverPage() {
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)
  const { user } = useAppSelector((state) => state.user)
  const watchProgress = useAppSelector((state) => state.watchProgress)

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'ai' | 'trending' | 'personalized' | 'explore'>('ai')
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    rating: 0,
    year: '',
    type: 'all',
    duration: '',
    language: '',
    mood: ''
  })

  // Combine all content
  const allContent = useMemo(() => [...movies, ...series], [movies, series])

  // Get user's watch history for personalization
  const userHistory = useMemo(() => {
    return Object.values(watchProgress.progress)
      .filter(progress => progress.currentTime / progress.duration > 0.3)
      .map(progress => {
        return allContent.find(item => item.id === progress.contentId)
      })
      .filter(Boolean)
  }, [watchProgress, allContent])

  // AI-powered recommendations based on user history
  const aiRecommendations = useMemo(() => {
    if (userHistory.length === 0) {
      return allContent
        .filter(item => item.rating >= 8.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 20)
    }

    // Analyze user's preferences
    const userGenres = userHistory.filter(item => item).flatMap(item => item!.genres || [])
    const genreCounts = userGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre)

    // Recommend content based on favorite genres and high ratings
    return allContent
      .filter(item => {
        const hasFavoriteGenre = favoriteGenres.some(genre =>
          item.genres?.includes(genre)
        )
        const isHighRated = item.rating >= 7.5
        const notWatched = !userHistory.filter(w => w).some(watched => watched!.id === item.id)
        return (hasFavoriteGenre || isHighRated) && notWatched
      })
      .sort((a, b) => {
        const aScore = (a.rating * 0.7) + (favoriteGenres.some(g => a.genres?.includes(g)) ? 20 : 0)
        const bScore = (b.rating * 0.7) + (favoriteGenres.some(g => b.genres?.includes(g)) ? 20 : 0)
        return bScore - aScore
      })
      .slice(0, 24)
  }, [userHistory, allContent])

  // Trending content (based on recent releases and ratings)
  const trendingContent = useMemo(() => {
    return allContent
      .filter(item => {
        const releaseYear = new Date(item.releaseDate).getFullYear()
        return releaseYear >= 2020 || item.rating >= 8.0
      })
      .sort((a, b) => {
        const aScore = a.rating + (new Date(a.releaseDate).getFullYear() >= 2023 ? 2 : 0)
        const bScore = b.rating + (new Date(b.releaseDate).getFullYear() >= 2023 ? 2 : 0)
        return bScore - aScore
      })
      .slice(0, 24)
  }, [allContent])

  // Personalized content based on mood and time
  const personalizedContent = useMemo(() => {
    const hour = new Date().getHours()
    let moodFilter = ''

    if (hour >= 6 && hour < 12) moodFilter = 'motivational'
    else if (hour >= 12 && hour < 17) moodFilter = 'engaging'
    else if (hour >= 17 && hour < 21) moodFilter = 'relaxing'
    else moodFilter = 'thrilling'

    return allContent
      .filter(item => {
        if (moodFilter === 'motivational') {
          return item.genres?.some(g => ['Drama', 'Biography', 'Documentary'].includes(g))
        }
        if (moodFilter === 'engaging') {
          return item.genres?.some(g => ['Action', 'Comedy', 'Adventure'].includes(g))
        }
        if (moodFilter === 'relaxing') {
          return item.genres?.some(g => ['Romance', 'Family', 'Animation'].includes(g))
        }
        if (moodFilter === 'thrilling') {
          return item.genres?.some(g => ['Thriller', 'Horror', 'Mystery'].includes(g))
        }
        return true
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 24)
  }, [allContent])

  // Explore content (random discovery)
  const exploreContent = useMemo(() => {
    return [...allContent]
      .sort(() => Math.random() - 0.5)
      .slice(0, 24)
  }, [allContent])

  // Filtered content based on search and filters
  const filteredContent = useMemo(() => {
    let content = allContent

    // Search filter
    if (searchQuery) {
      content = content.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Genre filter
    if (filters.genres.length > 0) {
      content = content.filter(item =>
        filters.genres.some(genre => item.genres?.includes(genre))
      )
    }

    // Rating filter
    if (filters.rating > 0) {
      content = content.filter(item => item.rating >= filters.rating)
    }

    // Year filter
    if (filters.year) {
      content = content.filter(item =>
        new Date(item.releaseDate).getFullYear().toString() === filters.year
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      content = content.filter(item => item.type === filters.type)
    }

    // Duration filter
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number)
      content = content.filter(item => {
        // Only filter movies by duration, series don't have a single duration
        if (item.type === 'movie') {
          const movieDuration = (item as Movie).duration
          if (max) {
            return movieDuration >= min && movieDuration <= max
          }
          return movieDuration >= min
        }
        // For series, always include them in duration filter
        return true
      })
    }

    return content.slice(0, 48)
  }, [allContent, searchQuery, filters])

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'ai': return aiRecommendations
      case 'trending': return trendingContent
      case 'personalized': return personalizedContent
      case 'explore': return exploreContent
      default: return filteredContent
    }
  }

  const allGenres = useMemo(() => {
    const genres = new Set<string>()
    allContent.forEach(item => {
      item.genres?.forEach(genre => genres.add(genre))
    })
    return Array.from(genres).sort()
  }, [allContent])

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiCompass className="w-8 h-8 text-purple-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Discover
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                AI-powered recommendations tailored just for you
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, series, genres..."
                  className="w-full pl-12 pr-4 py-4 bg-dark-100 border border-dark-200 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-lg"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-dark-200 hover:bg-dark-300 rounded-full transition-colors"
                >
                  <FiSliders className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex justify-center gap-8 text-gray-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{allContent.length}</div>
                  <div className="text-sm">Total Titles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{allGenres.length}</div>
                  <div className="text-sm">Genres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {allContent.filter(item => item.rating >= 8.5).length}
                  </div>
                  <div className="text-sm">Highly Rated</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-dark-100 border-b border-dark-200"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Genres */}
                  <div>
                    <label className="block text-white font-medium mb-2">Genres</label>
                    <div className="flex flex-wrap gap-2">
                      {allGenres.slice(0, 8).map(genre => (
                        <button
                          key={genre}
                          onClick={() => toggleGenre(genre)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.genres.includes(genre)
                              ? 'bg-purple-600 text-white'
                              : 'bg-dark-200 text-gray-300 hover:bg-dark-300'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-white font-medium mb-2">Min Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={7}>7+ Stars</option>
                      <option value={8}>8+ Stars</option>
                      <option value={9}>9+ Stars</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-white font-medium mb-2">Release Year</label>
                    <select
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Any Year</option>
                      {Array.from({ length: 10 }, (_, i) => 2024 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-white font-medium mb-2">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">All Types</option>
                      <option value="movie">Movies Only</option>
                      <option value="series">Series Only</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setFilters({
                      genres: [],
                      rating: 0,
                      year: '',
                      type: 'all',
                      duration: '',
                      language: '',
                      mood: ''
                    })}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-dark-200 pb-4">
            {[
              { id: 'ai', label: 'AI Recommendations', icon: FiZap, color: 'text-purple-400' },
              { id: 'trending', label: 'Trending Now', icon: FiTrendingUp, color: 'text-red-400' },
              { id: 'personalized', label: 'For You', icon: FiTarget, color: 'text-blue-400' },
              { id: 'explore', label: 'Explore', icon: FiCompass, color: 'text-green-400' }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {getCurrentContent().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group"
              >
                <Link href={item.type === 'movie' ? `/movies/${item.id}` : `/series/${item.id}`}>
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-dark-100">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FiPlay className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1 mb-1">
                        <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{item.rating}</span>
                      </div>
                      <p className="text-white text-xs line-clamp-2">{item.title}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {getCurrentContent().length === 0 && (
            <div className="text-center py-12">
              <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filters to find more content.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}