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
import ThemeProvider from '@/components/ThemeProvider'
import UpgradePrompt from './components/UpgradePrompt'
import { useUpgradePrompt } from './hooks/subscription'

// Initialize store with data
if (typeof window !== 'undefined') {
  // Load mock data - movies and series are now initialized in slices
  // store.dispatch(setMovies(mockMovies))
  // store.dispatch(setFeaturedMovie(mockMovies[0]))
  // store.dispatch(setTrendingMovies(mockMovies.slice(0, 5)))
  // store.dispatch(setTopRatedMovies(mockMovies.slice().sort((a, b) => b.rating - a.rating).slice(0, 5)))
  // store.dispatch(setNewReleases(mockMovies.slice().sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 5)))

  // store.dispatch(setSeries(mockSeries))
  // store.dispatch(setFeaturedSeries(mockSeries[0]))
  // store.dispatch(setTrendingSeries(mockSeries.slice(0, 3)))
  // store.dispatch(setTopRatedSeries(mockSeries.slice().sort((a, b) => b.rating - a.rating).slice(0, 3)))

  // Initialize mock notifications with comprehensive data
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
      actionUrl: '/friends',
      actionText: 'Accept Request',
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
      actionUrl: '/watch-party/invite-123',
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
      actionUrl: '/series/stranger-things',
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
      actionUrl: '/profile/gamingpro99',
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
  // Note: Notifications are now initialized in the notifications pages themselves
  // to ensure they load when accessed directly
  // store.dispatch(setNotifications(mockNotifications))

  // Initialize default subscription (free plan)
  const defaultSubscription = {
    id: 'sub-free',
    planId: 'free' as const,
    status: 'active' as const,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    paymentMethod: null,
    autoRenew: false
  }
  store.dispatch(setSubscription(defaultSubscription))

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
        <UpgradePromptWrapper />
      </ThemeProvider>
    </Provider>
  )
}

function UpgradePromptWrapper() {
  const { isVisible, hide } = useUpgradePrompt()

  return (
    <UpgradePrompt
      isVisible={isVisible}
      onClose={hide}
    />
  )
}

