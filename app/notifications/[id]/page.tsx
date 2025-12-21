'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { markAsRead, removeNotification } from '../../features/notifications/notificationsSlice'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import {
  FiArrowLeft,
  FiTrash2,
  FiShare,
  FiHeart,
  FiMessageCircle,
  FiStar,
  FiPlay,
  FiBookmark,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
  FiChevronRight,
  FiUser,
  FiCalendar,
  FiClock
} from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function NotificationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { notifications } = useAppSelector((state) => state.notifications)
  const { user } = useAppSelector((state) => state.user)
  const { movies } = useAppSelector((state) => state.movies)
  const allSeries = useAppSelector((state) => state.series)

  const [notification, setNotification] = useState<any>(null)
  const [relatedContent, setRelatedContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const notificationId = params.id as string

  useEffect(() => {
    const foundNotification = notifications.find(n => n.id === notificationId)
    if (foundNotification) {
      setNotification(foundNotification)

      // Mark as read if not already
      if (!foundNotification.isRead) {
        dispatch(markAsRead(notificationId))
      }

      // Find related content if it exists
      if (foundNotification.relatedContent) {
        const { type, id } = foundNotification.relatedContent
        let content = null

        if (type === 'movie') {
          content = movies.find(m => m.id === id)
        } else if (type === 'series') {
          // Search in all series arrays
          content = allSeries.series?.find(s => s.id === id) ||
                   allSeries.trendingSeries?.find(s => s.id === id) ||
                   allSeries.topRatedSeries?.find(s => s.id === id)
        }

        if (content) {
          setRelatedContent({ ...content, type })
        }
      }
    }
    setIsLoading(false)
  }, [notificationId, notifications, dispatch, movies, allSeries])

  const handleDelete = () => {
    dispatch(removeNotification(notificationId))
    router.push('/notifications')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-6 h-6 text-green-400" />
      case 'error':
        return <FiAlertTriangle className="w-6 h-6 text-red-400" />
      case 'warning':
        return <FiAlertTriangle className="w-6 h-6 text-yellow-400" />
      case 'info':
      default:
        return <FiInfo className="w-6 h-6 text-blue-400" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-400 bg-green-400/10'
      case 'error':
        return 'border-red-400 bg-red-400/10'
      case 'warning':
        return 'border-yellow-400 bg-yellow-400/10'
      case 'info':
      default:
        return 'border-blue-400 bg-blue-400/10'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-dark-100 rounded w-1/4 mb-6"></div>
              <div className="h-32 bg-dark-100 rounded mb-6"></div>
              <div className="h-64 bg-dark-100 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Notification Not Found</h1>
            <p className="text-gray-400 mb-6">The notification you're looking for doesn't exist or has been deleted.</p>
            <Link
              href="/notifications"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Notifications
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {/* Notification Detail Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-l-4 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 ${getNotificationColor(notification.type)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-white mb-2">{notification.title}</h1>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">{notification.message}</p>
                </div>
              </div>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
                title="Delete notification"
              >
                <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Notification Metadata */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 border-t border-dark-200 pt-3 sm:pt-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">
                  {new Date(notification.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <FiClock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>
                  {new Date(notification.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {notification.isRead && (
                <div className="flex items-center gap-1 sm:gap-2 text-green-400">
                  <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Read</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Related Content */}
          {relatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Related Content</h2>
              <div className="bg-dark-100 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3">
                    <div className="relative aspect-[2/3] sm:aspect-video">
                      <Image
                        src={relatedContent.poster}
                        alt={relatedContent.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          href={relatedContent.type === 'movie' ? `/movies/${relatedContent.id}` : `/series/${relatedContent.id}`}
                          className="bg-white/20 rounded-full p-3 sm:p-4 hover:bg-white/30 transition-colors"
                        >
                          <FiPlay className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 sm:w-2/3">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{relatedContent.title}</h3>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                            <span>{relatedContent.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{new Date(relatedContent.releaseDate).getFullYear()}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded text-xs ${relatedContent.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'}`}>
                            {relatedContent.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <FiBookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                          <FiShare className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3 sm:mb-4 line-clamp-3 text-sm sm:text-base">{relatedContent.description}</p>
                    {relatedContent.genres && (
                      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        {relatedContent.genres.slice(0, 4).map((genre: string) => (
                          <span key={genre} className="px-2 sm:px-3 py-1 bg-dark-200 text-gray-300 rounded-full text-xs sm:text-sm">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href={relatedContent.type === 'movie' ? `/movies/${relatedContent.id}` : `/series/${relatedContent.id}`}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Watch Now
                      <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <button
              onClick={() => router.push('/notifications')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
            >
              View All Notifications
            </button>
            {relatedContent && (
              <Link
                href={relatedContent.type === 'movie' ? `/movies/${relatedContent.id}` : `/series/${relatedContent.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-center text-sm sm:text-base"
              >
                Go to Content
              </Link>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}