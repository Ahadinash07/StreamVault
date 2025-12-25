'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { markAsRead, markAllAsRead, removeNotification, clearAllNotifications, setNotifications } from '../features/notifications/notificationsSlice'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiUser,
  FiUsers,
  FiPlay,
  FiHeart,
  FiMessageCircle,
  FiStar,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo
} from 'react-icons/fi'
import Link from 'next/link'

export default function NotificationsPage() {
  const dispatch = useAppDispatch()
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const notificationsLoadedRef = useRef(false)

  console.log('NotificationsPage render - notifications:', notifications.length, 'unread:', unreadCount)

  // Initialize notifications if not already loaded
  useEffect(() => {
    console.log('useEffect running, notifications length:', notifications.length, 'loaded:', notificationsLoadedRef.current)
    if (!notificationsLoadedRef.current) {
      console.log('Initializing notifications...')
      const mockNotifications = [
        {
          id: 'notif-1',
          type: 'info' as const,
          title: 'Welcome to StreamVault!',
          message: 'Thanks for joining our community. Discover amazing movies, series, and gaming content.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          isRead: false,
          actionUrl: '/discover',
          actionText: 'Explore Now',
          sender: {
            id: 'system',
            name: 'StreamVault',
            avatar: 'https://picsum.photos/seed/streamvault/100/100'
          }
        },
        {
          id: 'notif-2',
          type: 'success' as const,
          title: 'Achievement Unlocked!',
          message: 'Congratulations! You\'ve watched 10 movies this month. Keep up the great work!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          isRead: false,
          actionUrl: '/gaming/achievements',
          actionText: 'View Achievements',
          sender: {
            id: 'system',
            name: 'StreamVault',
            avatar: 'https://picsum.photos/seed/achievement/100/100'
          }
        },
        {
          id: 'notif-3',
          type: 'friend_request' as const,
          title: 'New Friend Request',
          message: 'MovieBuff2024 wants to be your friend on StreamVault.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          isRead: true,
          actionUrl: '/profile',
          actionText: 'View Profile',
          sender: {
            id: 'user-123',
            name: 'MovieBuff2024',
            avatar: 'https://picsum.photos/seed/moviebuff/100/100'
          }
        },
        {
          id: 'notif-4',
          type: 'watch_party_invite' as const,
          title: 'Watch Party Invitation',
          message: 'You\'ve been invited to join a watch party for "The Dark Knight" tonight at 8 PM.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
          isRead: false,
          actionUrl: '/watch-party',
          actionText: 'Join Party',
          sender: {
            id: 'user-456',
            name: 'CinemaLover',
            avatar: 'https://picsum.photos/seed/cinemalover/100/100'
          },
          relatedContent: {
            type: 'movie' as const,
            id: 'movie-1',
            title: 'The Dark Knight'
          }
        },
        {
          id: 'notif-5',
          type: 'content_update' as const,
          title: 'New Episodes Available',
          message: 'Season 2 of "Stranger Things" is now available to watch!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          isRead: true,
          actionUrl: '/series',
          actionText: 'Watch Now',
          sender: {
            id: 'system',
            name: 'StreamVault',
            avatar: 'https://picsum.photos/seed/netflix/100/100'
          },
          relatedContent: {
            type: 'series' as const,
            id: 'series-1',
            title: 'Stranger Things'
          }
        },
        {
          id: 'notif-6',
          type: 'new_follower' as const,
          title: 'New Follower',
          message: 'GamingPro99 started following you. Check out their gaming streams!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
          isRead: false,
          actionUrl: '/profile',
          actionText: 'View Profile',
          sender: {
            id: 'user-789',
            name: 'GamingPro99',
            avatar: 'https://picsum.photos/seed/gamingpro/100/100'
          }
        },
        {
          id: 'notif-7',
          type: 'warning' as const,
          title: 'Subscription Expiring',
          message: 'Your premium subscription will expire in 3 days. Renew now to continue enjoying unlimited access.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          isRead: false,
          actionUrl: '/subscription',
          actionText: 'Renew Now',
          sender: {
            id: 'system',
            name: 'StreamVault',
            avatar: 'https://picsum.photos/seed/subscription/100/100'
          }
        },
        {
          id: 'notif-8',
          type: 'achievement' as const,
          title: 'Gaming Milestone!',
          message: 'You\'ve completed 50 games in StreamVault Gaming! You\'re officially a gaming champion.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
          isRead: true,
          actionUrl: '/gaming/achievements',
          actionText: 'View Badge',
          sender: {
            id: 'system',
            name: 'StreamVault Gaming',
            avatar: 'https://picsum.photos/seed/gaming/100/100'
          }
        }
      ]
      console.log('Dispatching notifications:', mockNotifications.length)
      dispatch(setNotifications(mockNotifications))
      notificationsLoadedRef.current = true
      console.log('Notifications dispatched and ref set')
    } else {
      console.log('Notifications already loaded:', notifications.length)
    }
  }, []) // Empty dependency array to run only once

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications

  console.log('Filtered notifications:', filteredNotifications.length, 'filter:', filter)

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleRemoveNotification = (id: string) => {
    dispatch(removeNotification(id))
  }

  const handleClearAll = () => {
    dispatch(clearAllNotifications())
  }

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(n => n !== id)
        : [...prev, id]
    )
  }

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => dispatch(markAsRead(id)))
    setSelectedNotifications([])
  }

  const handleBulkDelete = () => {
    selectedNotifications.forEach(id => dispatch(removeNotification(id)))
    setSelectedNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <FiUser className="w-5 h-5 text-blue-500" />
      case 'watch_party_invite':
        return <FiUsers className="w-5 h-5 text-purple-500" />
      case 'new_follower':
        return <FiHeart className="w-5 h-5 text-pink-500" />
      case 'content_update':
        return <FiPlay className="w-5 h-5 text-green-500" />
      case 'achievement':
        return <FiStar className="w-5 h-5 text-yellow-500" />
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <FiX className="w-5 h-5 text-red-500" />
      default:
        return <FiInfo className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'friend_request':
        return 'border-l-blue-500'
      case 'watch_party_invite':
        return 'border-l-purple-500'
      case 'new_follower':
        return 'border-l-pink-500'
      case 'content_update':
        return 'border-l-green-500'
      case 'achievement':
        return 'border-l-yellow-500'
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return notificationTime.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <FiBell className="w-8 h-8 text-blue-500" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">Notifications</h1>
                  <p className="text-gray-300 text-lg mt-2">
                    Stay updated with your activity and community
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {unreadCount} unread
                </div>
              )}
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex gap-2">
                {selectedNotifications.length > 0 && (
                  <>
                    <button
                      onClick={handleBulkMarkAsRead}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FiCheck className="w-4 h-4" />
                      Mark Read ({selectedNotifications.length})
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete ({selectedNotifications.length})
                    </button>
                  </>
                )}
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Mark All Read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-dark-100 rounded-lg border-l-4 p-4 transition-all duration-200 hover:bg-dark-200 ${
                    getNotificationColor(notification.type)
                  } ${!notification.isRead ? 'bg-dark-200/50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-dark-200 border-dark-300 rounded focus:ring-blue-500"
                    />

                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/notifications/${notification.id}`}
                            className="text-white font-semibold text-lg mb-1 hover:text-blue-400 transition-colors"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            {notification.title}
                          </Link>
                          <p className="text-gray-300 mb-2">
                            {notification.message}
                          </p>

                          {/* Sender Info */}
                          {notification.sender && (
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src={notification.sender.avatar}
                                alt={notification.sender.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-gray-400 text-sm">
                                from {notification.sender.name}
                              </span>
                            </div>
                          )}

                          {/* Related Content */}
                          {notification.relatedContent && (
                            <div className="mb-2">
                              <span className="text-gray-400 text-sm">
                                Related: {notification.relatedContent.title}
                              </span>
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="text-gray-500 text-sm">
                            {formatTimestamp(notification.timestamp)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                              title="Mark as read"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete notification"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && notification.actionText && (
                        <div className="mt-3">
                          <Link
                            href={notification.actionUrl}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            {notification.actionText}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <FiBell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </h3>
                <p className="text-gray-400">
                  {filter === 'unread'
                    ? 'You\'ve read all your notifications!'
                    : 'When you have notifications, they\'ll appear here.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}