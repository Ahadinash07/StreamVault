'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../hooks'
import { setGenres, setYear, setRating, setSortBy, clearFilters, toggleGenre, setShowFilters } from '../features/filters/filterSlice'
import {
  FiFilter,
  FiX,
  FiGrid,
  FiList,
  FiSearch,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiZap,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiThumbsUp,
  FiMessageCircle,
  FiPlus,
  FiPlay,
  FiChevronRight
} from 'react-icons/fi'
import { Series } from '@/types/content'
import type { Genre, SortOption } from '../features/filters/filterSlice'
import { addNotification } from '../features/notifications/notificationsSlice'

export default function SeriesPage() {
  const dispatch = useAppDispatch()
  const { series, trendingSeries, topRatedSeries, newReleases: newSeriesReleases } = useAppSelector((state) => state.series)
  const { genres, year, rating, sortBy, showFilters } = useAppSelector((state) => state.filters)
  const { user } = useAppSelector((state) => state.user)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'top-rated' | 'new-releases' | 'favorites'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [moodFilter, setMoodFilter] = useState<string>('')

  const allGenres: Genre[] = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller', 'Western'
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Rating' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'newest', label: 'Newest First' },
  ]

  const moodOptions = [
    { id: 'action-packed', label: 'Action-Packed', genres: ['Action', 'Adventure', 'Thriller'], icon: FiZap },
    { id: 'romantic', label: 'Romantic', genres: ['Romance', 'Drama'], icon: FiHeart },
    { id: 'scary', label: 'Scary', genres: ['Horror', 'Thriller'], icon: FiStar },
    { id: 'funny', label: 'Funny', genres: ['Comedy'], icon: FiTrendingUp },
    { id: 'mind-bending', label: 'Mind-Bending', genres: ['Sci-Fi', 'Mystery', 'Fantasy'], icon: FiEye },
    { id: 'emotional', label: 'Emotional', genres: ['Drama', 'Romance'], icon: FiThumbsUp },
  ]

  // Get series based on active tab
  const getSeriesForTab = () => {
    switch (activeTab) {
      case 'trending':
        return trendingSeries
      case 'top-rated':
        return topRatedSeries
      case 'new-releases':
        return newSeriesReleases
      case 'favorites':
        return series.filter(s => user?.favorites?.includes(s.id))
      default:
        return series
    }
  }

  // Enhanced filtering logic
  const filteredSeries = useMemo(() => {
    let filtered = getSeriesForTab()

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Mood-based filtering
    if (moodFilter) {
      const moodData = moodOptions.find(m => m.id === moodFilter)
      if (moodData) {
        filtered = filtered.filter(s =>
          moodData.genres.some(genre => s.genres.includes(genre))
        )
      }
    }

    // Genre filter
    if (genres.length > 0) {
      filtered = filtered.filter((s) =>
        genres.some((genre) => s.genres.includes(genre))
      )
    }

    // Year filter
    if (year) {
      filtered = filtered.filter(
        (s) => new Date(s.releaseDate).getFullYear() === year
      )
    }

    // Rating filter
    if (rating) {
      filtered = filtered.filter((s) => s.rating >= rating)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'release_date':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [series, trendingSeries, topRatedSeries, newSeriesReleases, activeTab, user?.favorites, searchQuery, moodFilter, genres, year, rating, sortBy])

  // Quick actions for series
  const getQuickActions = (s: Series) => [
    {
      id: 'watchlist',
      label: user?.watchlist?.includes(s.id) ? 'Remove from Watchlist' : 'Add to Watchlist',
      icon: FiBookmark,
      action: () => {
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: user?.watchlist?.includes(s.id) ? 'Removed from Watchlist' : 'Added to Watchlist',
          message: `${s.title} ${user?.watchlist?.includes(s.id) ? 'removed from' : 'added to'} your watchlist`,
          timestamp: new Date().toISOString(),
          isRead: false
        }))
      }
    },
    {
      id: 'favorite',
      label: user?.favorites?.includes(s.id) ? 'Remove from Favorites' : 'Add to Favorites',
      icon: FiHeart,
      action: () => {
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: user?.favorites?.includes(s.id) ? 'Removed from Favorites' : 'Added to Favorites',
          message: `${s.title} ${user?.favorites?.includes(s.id) ? 'removed from' : 'added to'} favorites`,
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
          title: s.title,
          text: `Check out ${s.title} on Aurora Play!`,
          url: `${window.location.origin}/series/${s.id}`
        }) || navigator.clipboard.writeText(`${window.location.origin}/series/${s.id}`)
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

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Series Refreshed',
        message: 'Latest series loaded!',
        timestamp: new Date().toISOString(),
        isRead: false
      }))
    }, 1500)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  TV Series
                </h1>
                <p className="text-gray-400 text-lg">
                  Discover binge-worthy series from our extensive collection
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-20 z-40 bg-black/95 backdrop-blur-md border border-dark-200 rounded-lg p-4 mb-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'All Series' },
                  { id: 'trending', label: 'Trending' },
                  { id: 'top-rated', label: 'Top Rated' },
                  { id: 'new-releases', label: 'New Releases' },
                  { id: 'favorites', label: 'My Favorites' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-dark-200 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Mood Filter */}
                <div className="relative">
                  <select
                    value={moodFilter}
                    onChange={(e) => setMoodFilter(e.target.value)}
                    className="px-3 py-2 bg-dark-100 border border-dark-200 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Moods</option>
                    {moodOptions.map((mood) => (
                      <option key={mood.id} value={mood.label}>
                        {mood.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
                  className="px-3 py-2 bg-dark-100 border border-dark-200 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
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
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`p-2 rounded ${viewMode === 'compact' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="Compact View"
                  >
                    <FiTrendingUp className="w-4 h-4" />
                  </button>
                </div>

                {/* Filters Toggle */}
                <button
                  onClick={() => dispatch(setShowFilters(!showFilters))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showFilters ? 'bg-purple-600 text-white' : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>

                {/* Refresh */}
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
          </motion.div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="p-6 bg-dark-100 rounded-lg border border-dark-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FiFilter className="w-5 h-5" />
                      Advanced Filters
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(clearFilters())}
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => dispatch(setShowFilters(false))}
                        className="p-2 hover:bg-dark-200 rounded-lg transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Genres */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Genres</label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {allGenres.map((genre) => (
                          <button
                            key={genre}
                            onClick={() => dispatch(toggleGenre(genre))}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              genres.includes(genre)
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-dark-200 text-gray-300 hover:bg-dark-300 hover:text-white'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Release Year</label>
                      <select
                        value={year || ''}
                        onChange={(e) =>
                          dispatch(setYear(e.target.value ? parseInt(e.target.value) : null))
                        }
                        className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">All Years</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">
                        Minimum Rating: <span className="text-yellow-400">{rating || 0}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={rating || 0}
                        onChange={(e) =>
                          dispatch(setRating(e.target.value ? parseFloat(e.target.value) : null))
                        }
                        className="w-full accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>10</span>
                      </div>
                    </div>

                    {/* Quick Mood Presets */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Quick Moods</label>
                      <div className="space-y-2">
                        {moodOptions.slice(0, 4).map((mood) => {
                          const Icon = mood.icon
                          return (
                            <button
                              key={mood.id}
                              onClick={() => setMoodFilter(mood.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                                moodFilter === mood.id
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-dark-200 text-gray-300 hover:bg-dark-300 hover:text-white'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{mood.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <p className="text-gray-400">
                Showing <span className="text-white font-medium">{filteredSeries.length}</span> {filteredSeries.length === 1 ? 'series' : 'series'}
                {searchQuery && (
                  <span> for "<span className="text-purple-400">{searchQuery}</span>"</span>
                )}
              </p>
              {moodFilter && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 border border-purple-600/30 rounded-full">
                  <span className="text-purple-400 text-sm">
                    {moodOptions.find(m => m.id === moodFilter)?.label}
                  </span>
                  <button
                    onClick={() => setMoodFilter('')}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Active Filters Summary */}
            {(genres.length > 0 || year || rating) && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Active filters:</span>
                {genres.length > 0 && (
                  <span className="text-purple-400">{genres.length} genre{genres.length > 1 ? 's' : ''}</span>
                )}
                {year && <span className="text-purple-400">{year}</span>}
                {rating && <span className="text-purple-400">≥{rating}</span>}
              </div>
            )}
          </motion.div>

          {/* Series Grid/List */}
          {filteredSeries.length > 0 ? (
            <motion.div
              layout
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6'
                  : viewMode === 'list'
                  ? 'space-y-4'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              }
            >
              {filteredSeries.map((s, index) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative ${
                    viewMode === 'list'
                      ? 'flex gap-4 bg-dark-100 rounded-lg p-4 hover:bg-dark-200 transition-colors'
                      : viewMode === 'compact'
                      ? 'flex gap-3 bg-dark-100 rounded-lg p-3 hover:bg-dark-200 transition-colors'
                      : ''
                  }`}
                >
                  <Link href={`/series/${s.id}`}>
                    <div className={`relative ${
                      viewMode === 'list'
                        ? 'w-24 h-36 flex-shrink-0'
                        : viewMode === 'compact'
                        ? 'w-16 h-24 flex-shrink-0'
                        : 'aspect-[2/3]'
                    } rounded-lg overflow-hidden bg-dark-100`}>
                      <Image
                        src={s.poster}
                        alt={s.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes={
                          viewMode === 'grid'
                            ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                            : viewMode === 'list'
                            ? "96px"
                            : "64px"
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FiPlay className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 mb-1">
                          <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs font-medium">{s.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-white text-xs line-clamp-2">{s.title}</p>
                      </div>
                    </div>
                  </Link>

                  {viewMode !== 'grid' && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {s.title}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setShowQuickActions(showQuickActions === s.id ? null : s.id)
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
                          <span className="text-yellow-400 text-xs font-medium">{s.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-400 text-xs">{new Date(s.releaseDate).getFullYear()}</span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className={`text-xs px-2 py-0.5 rounded text-white bg-green-600`}>
                          Series
                        </span>
                      </div>

                      {viewMode === 'list' && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{s.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {s.genres?.slice(0, viewMode === 'compact' ? 2 : 3).map(genre => (
                          <span key={genre} className={`text-xs px-2 py-1 bg-dark-200 text-gray-300 rounded-full ${
                            viewMode === 'compact' ? 'text-xs px-1.5 py-0.5' : ''
                          }`}>
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions Menu */}
                  {showQuickActions === s.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute top-full right-0 mt-2 bg-dark-100 border border-dark-200 rounded-lg shadow-xl z-10 min-w-48"
                    >
                      {getQuickActions(s).map((action) => {
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
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No series found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No series match your search for "${searchQuery}"`
                  : 'Try adjusting your filters or search terms'
                }
              </p>
              {(searchQuery || genres.length > 0 || year || rating || moodFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setMoodFilter('')
                    dispatch(clearFilters())
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

