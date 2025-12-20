'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import { StoreInitializer } from './StoreInitializer'
import { mockMovies, mockSeries } from '@/data/mockData'
import { loadFromLocalStorage } from '@/utils/localStorage'
import { setMovies, setFeaturedMovie, setTrendingMovies, setTopRatedMovies, setNewReleases } from './features/movies/moviesSlice'
import { setSeries, setFeaturedSeries, setTrendingSeries, setTopRatedSeries } from './features/series/seriesSlice'
import { setUser } from './features/user/userSlice'
import { setSubscription } from './features/subscription/subscriptionSlice'

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

  // Load user data from localStorage
  const savedUser = loadFromLocalStorage('user', null)
  if (savedUser) {
    store.dispatch(setUser(savedUser))
  }

  // Load subscription data from localStorage
  const savedSubscription = loadFromLocalStorage('subscription', null)
  if (savedSubscription) {
    store.dispatch(setSubscription(savedSubscription))
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}

