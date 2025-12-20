'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import {
  FiPlay,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiZap,
  FiRefreshCw,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiThumbsUp,
  FiMessageCircle,
  FiPlus,
  FiX,
  FiSettings,
  FiUsers,
  FiHeart as FiHeartSolid,
  FiBookmark as FiBookmarkSolid
} from 'react-icons/fi'
import { addNotification } from '@/app/features/notifications/notificationsSlice'
import { toggleSectionExpanded, hideSection, addFavoriteSection, removeFavoriteSection, trackSectionInteraction } from '@/app/features/contentSections/contentSectionsSlice'

interface ContentSectionProps {
  sectionId: string
  title: string
  subtitle?: string
  items: any[]
  type: 'recommended' | 'trending' | 'top_rated' | 'new_releases' | 'mood_based' | 'genre_based' | 'language_based' | 'country_based' | 'decade_based' | 'because_watched' | 'ai_mood' | 'seasonal' | 'critically_acclaimed' | 'award_winners' | 'hidden_gems' | 'cult_classics' | 'family_favorites' | 'solo_watch' | 'group_watch' | 'quick_watch' | 'marathon_ready'
  viewMode?: 'grid' | 'list' | 'compact'
  maxItems?: number
  showViewAll?: boolean
  viewAllLink?: string
  showControls?: boolean
  isExpandable?: boolean
  isExpanded?: boolean
  priority?: number
  metadata?: any
  className?: string
}

