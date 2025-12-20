'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../hooks'
import {
  FiGrid,
  FiList,
  FiSearch,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiTrash2,
  FiPlay,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiThumbsUp,
  FiMessageCircle,
  FiPlus,
  FiCalendar,
  FiTag,
  FiDownload,
  FiShare
} from 'react-icons/fi'
import { Movie, Series } from '@/types/content'
import { addNotification } from '../features/notifications/notificationsSlice'

type ContentItem = Movie | Series

export default function MyListPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'watchlist'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title' | 'year'>('recent')
  const [filterType, setFilterType] = useState<'all' | 'movies' | 'series'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const favoriteMovies = useMemo(() => {
    if (!user?.favorites || user.favorites.length === 0) return []
    return movies.filter((m) => user.favorites.includes(m.id))
  }, [user, movies])

  const favoriteSeries = useMemo(() => {
    if (!user?.favorites || user.favorites.length === 0) return []
    return series.filter((s) => user.favorites.includes(s.id))
  }, [user, series])

  const watchlistMovies = useMemo(() => {
    if (!user?.watchlist || user.watchlist.length === 0) return []
    return movies.filter((m) => user.watchlist.includes(m.id))
  }, [user, movies])

  const watchlistSeries = useMemo(() => {
    if (!user?.watchlist || user.watchlist.length === 0) return []
    return series.filter((s) => user.watchlist.includes(s.id))
  }, [user, series])

  // Combined content with metadata
  const allContent = useMemo(() => {
    const content: Array<ContentItem & { type: 'movie' | 'series'; listType: 'favorite' | 'watchlist'; addedDate?: string }> = []

    favoriteMovies.forEach(movie => content.push({ ...movie, type: 'movie', listType: 'favorite' }))
    favoriteSeries.forEach(s => content.push({ ...s, type: 'series', listType: 'favorite' }))
    watchlistMovies.forEach(movie => content.push({ ...movie, type: 'movie', listType: 'watchlist' }))
    watchlistSeries.forEach(s => content.push({ ...s, type: 'series', listType: 'watchlist' }))

    return content
  }, [favoriteMovies, favoriteSeries, watchlistMovies, watchlistSeries])

  // Filtered and sorted content
  const filteredContent = useMemo(() => {
    let filtered = allContent

    // Tab filter
    if (activeTab === 'favorites') {
      filtered = filtered.filter(item => item.listType === 'favorite')
    } else if (activeTab === 'watchlist') {
      filtered = filtered.filter(item => item.listType === 'watchlist')
    }

    // Type filter
    if (filterType === 'movies') {
      filtered = filtered.filter(item => item.type === 'movie')
    } else if (filterType === 'series') {
      filtered = filtered.filter(item => item.type === 'series')
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'title':
          return a.title.localeCompare(b.title)
        case 'year':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        default: // recent
          return 0 // In real app, would sort by added date
      }
    })

    return filtered
  }, [allContent, activeTab, filterType, searchQuery, sortBy])

  // Quick actions for content items
  const getQuickActions = (item: ContentItem & { type: 'movie' | 'series'; listType: 'favorite' | 'watchlist' }) => [
    {
      id: 'play',
      label: 'Play Now',
      icon: FiPlay,
      action: () => {
        // Navigate to content page
        window.location.href = `/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`
      }
    },
    {
      id: item.listType === 'favorite' ? 'remove-favorite' : 'add-favorite',
      label: item.listType === 'favorite' ? 'Remove from Favorites' : 'Add to Favorites',
      icon: FiHeart,
      action: () => {
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: item.listType === 'favorite' ? 'Removed from Favorites' : 'Added to Favorites',
          message: `${item.title} ${item.listType === 'favorite' ? 'removed from' : 'added to'} favorites`,
          timestamp: new Date().toISOString(),
          isRead: false
        }))
      }
    },
    {
      id: item.listType === 'watchlist' ? 'remove-watchlist' : 'add-watchlist',
      label: item.listType === 'watchlist' ? 'Remove from Watchlist' : 'Add to Watchlist',
      icon: FiBookmark,
      action: () => {
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: item.listType === 'watchlist' ? 'Removed from Watchlist' : 'Added to Watchlist',
          message: `${item.title} ${item.listType === 'watchlist' ? 'removed from' : 'added to'} watchlist`,
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
          url: `${window.location.origin}/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`
        }) || navigator.clipboard.writeText(`${window.location.origin}/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <FiBookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
              <p className="text-gray-400 text-lg mb-6">Please sign in to view and manage your personal list</p>
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
                  My List
                </h1>
                <p className="text-gray-400 text-lg">
                  Your personal collection of favorites and watchlist items
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your list..."
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
                  { id: 'all', label: 'All Items', count: allContent.length },
                  { id: 'favorites', label: 'Favorites', count: favoriteMovies.length + favoriteSeries.length },
                  { id: 'watchlist', label: 'Watchlist', count: watchlistMovies.length + watchlistSeries.length }
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
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 bg-dark-100 border border-dark-200 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Types</option>
                  <option value="movies">Movies Only</option>
                  <option value="series">Series Only</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-dark-100 border border-dark-200 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="recent">Recently Added</option>
                  <option value="rating">Highest Rated</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="year">Newest First</option>
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
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showFilters ? 'bg-purple-600 text-white' : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
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
                      Advanced Organization
                    </h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-dark-200 rounded-lg transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* List Statistics */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Your Collection</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Items</span>
                          <span className="text-white font-medium">{allContent.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Favorites</span>
                          <span className="text-purple-400 font-medium">{favoriteMovies.length + favoriteSeries.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Watchlist</span>
                          <span className="text-blue-400 font-medium">{watchlistMovies.length + watchlistSeries.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Movies</span>
                          <span className="text-green-400 font-medium">{favoriteMovies.length + watchlistMovies.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Series</span>
                          <span className="text-yellow-400 font-medium">{favoriteSeries.length + watchlistSeries.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Quick Actions</h3>
                      <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-dark-200 transition-colors rounded-lg">
                          <FiShare2 className="w-4 h-4" />
                          <span className="text-sm">Share My List</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-dark-200 transition-colors rounded-lg">
                          <FiCalendar className="w-4 h-4" />
                          <span className="text-sm">Create Watch Party</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-dark-200 transition-colors rounded-lg">
                          <FiTag className="w-4 h-4" />
                          <span className="text-sm">Create Custom List</span>
                        </button>
                      </div>
                    </div>

                    {/* Export Options */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Export & Backup</h3>
                      <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-dark-200 transition-colors rounded-lg">
                          <FiDownload className="w-4 h-4" />
                          <span className="text-sm">Export as CSV</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-dark-200 transition-colors rounded-lg">
                          <FiShare className="w-4 h-4" />
                          <span className="text-sm">Backup to Cloud</span>
                        </button>
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
                Showing <span className="text-white font-medium">{filteredContent.length}</span> {filteredContent.length === 1 ? 'item' : 'items'}
                {searchQuery && (
                  <span> for "<span className="text-purple-400">{searchQuery}</span>"</span>
                )}
              </p>
              {filterType !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 border border-purple-600/30 rounded-full">
                  <span className="text-purple-400 text-sm">
                    {filterType === 'movies' ? 'Movies Only' : 'Series Only'}
                  </span>
                  <button
                    onClick={() => setFilterType('all')}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Grid/List */}
          {filteredContent.length > 0 ? (
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
              {filteredContent.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.listType}`}
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
                  <Link href={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`}>
                    <div className={`relative ${
                      viewMode === 'list'
                        ? 'w-24 h-36 flex-shrink-0'
                        : viewMode === 'compact'
                        ? 'w-16 h-24 flex-shrink-0'
                        : 'aspect-[2/3]'
                    } rounded-lg overflow-hidden bg-dark-100`}>
                      <Image
                        src={item.poster}
                        alt={item.title}
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
                      <div className="absolute top-2 left-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          item.listType === 'favorite' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {item.listType === 'favorite' ? '♥' : '★'}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 mb-1">
                          <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs font-medium">{item.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-white text-xs line-clamp-2">{item.title}</p>
                      </div>
                    </div>
                  </Link>

                  {viewMode !== 'grid' && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded text-white ${
                              item.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'
                            }`}>
                              {item.type}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              item.listType === 'favorite' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                            }`}>
                              {item.listType}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setShowQuickActions(showQuickActions === `${item.id}-${item.listType}` ? null : `${item.id}-${item.listType}`)
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
                          <span className="text-yellow-400 text-xs font-medium">{item.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-400 text-xs">{new Date(item.releaseDate).getFullYear()}</span>
                      </div>

                      {viewMode === 'list' && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{item.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {item.genres?.slice(0, viewMode === 'compact' ? 2 : 3).map(genre => (
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
                  {showQuickActions === `${item.id}-${item.listType}` && (
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
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FiBookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchQuery ? 'No items found' : 'Your list is empty'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No items match your search for "${searchQuery}"`
                  : 'Start adding movies and series to your favorites and watchlist to see them here'
                }
              </p>
              {(searchQuery || filterType !== 'all' || activeTab !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterType('all')
                    setActiveTab('all')
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

