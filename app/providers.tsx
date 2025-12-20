'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import { StoreInitializer } from './StoreInitializer'
import { mockMovies, mockSeries } from '@/data/mockData'
import { loadFromLocalStorage } from '@/utils/localStorage'
import { setMovies, setFeaturedMovie, setTrendingMovies, setTopRatedMovies, setNewReleases } from './features/movies/moviesSlice'
import { setSeries, setFeaturedSeries, setTrendingSeries, setTopRatedSeries } from './features/series/seriesSlice'
import { setUser, loadUserFromStorage } from './features/user/userSlice'
import { setSubscription } from './features/subscription/subscriptionSlice'
import { loadProgressFromStorage } from './features/user/watchProgressSlice'
import { loadSettingsFromStorage } from './features/settings/settingsSlice'
import { setNotifications } from './features/notifications/notificationsSlice'
import ThemeProvider from '@/components/ThemeProvider'

// Initialize store with data
if (typeof window !== 'undefined') {
  // Load mock data
  store.dispatch(setMovies(mockMovies))
  store.dispatch(setFeaturedMovie(mockMovies[0]))
  store.dispatch(setTrendingMovies(mockMovies.slice(0, 5)))
  store.dispatch(setTopRatedMovies(mockMovies.slice().sort((a, b) => b.rating - a.rating).slice(0, 5)))
  store.dispatch(setNewReleases(mockMovies.slice().sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 5)))

  store.dispatch(setSeries(mockSeries))
  store.dispatch(setFeaturedSeries(mockSeries[0]))
  store.dispatch(setTrendingSeries(mockSeries.slice(0, 3)))
  store.dispatch(setTopRatedSeries(mockSeries.slice().sort((a, b) => b.rating - a.rating).slice(0, 3)))

  // Initialize mock notifications
  const mockNotifications = [
    {
      id: 'notif-1',
      type: 'watch_party_invite' as const,
      title: 'Watch Party Invitation',
      message: 'MovieBuff2024 invited you to watch "The Dark Knight" together',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      isRead: false,
      actionUrl: '/watch-party/party-1',
      actionText: 'Join Party',
      sender: {
        id: 'user-1',
        name: 'MovieBuff2024',
        avatar: 'https://picsum.photos/seed/user1/40/40'
      },
      relatedContent: {
        type: 'movie' as const,
        id: '1',
        title: 'The Dark Knight'
      }
    },
    {
      id: 'notif-2',
      type: 'friend_request' as const,
      title: 'New Friend Request',
      message: 'SeriesLover wants to be your friend',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isRead: false,
      actionText: 'Accept',
      sender: {
        id: 'user-2',
        name: 'SeriesLover',
        avatar: 'https://picsum.photos/seed/user2/40/40'
      }
    },
    {
      id: 'notif-3',
      type: 'content_update' as const,
      title: 'New Episode Available',
      message: 'Season 2 Episode 3 of "Stranger Things" is now available',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      isRead: true,
      actionUrl: '/series/1',
      actionText: 'Watch Now',
      relatedContent: {
        type: 'series' as const,
        id: '1',
        title: 'Stranger Things'
      }
    },
    {
      id: 'notif-4',
      type: 'achievement' as const,
      title: 'Achievement Unlocked!',
      message: 'Congratulations! You\'ve watched 10 movies this month',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      isRead: true,
      actionUrl: '/profile',
      actionText: 'View Profile'
    },
    {
      id: 'notif-5',
      type: 'new_follower' as const,
      title: 'New Follower',
      message: 'Cinephile99 started following you',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      isRead: true,
      sender: {
        id: 'user-3',
        name: 'Cinephile99',
        avatar: 'https://picsum.photos/seed/user3/40/40'
      }
    }
  ]
  store.dispatch(setNotifications(mockNotifications))

  // Load user data from localStorage (legacy support)
  const savedUser = loadFromLocalStorage('user', null) as any
  if (savedUser && savedUser.id) {
    store.dispatch(setUser(savedUser))
    // Load user-specific data
    store.dispatch(loadUserFromStorage(savedUser.id))
    store.dispatch(loadProgressFromStorage(savedUser.id))
    store.dispatch(loadSettingsFromStorage(savedUser.id))
  }

  // Load subscription data from localStorage
  const savedSubscription = loadFromLocalStorage('subscription', null)
  if (savedSubscription) {
    store.dispatch(setSubscription(savedSubscription))
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  )
}