export default function ContentSection({
  sectionId,
  title,
  subtitle,
  items,
  type,
  viewMode = 'grid',
  maxItems = 12,
  showViewAll = true,
  viewAllLink,
  showControls = true,
  isExpandable = false,
  isExpanded = false,
  priority = 1,
  metadata,
  className = ''
}: ContentSectionProps) {
  const dispatch = useAppDispatch()
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const controls = useAnimation()

  const { user } = useAppSelector((state) => state.user)
  const { userPreferences } = useAppSelector((state) => state.contentSections)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const displayedItems = items.slice(0, isExpanded ? items.length : maxItems)

  // Get section-specific styling
  const getSectionStyling = () => {
    switch (type) {
      case 'trending':
        return {
          titleColor: 'text-red-400',
          accentColor: 'border-red-500/20 bg-red-500/5',
          icon: FiTrendingUp
        }
      case 'ai_mood':
        return {
          titleColor: 'text-purple-400',
          accentColor: 'border-purple-500/20 bg-purple-500/5',
          icon: FiZap
        }
      case 'mood_based':
        return {
          titleColor: 'text-pink-400',
          accentColor: 'border-pink-500/20 bg-pink-500/5',
          icon: FiHeart
        }
      case 'top_rated':
        return {
          titleColor: 'text-yellow-400',
          accentColor: 'border-yellow-500/20 bg-yellow-500/5',
          icon: FiStar
        }
      case 'new_releases':
        return {
          titleColor: 'text-green-400',
          accentColor: 'border-green-500/20 bg-green-500/5',
          icon: FiClock
        }
      case 'because_watched':
        return {
          titleColor: 'text-blue-400',
          accentColor: 'border-blue-500/20 bg-blue-500/5',
          icon: FiEye
        }
      case 'critically_acclaimed':
        return {
          titleColor: 'text-orange-400',
          accentColor: 'border-orange-500/20 bg-orange-500/5',
          icon: FiThumbsUp
        }
      case 'award_winners':
        return {
          titleColor: 'text-amber-400',
          accentColor: 'border-amber-500/20 bg-amber-500/5',
          icon: FiStar
        }
      case 'hidden_gems':
        return {
          titleColor: 'text-emerald-400',
          accentColor: 'border-emerald-500/20 bg-emerald-500/5',
          icon: FiEye
        }
      case 'cult_classics':
        return {
          titleColor: 'text-indigo-400',
          accentColor: 'border-indigo-500/20 bg-indigo-500/5',
          icon: FiTrendingUp
        }
      case 'family_favorites':
        return {
          titleColor: 'text-cyan-400',
          accentColor: 'border-cyan-500/20 bg-cyan-500/5',
          icon: FiHeart
        }
      case 'solo_watch':
        return {
          titleColor: 'text-violet-400',
          accentColor: 'border-violet-500/20 bg-violet-500/5',
          icon: FiEye
        }
      case 'group_watch':
        return {
          titleColor: 'text-rose-400',
          accentColor: 'border-rose-500/20 bg-rose-500/5',
          icon: FiUsers
        }
      case 'quick_watch':
        return {
          titleColor: 'text-lime-400',
          accentColor: 'border-lime-500/20 bg-lime-500/5',
          icon: FiClock
        }
      case 'marathon_ready':
        return {
          titleColor: 'text-teal-400',
          accentColor: 'border-teal-500/20 bg-teal-500/5',
          icon: FiZap
        }
      default:
        return {
          titleColor: 'text-white',
          accentColor: 'border-gray-500/20 bg-gray-500/5',
          icon: FiPlay
        }
    }
  }

  const styling = getSectionStyling()
  const IconComponent = styling.icon

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Section Refreshed',
      message: `${title} has been updated with fresh content`,
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const handleQuickAction = (item: any, action: string) => {
    dispatch(trackSectionInteraction({
      sectionId,
      interactionType: 'click',
      contentId: item.id
    }))

    switch (action) {
      case 'watchlist':
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: user?.watchlist?.includes(item.id) ? 'Removed from Watchlist' : 'Added to Watchlist',
          message: `${item.title} ${user?.watchlist?.includes(item.id) ? 'removed from' : 'added to'} your watchlist`,
          timestamp: new Date().toISOString(),
          isRead: false
        }))
        break
      case 'favorite':
        dispatch(addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: user?.favorites?.includes(item.id) ? 'Removed from Favorites' : 'Added to Favorites',
          message: `${item.title} ${user?.favorites?.includes(item.id) ? 'removed from' : 'added to'} favorites`,
          timestamp: new Date().toISOString(),
          isRead: false
        }))
        break
      case 'share':
        navigator.share?.({
          title: item.title,
          text: `Check out ${item.title} on Aurora Play!`,
          url: window.location.origin + (item.type === 'movie' ? `/movies/${item.id}` : `/series/${item.id}`)
        })
        break
    }
    setShowQuickActions(null)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  }

  if (displayedItems.length === 0) return null

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={`mb-8 md:mb-12 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {/* Section Header */}
      <div className={`rounded-xl border ${styling.accentColor} p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${styling.accentColor} border`}>
              <IconComponent className={`w-6 h-6 ${styling.titleColor}`} />
            </div>
            <div>
              <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold ${styling.titleColor}`}>
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-400 text-sm md:text-base mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Section Controls */}
          {showControls && (
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-dark-100 hover:bg-dark-200 transition-colors disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>

              {/* Settings Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg bg-dark-100 hover:bg-dark-200 transition-colors"
                >
                  <FiSettings className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-dark-100 rounded-lg border border-dark-200 shadow-xl z-50"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            if (userPreferences.favoriteSections.includes(sectionId)) {
                              dispatch(removeFavoriteSection(sectionId))
                            } else {
                              dispatch(addFavoriteSection(sectionId))
                            }
                            setShowSettings(false)
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-dark-200 rounded-md transition-colors"
                        >
                          {userPreferences.favoriteSections.includes(sectionId) ? (
                            <FiHeartSolid className="w-4 h-4 text-red-400" />
                          ) : (
                            <FiHeart className="w-4 h-4" />
                          )}
                          <span className="text-sm">
                            {userPreferences.favoriteSections.includes(sectionId) ? 'Remove from Favorites' : 'Add to Favorites'}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            dispatch(hideSection(sectionId))
                            setShowSettings(false)
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-red-400 hover:bg-dark-200 rounded-md transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                          <span className="text-sm">Hide Section</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Expand/Collapse Button */}
              {isExpandable && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(toggleSectionExpanded(sectionId))}
                  className="p-2 rounded-lg bg-dark-100 hover:bg-dark-200 transition-colors"
                >
                  {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </motion.button>
              )}

              {/* View All Button */}
              {showViewAll && viewAllLink && (
                <Link
                  href={viewAllLink}
                  className={`text-${styling.titleColor.split('-')[1]}-400 hover:text-${styling.titleColor.split('-')[1]}-300 transition-colors font-medium flex items-center gap-2`}
                >
                  View All
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Content Grid/List */}
        <motion.div
          variants={containerVariants}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : viewMode === 'compact'
              ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'
              : 'space-y-4'
          }
        >
          <AnimatePresence>
            {displayedItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className={`group relative ${viewMode === 'list' ? 'flex gap-4 bg-dark-100 rounded-lg p-4' : ''}`}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link
                  href={item.type === 'movie' ? `/movies/${item.id}` : `/series/${item.id}`}
                  onClick={() => dispatch(trackSectionInteraction({
                    sectionId,
                    interactionType: 'click',
                    contentId: item.id,
                    position: index
                  }))}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-24 h-36 flex-shrink-0' : viewMode === 'compact' ? 'aspect-[2/3]' : 'aspect-[2/3]'} rounded-lg overflow-hidden bg-dark-100`}>
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes={
                        viewMode === 'grid'
                          ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                          : viewMode === 'compact'
                          ? "(max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                          : "96px"
                      }
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <FiPlay className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                        <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs line-clamp-2 mb-1">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{item.year}</span>
                        <span>•</span>
                        <span>{item.genres?.[0]}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Quick Actions Menu */}
                <AnimatePresence>
                  {showQuickActions === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-dark-100 rounded-lg border border-dark-200 shadow-xl z-50"
                    >
                      <div className="p-2">
                        {[
                          {
                            id: 'watchlist',
                            label: user?.watchlist?.includes(item.id) ? 'Remove from Watchlist' : 'Add to Watchlist',
                            icon: user?.watchlist?.includes(item.id) ? FiBookmarkSolid : FiBookmark,
                            color: 'text-blue-400'
                          },
                          {
                            id: 'favorite',
                            label: user?.favorites?.includes(item.id) ? 'Remove from Favorites' : 'Add to Favorites',
                            icon: user?.favorites?.includes(item.id) ? FiHeartSolid : FiHeart,
                            color: 'text-red-400'
                          },
                          {
                            id: 'share',
                            label: 'Share',
                            icon: FiShare2,
                            color: 'text-green-400'
                          }
                        ].map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleQuickAction(item, action.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-dark-200 rounded-md transition-colors"
                          >
                            <action.icon className={`w-4 h-4 ${action.color}`} />
                            <span className="text-sm">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Actions Trigger */}
                <button
                  onClick={() => setShowQuickActions(showQuickActions === item.id ? null : item.id)}
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 rounded-full p-2"
                >
                  <FiPlus className="w-4 h-4 text-white" />
                </button>

                {/* List View Additional Info */}
                {viewMode === 'list' && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <FiStar className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{item.year}</span>
                      <span>•</span>
                      <span>{item.duration}min</span>
                      <span>•</span>
                      <div className="flex gap-1">
                        {item.genres?.slice(0, 2).map((genre: string) => (
                          <span key={genre} className="bg-dark-200 px-2 py-1 rounded">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show More/Less Button */}
        {isExpandable && items.length > maxItems && (
          <div className="flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleSectionExpanded(sectionId))}
              className={`px-6 py-3 rounded-lg border ${styling.accentColor} ${styling.titleColor} border-current hover:bg-current hover:text-black transition-colors font-medium flex items-center gap-2`}
            >
              {isExpanded ? (
                <>
                  <FiChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <FiChevronDown className="w-4 h-4" />
                  Show More ({items.length - maxItems} more)
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}