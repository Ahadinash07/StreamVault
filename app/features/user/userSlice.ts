import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  watchHistory: string[]
  favorites: string[]
  watchlist: string[]
  profiles: UserProfile[]
  currentProfile: string
}

interface UserProfile {
  id: string
  name: string
  avatar: string
  isKid: boolean
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (state.user && !state.user.favorites.includes(action.payload)) {
        state.user.favorites.push(action.payload)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.favorites = state.user.favorites.filter(
          (id) => id !== action.payload
        )
      }
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (state.user && !state.user.watchlist.includes(action.payload)) {
        state.user.watchlist.push(action.payload)
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.watchlist = state.user.watchlist.filter(
          (id) => id !== action.payload
        )
      }
    },
    addToWatchHistory: (state, action: PayloadAction<string>) => {
      if (state.user) {
        if (!state.user.watchHistory.includes(action.payload)) {
          state.user.watchHistory.unshift(action.payload)
          if (state.user.watchHistory.length > 100) {
            state.user.watchHistory = state.user.watchHistory.slice(0, 100)
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setUser,
  login,
  logout,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  addToWatchHistory,
  setLoading,
  setError,
} = userSlice.actions

export default userSlice.reducer

