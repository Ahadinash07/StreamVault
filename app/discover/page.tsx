'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
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
  FiCompass,
  FiShuffle,
  FiBookmark,
  FiShare2,
  FiThumbsUp,
  FiThumbsDown,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiSun,
  FiMoon,
  FiCoffee,
  FiFilm,
  FiTv,
  FiMusic,
  FiSmile,
  FiFrown,
  FiMeh,
  FiMic,
  FiImage,
  FiGrid,
  FiList,
  FiSettings,
  FiRefreshCw,
  FiTrendingDown,
  FiAward,
  FiClock as FiTime,
  FiUserCheck,
  FiMessageCircle
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { addNotification } from '@/app/features/notifications/notificationsSlice'

interface FilterOptions {
  genres: string[]
  rating: number
  year: string
  type: 'all' | 'movie' | 'series'
  duration: string
  language: string
  mood: string
  quality: string
  country: string
  certification: string
}

interface DiscoveryMode {
  id: string
  label: string
  description: string
  icon: any
  color: string
  bgColor: string
}

interface MoodOption {
  id: string
  label: string
  icon: any
  color: string
  description: string
}

interface QuickAction {
  id: string
  label: string
  icon: any
  action: () => void
}

export default function DiscoverPage() {
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)
  const { user } = useAppSelector((state) => state.user)
  const watchProgress = useAppSelector((state) => state.watchProgress)
  const dispatch = useAppDispatch()

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'ai' | 'trending' | 'personalized' | 'explore' | 'mood' | 'social' | 'surprise'>('ai')
  const [discoveryMode, setDiscoveryMode] = useState<'grid' | 'list' | 'carousel'>('grid')
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    rating: 0,
    year: '',
    type: 'all',
    duration: '',
    language: '',
    mood: '',
    quality: '',
    country: '',
    certification: ''
  })

  // Discovery modes for different exploration styles
  const discoveryModes: DiscoveryMode[] = [
    {
      id: 'ai',
      label: 'AI Curated',
      description: 'Smart recommendations based on your taste',
      icon: FiZap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'trending',
      label: 'Trending Now',
      description: 'What everyone\'s watching right now',
      icon: FiTrendingUp,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    {
      id: 'personalized',
      label: 'For You',
      description: 'Tailored to your preferences',
      icon: FiTarget,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'mood',
      label: 'Mood Based',
      description: 'Content for your current mood',
      icon: FiSmile,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      id: 'social',
      label: 'Social Feed',
      description: 'What your friends are watching',
      icon: FiUsers,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'surprise',
      label: 'Surprise Me',
      description: 'Random discoveries await',
      icon: FiShuffle,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    }
  ]

  // Mood options for mood-based discovery
  const moodOptions: MoodOption[] = [
    { id: 'happy', label: 'Happy', icon: FiSmile, color: 'text-yellow-400', description: 'Feel-good comedies and uplifting stories' },
    { id: 'sad', label: 'Melancholy', icon: FiFrown, color: 'text-blue-400', description: 'Emotional dramas and reflective films' },
    { id: 'excited', label: 'Excited', icon: FiZap, color: 'text-orange-400', description: 'Thrilling action and adventure' },
    { id: 'relaxed', label: 'Relaxed', icon: FiCoffee, color: 'text-green-400', description: 'Calm documentaries and light entertainment' },
    { id: 'romantic', label: 'Romantic', icon: FiHeart, color: 'text-pink-400', description: 'Love stories and romantic comedies' },
    { id: 'thoughtful', label: 'Thoughtful', icon: FiMeh, color: 'text-purple-400', description: 'Mind-bending sci-fi and deep dramas' }
  ]

  // Time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { greeting: 'Good Morning', icon: FiSun, mood: 'energetic' }
    if (hour < 17) return { greeting: 'Good Afternoon', icon: FiSun, mood: 'focused' }
    if (hour < 21) return { greeting: 'Good Evening', icon: FiSun, mood: 'relaxed' }
    return { greeting: 'Good Night', icon: FiMoon, mood: 'calm' }
  }

  const timeGreeting = getTimeBasedGreeting()

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

  // Enhanced AI-powered recommendations with explanations
  const aiRecommendations = useMemo(() => {
    if (userHistory.length === 0) {
      return allContent
        .filter(item => item.rating >= 8.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 20)
        .map(item => ({ ...item, reason: 'Highly rated content you might enjoy' }))
    }

    // Analyze user's preferences with more depth
    const userGenres = userHistory.filter(item => item).flatMap(item => item!.genres || [])
    const genreCounts = userGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre)

    // Analyze preferred content types and ratings
    const avgRating = userHistory.reduce((sum, item) => sum + (item?.rating || 0), 0) / userHistory.length
    const movieCount = userHistory.filter(item => item?.type === 'movie').length
    const seriesCount = userHistory.filter(item => item?.type === 'series').length
    const preferredType = movieCount > seriesCount ? 'movie' : seriesCount > movieCount ? 'series' : null

    // Recommend content based on multiple factors
    return allContent
      .filter(item => {
        const hasFavoriteGenre = favoriteGenres.some(genre =>
          item.genres?.includes(genre)
        )
        const isHighRated = item.rating >= (avgRating - 0.5)
        const notWatched = !userHistory.filter(w => w).some(watched => watched!.id === item.id)
        const typeMatch = !preferredType || item.type === preferredType
        return (hasFavoriteGenre || isHighRated) && notWatched && typeMatch
      })
      .map(item => {
        let reason = 'Recommended for you'
        if (favoriteGenres.some(g => item.genres?.includes(g))) {
          reason = `Based on your love for ${favoriteGenres[0]}`
        } else if (item.rating >= 8.5) {
          reason = 'Critically acclaimed'
        }
        return { ...item, reason }
      })
      .sort((a, b) => {
        const aScore = (a.rating * 0.7) + (favoriteGenres.some(g => a.genres?.includes(g)) ? 20 : 0)
        const bScore = (b.rating * 0.7) + (favoriteGenres.some(g => b.genres?.includes(g)) ? 20 : 0)
        return bScore - aScore
      })
      .slice(0, 24)
  }, [userHistory, allContent])

  // Mood-based content recommendations
  const moodBasedContent = useMemo(() => {
    if (!selectedMood) return []

    const moodMappings = {
      happy: ['Comedy', 'Animation', 'Family', 'Romance'],
      sad: ['Drama', 'Romance', 'Biography', 'Documentary'],
      excited: ['Action', 'Adventure', 'Thriller', 'Sci-Fi'],
      relaxed: ['Documentary', 'Drama', 'Romance', 'Animation'],
      romantic: ['Romance', 'Drama', 'Comedy'],
      thoughtful: ['Sci-Fi', 'Drama', 'Mystery', 'Thriller', 'Documentary']
    }

    const relevantGenres = moodMappings[selectedMood as keyof typeof moodMappings] || []

    return allContent
      .filter(item => relevantGenres.some(genre => item.genres?.includes(genre)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 24)
      .map(item => ({ ...item, reason: `Perfect for when you're feeling ${selectedMood}` }))
  }, [allContent, selectedMood])

  // Social feed - mock data for friends' activity
  const socialFeed = useMemo(() => {
    return allContent
      .filter(item => item.rating >= 7.5)
      .sort(() => Math.random() - 0.5)
      .slice(0, 12)
      .map(item => ({
        ...item,
        friendActivity: {
          friendName: ['Alex', 'Sarah', 'Mike', 'Emma', 'John'][Math.floor(Math.random() * 5)],
          action: ['watched', 'loved', 'recommended'][Math.floor(Math.random() * 3)],
          timeAgo: ['2 hours ago', 'yesterday', '3 days ago'][Math.floor(Math.random() * 3)]
        }
      }))
  }, [allContent])

  // Surprise me - completely random with fun reasons
  const surpriseContent = useMemo(() => {
    const surpriseReasons = [
      'Because why not?',
      'Adventure awaits!',
      'Time for something different',
      'Your lucky pick today',
      'Hidden gem discovered',
      'Breaking out of your comfort zone'
    ]

    return [...allContent]
      .sort(() => Math.random() - 0.5)
      .slice(0, 24)
      .map(item => ({
        ...item,
        reason: surpriseReasons[Math.floor(Math.random() * surpriseReasons.length)]
      }))
  }, [allContent])

  // Enhanced trending with more sophisticated algorithm
  const trendingContent = useMemo(() => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    return allContent
      .filter(item => {
        const releaseDate = new Date(item.releaseDate)
        const isRecent = releaseDate >= oneWeekAgo
        const isHighRated = item.rating >= 8.0
        const hasGoodReviews = item.rating >= 7.5 // Assuming this correlates with popularity
        return isRecent || isHighRated || hasGoodReviews
      })
      .sort((a, b) => {
        const aScore = a.rating +
          (new Date(a.releaseDate).getFullYear() >= 2023 ? 3 : 0) +
          (a.rating >= 8.5 ? 2 : 0)
        const bScore = b.rating +
          (new Date(b.releaseDate).getFullYear() >= 2023 ? 3 : 0) +
          (b.rating >= 8.5 ? 2 : 0)
        return bScore - aScore
      })
      .slice(0, 24)
      .map(item => ({ ...item, reason: 'Everyone\'s talking about this' }))
  }, [allContent])

  // Enhanced personalized content
  const personalizedContent = useMemo(() => {
    const hour = new Date().getHours()
    let timeContext = 'evening'
    let moodFilter = ''

    if (hour >= 6 && hour < 12) {
      timeContext = 'morning'
      moodFilter = 'motivational'
    } else if (hour >= 12 && hour < 17) {
      timeContext = 'afternoon'
      moodFilter = 'engaging'
    } else if (hour >= 17 && hour < 21) {
      timeContext = 'evening'
      moodFilter = 'relaxing'
    } else {
      timeContext = 'night'
      moodFilter = 'thrilling'
    }

    return allContent
      .filter(item => {
        if (moodFilter === 'motivational') {
          return item.genres?.some(g => ['Drama', 'Biography', 'Documentary', 'History'].includes(g))
        }
        if (moodFilter === 'engaging') {
          return item.genres?.some(g => ['Action', 'Comedy', 'Adventure', 'Crime'].includes(g))
        }
        if (moodFilter === 'relaxing') {
          return item.genres?.some(g => ['Romance', 'Family', 'Animation', 'Music'].includes(g))
        }
        if (moodFilter === 'thrilling') {
          return item.genres?.some(g => ['Thriller', 'Horror', 'Mystery', 'Sci-Fi'].includes(g))
        }
        return true
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 24)
      .map(item => ({ ...item, reason: `Perfect for a ${timeContext} watch` }))
  }, [allContent])

  // Explore content with discovery hints
  const exploreContent = useMemo(() => {
    return [...allContent]
      .sort(() => Math.random() - 0.5)
      .slice(0, 24)
      .map(item => ({ ...item, reason: 'Explore something new' }))
  }, [allContent])

  // Filtered content based on search and filters
  const filteredContent = useMemo(() => {
    let content = allContent

    // Search filter with enhanced matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      content = content.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.genres?.some(genre => genre.toLowerCase().includes(query)) ||
        (item.type === 'movie' && (item as Movie).director?.toLowerCase().includes(query)) ||
        item.cast?.some(actor => actor.toLowerCase().includes(query))
      )
    }

    // Advanced filters
    if (filters.genres.length > 0) {
      content = content.filter(item =>
        filters.genres.some(genre => item.genres?.includes(genre))
      )
    }

    if (filters.rating > 0) {
      content = content.filter(item => item.rating >= filters.rating)
    }

    if (filters.year) {
      content = content.filter(item =>
        new Date(item.releaseDate).getFullYear().toString() === filters.year
      )
    }

    if (filters.type !== 'all') {
      content = content.filter(item => item.type === filters.type)
    }

    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number)
      content = content.filter(item => {
        if (item.type === 'movie') {
          const movieDuration = (item as Movie).duration
          if (max) {
            return movieDuration >= min && movieDuration <= max
          }
          return movieDuration >= min
        }
        return true
      })
    }

    if (filters.quality) {
      // Mock quality filter - in real app this would check video quality
      content = content.filter(item => item.rating >= 7.0)
    }

    if (filters.certification) {
      // Mock certification filter
      content = content.filter(item => {
        if (filters.certification === 'PG-13') return item.rating >= 7.0
        if (filters.certification === 'R') return item.rating >= 8.0
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
      case 'mood': return moodBasedContent
      case 'social': return socialFeed
      case 'surprise': return surpriseContent
      default: return exploreContent
    }
  }

  // Quick actions for content cards
  const getQuickActions = (item: any): QuickAction[] => [
    {
      id: 'watchlist',
      label: savedItems.has(item.id) ? 'Remove from Watchlist' : 'Add to Watchlist',
      icon: FiBookmark,
      action: () => {
        setSavedItems(prev => {
          const newSet = new Set(prev)
          if (newSet.has(item.id)) {
            newSet.delete(item.id)
            dispatch(addNotification({
              id: Date.now().toString(),
              type: 'info',
              title: 'Removed from Watchlist',
              message: `${item.title} removed from your watchlist`,
              timestamp: new Date().toISOString(),
              isRead: false
            }))
          } else {
            newSet.add(item.id)
            dispatch(addNotification({
              id: Date.now().toString(),
              type: 'success',
              title: 'Added to Watchlist',
              message: `${item.title} added to your watchlist`,
              timestamp: new Date().toISOString(),
              isRead: false
            }))
          }
          return newSet
        })
      }
    },
    {
      id: 'share',
      label: 'Share',
      icon: FiShare2,
      action: () => {
        navigator.share?.({
          title: item.title,
          text: `Check out ${item.title} on Aurora Play!`,
          url: window.location.href
        }) || navigator.clipboard.writeText(`${window.location.href}/${item.type}/${item.id}`)
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Link Copied',
          message: 'Share link copied to clipboard',
          timestamp: new Date().toISOString(),
          isRead: false
        }))
      }
    },
    {
      id: 'rate',
      label: 'Rate',
      icon: FiStar,
      action: () => {
        // Mock rating action
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'info',
          title: 'Rating Feature',
          message: 'Rating system coming soon!',
          timestamp: new Date().toISOString(),
          isRead: false
        }))
      }
    }
  ]

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

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setShowVoiceSearch(true)
      // Voice search implementation would go here
    } else {
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Voice Search Unavailable',
        message: 'Voice search is not supported in your browser',
        timestamp: new Date().toISOString(),
        isRead: false
      }))
    }
  }

  const refreshDiscover = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Discovery Refreshed',
        message: 'Found new recommendations for you!',
        timestamp: new Date().toISOString(),
        isRead: false
      }))
    }, 1500)
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
              {/* Time-based greeting */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <timeGreeting.icon className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-medium">{timeGreeting.greeting}</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiCompass className="w-8 h-8 text-purple-400" />
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Discover
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-2">
                AI-powered recommendations tailored just for you
              </p>

              {/* User stats */}
              {user && (
                <div className="flex justify-center gap-8 text-gray-400 mb-8 text-sm">
                  <div>
                    <span className="text-white font-semibold">{userHistory.length}</span> watched
                  </div>
                  <div>
                    <span className="text-white font-semibold">{savedItems.size}</span> saved
                  </div>
                  <div>
                    <span className="text-white font-semibold">{allGenres.length}</span> genres explored
                  </div>
                </div>
              )}

              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, series, actors, directors..."
                  className="w-full pl-12 pr-24 py-4 bg-dark-100 border border-dark-200 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-lg"
                />

                {/* Search action buttons */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button
                    onClick={handleVoiceSearch}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                    title="Voice Search"
                  >
                    <FiMic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 bg-dark-200 hover:bg-dark-300 rounded-full transition-colors"
                    title="Advanced Filters"
                  >
                    <FiSliders className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Discovery Modes */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {discoveryModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <motion.button
                      key={mode.id}
                      onClick={() => setActiveTab(mode.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        activeTab === mode.id
                          ? `${mode.bgColor} border-2 border-current ${mode.color} scale-105`
                          : 'bg-dark-100/50 text-gray-300 hover:bg-dark-100 border-2 border-transparent hover:scale-105'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{mode.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Mood selector for mood-based discovery */}
              {activeTab === 'mood' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">How are you feeling today?</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {moodOptions.map((mood) => {
                      const Icon = mood.icon
                      return (
                        <button
                          key={mood.id}
                          onClick={() => setSelectedMood(mood.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            selectedMood === mood.id
                              ? `bg-current ${mood.color} scale-105`
                              : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{mood.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
              <div className="flex justify-center gap-8 text-gray-400">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{allContent.length}</div>
                  <div className="text-sm">Total Titles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{allGenres.length}</div>
                  <div className="text-sm">Genres</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {allContent.filter(item => item.rating >= 8.5).length}
                  </div>
                  <div className="text-sm">Highly Rated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {Math.round(allContent.reduce((sum, item) => sum + item.rating, 0) / allContent.length * 10) / 10}
                  </div>
                  <div className="text-sm">Avg Rating</div>
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
                      mood: '',
                      quality: '',
                      country: '',
                      certification: ''
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

        {/* Content Controls */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b border-dark-200 pb-4">
            {/* View Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm mr-2">View:</span>
              <div className="flex bg-dark-100 rounded-lg p-1">
                <button
                  onClick={() => setDiscoveryMode('grid')}
                  className={`p-2 rounded ${discoveryMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDiscoveryMode('list')}
                  className={`p-2 rounded ${discoveryMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="List View"
                >
                  <FiList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDiscoveryMode('carousel')}
                  className={`p-2 rounded ${discoveryMode === 'carousel' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="Carousel View"
                >
                  <FiImage className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshDiscover}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-dark-100 hover:bg-dark-200 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          {/* Content Display */}
          <motion.div
            key={`${activeTab}-${discoveryMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={
              discoveryMode === 'grid'
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                : discoveryMode === 'list'
                ? "space-y-4"
                : "flex gap-4 overflow-x-auto pb-4"
            }
          >
            {getCurrentContent().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`group relative ${
                  discoveryMode === 'grid'
                    ? ""
                    : discoveryMode === 'list'
                    ? "bg-dark-100 rounded-lg p-4"
                    : "flex-shrink-0 w-64"
                }`}
              >
                <Link href={item.type === 'movie' ? `/movies/${item.id}` : `/series/${item.id}`}>
                  <div className={`relative ${discoveryMode === 'list' ? 'flex gap-4' : ''} ${discoveryMode === 'grid' ? 'aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-dark-100' : discoveryMode === 'carousel' ? 'aspect-[2/3] rounded-lg overflow-hidden bg-dark-100' : 'w-24 h-36 rounded-lg overflow-hidden bg-dark-100 flex-shrink-0'}`}>
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes={discoveryMode === 'grid' ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw" : "96px"}
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

                {/* Content Info */}
                <div className={discoveryMode === 'list' ? 'flex-1' : discoveryMode === 'grid' ? 'px-1' : 'flex-1 ml-3'}>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-semibold text-white line-clamp-1 ${discoveryMode === 'grid' ? 'text-sm' : 'text-base'}`}>
                      {item.title}
                    </h3>
                    {discoveryMode !== 'carousel' && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setShowQuickActions(showQuickActions === item.id ? null : item.id)
                          }}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Quick Actions"
                        >
                          <FiSettings className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 text-xs font-medium">{item.rating}</span>
                    </div>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{new Date(item.releaseDate).getFullYear()}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className={`text-xs px-1 py-0.5 rounded text-white ${item.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'}`}>
                      {item.type}
                    </span>
                  </div>

                  {(item as any).reason && (
                    <p className="text-purple-400 text-xs mb-2 italic">"{(item as any).reason}"</p>
                  )}

                  {(item as any).friendActivity && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <FiUserCheck className="w-3 h-3" />
                      <span>{(item as any).friendActivity.friendName} {(item as any).friendActivity.action} this</span>
                      <span className="text-gray-500">•</span>
                      <span>{(item as any).friendActivity.timeAgo}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {item.genres?.slice(0, 2).map(genre => (
                      <span key={genre} className="text-xs px-2 py-0.5 bg-dark-200 text-gray-300 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Menu */}
                {showQuickActions === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-full right-0 mt-2 bg-dark-100 border border-dark-200 rounded-lg shadow-xl z-10 min-w-48"
                  >
                    {getQuickActions(item).map((action) => {
                      const ActionIcon = action.icon
                      return (
                        <button
                          key={action.id}
                          onClick={() => {
                            action.action()
                            setShowQuickActions(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-dark-200 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <ActionIcon className="w-4 h-4" />
                          <span className="text-sm">{action.label}</span>
                        </button>
                      )
                    })}
                  </motion.div>
                )}
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