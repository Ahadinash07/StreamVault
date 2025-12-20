'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ContentRow from '@/components/ContentRow'
import ContinueWatching from '@/components/ContinueWatching'
import MoodPlaylists from '@/components/MoodPlaylists'
import Recommendations from '@/components/Recommendations'
import Achievements from '@/components/Achievements'
import SocialFeatures from '@/components/SocialFeatures'
import ContentSection from '@/components/ContentSection'
import { useAppSelector, useAppDispatch } from './hooks'
import {
  FiPlay,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiZap,
  FiRefreshCw,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronRight,
  FiSun,
  FiMoon,
  FiCoffee,
  FiSunrise,
  FiSunset,
  FiEye,
  FiThumbsUp,
  FiMessageCircle,
  FiPlus
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { addNotification } from './features/notifications/notificationsSlice'
import { loadSections, setSection } from './features/contentSections/contentSectionsSlice'

export default function Home() {
  const dispatch = useAppDispatch()
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeSection, setActiveSection] = useState<'all' | 'movies' | 'series' | 'gaming'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)

  const {
    trendingMovies,
    topRatedMovies,
    newReleases: newMovies,
  } = useAppSelector((state) => state.movies)
  const { trendingSeries, topRatedSeries } = useAppSelector((state) => state.series)
  const { user } = useAppSelector((state) => state.user)
  const watchProgress = useAppSelector((state) => state.watchProgress)
  const { sections, sectionOrder } = useAppSelector((state) => state.contentSections)
  const { personalizedRecommendations, moodBasedRecommendations } = useAppSelector((state) => state.recommendations)

  // Time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { greeting: 'Good Morning', icon: FiSun, mood: 'energetic' }
    if (hour < 17) return { greeting: 'Good Afternoon', icon: FiSun, mood: 'focused' }
    if (hour < 21) return { greeting: 'Good Evening', icon: FiSun, mood: 'relaxed' }
    return { greeting: 'Good Night', icon: FiMoon, mood: 'calm' }
  }

  const timeGreeting = getTimeBasedGreeting()

  // Personalized content based on watch history
  const personalizedContent = useMemo(() => {
    if (!user || Object.keys(watchProgress.progress).length === 0) {
      return [...trendingMovies.slice(0, 8), ...trendingSeries.slice(0, 8)]
    }

    const watchedContent = Object.values(watchProgress.progress)
      .filter(progress => progress.currentTime / progress.duration > 0.3)
      .map(progress => {
        const movie = trendingMovies.find(m => m.id === progress.contentId)
        const series = trendingSeries.find(s => s.id === progress.contentId)
        return movie || series
      })
      .filter(Boolean)

    if (watchedContent.length === 0) return [...trendingMovies.slice(0, 8), ...trendingSeries.slice(0, 8)]

    // Analyze preferences
    const genres = watchedContent.flatMap(item => item!.genres || [])
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre)

    // Recommend based on favorite genres
    const recommendations = [...trendingMovies, ...trendingSeries]
      .filter(item => {
        const hasFavoriteGenre = favoriteGenres.some(genre => item.genres?.includes(genre))
        const notWatched = !watchedContent.some(watched => watched!.id === item.id)
        return (hasFavoriteGenre || item.rating >= 8.0) && notWatched
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 16)

    return recommendations
  }, [user, watchProgress, trendingMovies, trendingSeries])

  // Helper function to get items for a section
  const getSectionItems = (sectionId: string) => {
    const section = sections[sectionId]
    if (!section) return []

    switch (sectionId) {
      case 'continue-watching':
        return Object.values(watchProgress.progress)
          .filter(progress => progress.currentTime / progress.duration > 0.1) // More than 10% watched
          .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
          .slice(0, section.maxItems)
          .map(progress => {
            const movie = trendingMovies.find(m => m.id === progress.contentId) ||
                         topRatedMovies.find(m => m.id === progress.contentId) ||
                         newMovies.find(m => m.id === progress.contentId)
            const series = trendingSeries.find(s => s.id === progress.contentId) ||
                          topRatedSeries.find(s => s.id === progress.contentId)
            return movie || series
          })
          .filter(Boolean)

      case 'trending-now':
        return [...trendingMovies, ...trendingSeries].slice(0, section.maxItems)

      case 'top-rated':
        return [...topRatedMovies, ...topRatedSeries].slice(0, section.maxItems)

      case 'new-releases':
        return [...newMovies].slice(0, section.maxItems)

      case 'recommended-for-you':
        // Use recommendations slice data
        const userRecs = user?.id ? personalizedRecommendations[user.id] || [] : []
        const recContentIds = userRecs.map(rec => rec.contentId)
        return recContentIds.map(id => {
          const movie = trendingMovies.find(m => m.id === id) ||
                       topRatedMovies.find(m => m.id === id) ||
                       newMovies.find(m => m.id === id)
          const series = trendingSeries.find(s => s.id === id) ||
                        topRatedSeries.find(s => s.id === id)
          return movie || series
        }).filter(Boolean).slice(0, section.maxItems)

      case 'mood-playlists':
        // Use mood-based recommendations
        const moodRecs = moodBasedRecommendations['current'] || [] // Assuming 'current' mood
        const moodContentIds = moodRecs.map(rec => rec.contentId)
        return moodContentIds.map(id => {
          const movie = trendingMovies.find(m => m.id === id) ||
                       topRatedMovies.find(m => m.id === id) ||
                       newMovies.find(m => m.id === id)
          const series = trendingSeries.find(s => s.id === id) ||
                        topRatedSeries.find(s => s.id === id)
          return movie || series
        }).filter(Boolean).slice(0, section.maxItems)

      case 'award-winners':
        return [...topRatedMovies, ...topRatedSeries]
          .filter(item => item.rating >= 9.0)
          .slice(0, section.maxItems)

      case 'hidden-gems':
        return [...topRatedMovies, ...topRatedSeries]
          .filter(item => item.rating >= 8.0)
          .slice(0, section.maxItems)

      case 'cult-classics':
        return [...topRatedMovies, ...topRatedSeries]
          .filter(item => new Date(item.releaseDate).getFullYear() < 2000 && item.rating >= 8.5)
          .slice(0, section.maxItems)

      case 'family-favorites':
        return [...topRatedMovies, ...topRatedSeries]
          .filter(item => item.genres?.includes('Family') || item.genres?.includes('Animation'))
          .slice(0, section.maxItems)

      case 'solo-watch':
        return [...topRatedMovies, ...topRatedSeries]
          .filter(item => item.genres?.includes('Drama') || item.genres?.includes('Documentary'))
          .slice(0, section.maxItems)

      case 'group-watch':
        return [...topRatedMovies, ...topRatedSeries]
          .filter(item => item.genres?.includes('Comedy') || item.genres?.includes('Action'))
          .slice(0, section.maxItems)

      case 'quick-watch':
        return [...topRatedMovies]
          .filter(movie => movie.duration && movie.duration <= 120)
          .slice(0, section.maxItems)

      case 'marathon-ready':
        return [...topRatedSeries]
          .filter(series => series.seasons && series.seasons.length >= 3)
          .slice(0, section.maxItems)

      default:
        return []
    }
  }

  // Quick actions for content items
  const getQuickActions = (item: any) => [
    {
      id: 'watchlist',
      label: user?.watchlist?.includes(item.id) ? 'Remove from Watchlist' : 'Add to Watchlist',
      icon: FiBookmark,
      action: () => {
        // This would be handled by Redux in a real implementation
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: user?.watchlist?.includes(item.id) ? 'Removed from Watchlist' : 'Added to Watchlist',
          message: `${item.title} ${user?.watchlist?.includes(item.id) ? 'removed from' : 'added to'} your watchlist`,
          timestamp: new Date().toISOString(),
          isRead: false
        }))
      }
    },
    {
      id: 'favorite',
      label: user?.favorites?.includes(item.id) ? 'Remove from Favorites' : 'Add to Favorites',
      icon: FiHeart,
      action: () => {
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: user?.favorites?.includes(item.id) ? 'Removed from Favorites' : 'Added to Favorites',
          message: `${item.title} ${user?.favorites?.includes(item.id) ? 'removed from' : 'added to'} favorites`,
          timestamp: new Date().toISOString(),
          isRead: false
        }))
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
        }) || navigator.clipboard.writeText(window.location.href)
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Link Copied',
          message: 'Share link copied to clipboard',
          timestamp: new Date().toISOString(),
          isRead: false
        }))
      }
    }
  ]

  // Filter content based on active section
  const getFilteredContent = (content: any[], type: 'movie' | 'series') => {
    if (activeSection === 'all') return content
    if (activeSection === 'movies' && type === 'movie') return content
    if (activeSection === 'series' && type === 'series') return content
    if (activeSection === 'gaming') return [] // Gaming content would come from gaming slice
    return content
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Content Refreshed',
        message: 'Latest recommendations loaded!',
        timestamp: new Date().toISOString(),
        isRead: false
      }))
    }, 1500)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize content sections on mount
  useEffect(() => {
    const allMovies = [...trendingMovies, ...topRatedMovies, ...newMovies]
    const allSeries = [...trendingSeries, ...topRatedSeries]
    const allContent = [...allMovies, ...allSeries]

    // Generate personalized recommendations
    const personalizedContent = user && Object.keys(watchProgress.progress).length > 0
      ? (() => {
          const watchedContent = Object.values(watchProgress.progress)
            .filter(progress => progress.currentTime / progress.duration > 0.3)
            .map(progress => {
              const movie = allMovies.find(m => m.id === progress.contentId)
              const series = allSeries.find(s => s.id === progress.contentId)
              return movie || series
            })
            .filter(Boolean)

          if (watchedContent.length === 0) return [...trendingMovies.slice(0, 8), ...trendingSeries.slice(0, 8)]

          const genres = watchedContent.flatMap(item => item!.genres || [])
          const genreCounts = genres.reduce((acc, genre) => {
            acc[genre] = (acc[genre] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          const favoriteGenres = Object.entries(genreCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([genre]) => genre)

          return allContent
            .filter(item => {
              const hasFavoriteGenre = favoriteGenres.some(genre => item.genres?.includes(genre))
              const notWatched = !watchedContent.some(watched => watched!.id === item.id)
              return (hasFavoriteGenre || item.rating >= 8.0) && notWatched
            })
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 16)
        })()
      : [...trendingMovies.slice(0, 12), ...trendingSeries.slice(0, 12)]

    // Initialize content sections with actual data
    const sectionsData = [
      {
        id: 'continue-watching',
        title: 'Continue Watching',
        subtitle: 'Pick up where you left off',
        type: 'recommended' as const,
        contentIds: Object.values(watchProgress.progress)
          .filter(progress => progress.currentTime / progress.duration > 0.1)
          .slice(0, 12)
          .map(progress => progress.contentId),
        contentType: 'mixed' as const,
        priority: 1,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 60,
        lastUpdated: Date.now(),
      },
      {
        id: 'trending-now',
        title: 'Trending Now',
        subtitle: 'What everyone\'s watching',
        type: 'trending' as const,
        contentIds: [...trendingMovies, ...trendingSeries].slice(0, 12).map(item => item.id),
        contentType: 'mixed' as const,
        priority: 2,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 30,
        lastUpdated: Date.now(),
      },
      {
        id: 'top-rated',
        title: 'Top Rated',
        subtitle: 'Critically acclaimed content',
        type: 'top_rated' as const,
        contentIds: [...topRatedMovies, ...topRatedSeries].slice(0, 12).map(item => item.id),
        contentType: 'mixed' as const,
        priority: 3,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 120,
        lastUpdated: Date.now(),
      },
      {
        id: 'new-releases',
        title: 'New Releases',
        subtitle: 'Latest additions to our library',
        type: 'new_releases' as const,
        contentIds: newMovies.slice(0, 12).map(item => item.id),
        contentType: 'movie' as const,
        priority: 4,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 60,
        lastUpdated: Date.now(),
      },
      {
        id: 'recommended-for-you',
        title: 'Recommended for You',
        subtitle: 'Personalized picks based on your taste',
        type: 'recommended' as const,
        contentIds: personalizedContent.slice(0, 12).map(item => item.id),
        contentType: 'mixed' as const,
        priority: 5,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 90,
        lastUpdated: Date.now(),
      },
      {
        id: 'mood-playlists',
        title: 'Mood Playlists',
        subtitle: 'Content for your current mood',
        type: 'mood_based' as const,
        contentIds: allContent.slice(0, 12).map(item => item.id),
        contentType: 'mixed' as const,
        priority: 6,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 180,
        lastUpdated: Date.now(),
        metadata: { mood: 'current' },
      },
      {
        id: 'award-winners',
        title: 'Award Winners',
        subtitle: 'Oscar and Golden Globe winners',
        type: 'award_winners' as const,
        contentIds: allContent.filter(item => item.rating >= 9.0).slice(0, 12).map(item => item.id),
        contentType: 'mixed' as const,
        priority: 7,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 240,
        lastUpdated: Date.now(),
      },
      {
        id: 'hidden-gems',
        title: 'Hidden Gems',
        subtitle: 'Underrated masterpieces',
        type: 'hidden_gems' as const,
        contentIds: allContent.filter(item => item.rating >= 8.0).slice(0, 12).map(item => item.id),
        contentType: 'mixed' as const,
        priority: 8,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 180,
        lastUpdated: Date.now(),
      },
      {
        id: 'cult-classics',
        title: 'Cult Classics',
        subtitle: 'Timeless favorites from decades past',
        type: 'cult_classics' as const,
        contentIds: allContent
          .filter(item => new Date(item.releaseDate).getFullYear() < 2000 && item.rating >= 8.5)
          .slice(0, 12)
          .map(item => item.id),
        contentType: 'mixed' as const,
        priority: 9,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 300,
        lastUpdated: Date.now(),
      },
      {
        id: 'family-favorites',
        title: 'Family Favorites',
        subtitle: 'Perfect for family movie night',
        type: 'family_favorites' as const,
        contentIds: allContent
          .filter(item => item.genres?.includes('Family') || item.genres?.includes('Animation'))
          .slice(0, 12)
          .map(item => item.id),
        contentType: 'mixed' as const,
        priority: 10,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 240,
        lastUpdated: Date.now(),
      },
      {
        id: 'solo-watch',
        title: 'Solo Watch',
        subtitle: 'Great content for watching alone',
        type: 'solo_watch' as const,
        contentIds: allContent
          .filter(item => item.genres?.includes('Drama') || item.genres?.includes('Documentary'))
          .slice(0, 12)
          .map(item => item.id),
        contentType: 'mixed' as const,
        priority: 11,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 180,
        lastUpdated: Date.now(),
      },
      {
        id: 'group-watch',
        title: 'Group Watch',
        subtitle: 'Perfect for watching with friends',
        type: 'group_watch' as const,
        contentIds: allContent
          .filter(item => item.genres?.includes('Comedy') || item.genres?.includes('Action'))
          .slice(0, 12)
          .map(item => item.id),
        contentType: 'mixed' as const,
        priority: 12,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 180,
        lastUpdated: Date.now(),
      },
      {
        id: 'quick-watch',
        title: 'Quick Watch',
        subtitle: 'Short movies under 2 hours',
        type: 'quick_watch' as const,
        contentIds: topRatedMovies
          .filter(movie => movie.duration && movie.duration <= 120)
          .slice(0, 12)
          .map(item => item.id),
        contentType: 'movie' as const,
        priority: 13,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 120,
        lastUpdated: Date.now(),
      },
      {
        id: 'marathon-ready',
        title: 'Marathon Ready',
        subtitle: 'Series with multiple seasons',
        type: 'marathon_ready' as const,
        contentIds: topRatedSeries
          .filter(series => series.seasons && series.seasons.length >= 3)
          .slice(0, 12)
          .map(item => item.id),
        contentType: 'series' as const,
        priority: 14,
        isVisible: true,
        maxItems: 12,
        refreshInterval: 240,
        lastUpdated: Date.now(),
      },
    ]

    dispatch(loadSections(sectionsData))

  }, [dispatch, trendingMovies, topRatedMovies, newMovies, trendingSeries, topRatedSeries, user, watchProgress])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main>
          <div className="h-[60vh] md:h-[80vh] lg:h-[90vh] w-full bg-dark-100 animate-pulse" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />

        {/* Enhanced Controls Bar */}
        <div className="sticky top-20 z-40 bg-black/95 backdrop-blur-md border-b border-dark-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Time-based greeting */}
              <div className="flex items-center gap-3">
                <timeGreeting.icon className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">{timeGreeting.greeting}</span>
                {user && (
                  <span className="text-gray-400">•</span>
                )}
                {user && (
                  <span className="text-gray-300">Welcome back, {user.name?.split(' ')[0] || 'User'}!</span>
                )}
              </div>

              {/* Content Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm mr-2">Show:</span>
                <div className="flex bg-dark-100 rounded-lg p-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'movies', label: 'Movies' },
                    { id: 'series', label: 'Series' },
                    { id: 'gaming', label: 'Gaming' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveSection(filter.id as any)}
                      className={`px-4 py-2 rounded-md transition-colors text-sm ${
                        activeSection === filter.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-dark-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode & Refresh */}
              <div className="flex items-center gap-2">
                <div className="flex bg-dark-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="Grid View"
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="List View"
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 bg-dark-100 hover:bg-dark-200 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh Content"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12">
          {/* Personalized Section */}
          {user && personalizedContent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 md:mb-12"
            >
              <div className="flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                  <FiZap className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                    Recommended for You
                  </h2>
                </div>
                <Link
                  href="/discover"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium flex items-center gap-2"
                >
                  View All
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`px-4 sm:px-6 lg:px-8 ${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-4'}`}>
                {personalizedContent.slice(0, viewMode === 'grid' ? 12 : 6).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative ${viewMode === 'list' ? 'flex gap-4 bg-dark-100 rounded-lg p-4' : ''}`}
                  >
                    <Link href={item.type === 'movie' ? `/movies/${item.id}` : `/series/${item.id}`}>
                      <div className={`relative ${viewMode === 'list' ? 'w-24 h-36 flex-shrink-0' : 'aspect-[2/3]'} rounded-lg overflow-hidden bg-dark-100`}>
                        <Image
                          src={item.poster}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes={viewMode === 'grid' ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw" : "96px"}
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

                    {viewMode === 'list' && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                setShowQuickActions(showQuickActions === item.id ? null : item.id)
                              }}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                              title="Quick Actions"
                            >
                              <FiFilter className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-sm font-medium">{item.rating}</span>
                          </div>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{new Date(item.releaseDate).getFullYear()}</span>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded text-white ${item.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'}`}>
                            {item.type}
                          </span>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{item.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {item.genres?.slice(0, 3).map(genre => (
                            <span key={genre} className="text-xs px-2 py-1 bg-dark-200 text-gray-300 rounded-full">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
              </div>
            </motion.div>
          )}

          {/* Dynamic Content Sections */}
          {sectionOrder.map(function(sectionId) {
            const section = sections[sectionId]
            if (!section || !section.isVisible) return null

            const items = getSectionItems(sectionId)
            if (items.length === 0) return null

            return (
              <ContentSection
                key={sectionId}
                sectionId={sectionId}
                title={section.title}
                subtitle={section.subtitle}
                items={items}
                type={section.type}
                viewMode="grid"
                maxItems={section.maxItems}
                showViewAll={true}
                viewAllLink={
                  section.type === 'trending' ? '/discover' :
                  section.contentType === 'movie' ? '/movies' :
                  section.contentType === 'series' ? '/series' :
                  '/discover'
                }
                showControls={true}
                isExpandable={items.length > section.maxItems}
                isExpanded={false}
                priority={section.priority}
                metadata={section.metadata}
              />
            )
          })}

          <ContinueWatching />
          <MoodPlaylists />
          <Recommendations />
          <Achievements />

          {/* Social Features - Unique to StreamVault */}
          <div className="mb-8 md:mb-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
              Community Hub
            </h2>
            <SocialFeatures />
          </div>

          {/* Reels Section - Short-form content */}
          <div className="mb-8 md:mb-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                Trending Reels
              </h2>
              <Link
                href="/reels"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-2"
              >
                View All →
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Mock reel thumbnails - in real app, this would come from reels state */}
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-pointer"
                >
                  <Link href="/reels">
                    <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-2 bg-dark-100">
                      <img
                        src={`https://picsum.photos/seed/reel${i}/300/500`}
                        alt={`Reel ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">▶</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(Math.random() * 60) + 15}s
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {['Behind the scenes', 'Trailer clip', 'Fan reaction', 'Movie review'][i % 4]}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Content Rows */}
          {getFilteredContent(trendingMovies, 'movie').length > 0 && (
            <ContentRow title="Trending Now" items={getFilteredContent(trendingMovies, 'movie')} type="movie" />
          )}
          {getFilteredContent(topRatedMovies, 'movie').length > 0 && (
            <ContentRow title="Top Rated Movies" items={getFilteredContent(topRatedMovies, 'movie')} type="movie" />
          )}
          {getFilteredContent(newMovies, 'movie').length > 0 && (
            <ContentRow title="New Releases" items={getFilteredContent(newMovies, 'movie')} type="movie" />
          )}
          {getFilteredContent(trendingSeries, 'series').length > 0 && (
            <ContentRow title="Trending Series" items={getFilteredContent(trendingSeries, 'series')} type="series" />
          )}
          {getFilteredContent(topRatedSeries, 'series').length > 0 && (
            <ContentRow title="Top Rated Series" items={getFilteredContent(topRatedSeries, 'series')} type="series" />
          )}
          {getFilteredContent(trendingMovies.slice(0, 10), 'movie').length > 0 && (
            <ContentRow
              title="Because You Watched"
              items={getFilteredContent(trendingMovies.slice(0, 10), 'movie')}
              type="movie"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

