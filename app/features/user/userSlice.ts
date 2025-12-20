import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { saveUserData, loadUserData, clearUserData } from '@/utils/userPersistence'

export interface User {
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

export interface UserProfile {
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
      // Save user data to localStorage
      saveUserData(action.payload)
    },
    logout: (state) => {
      if (state.user) {
        clearUserData(state.user.id)
      }
      state.user = null
      state.isAuthenticated = false
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (state.user && !state.user.favorites.includes(action.payload)) {
        state.user.favorites.push(action.payload)
        // Save to localStorage
        saveUserData(state.user)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.favorites = state.user.favorites.filter(
          (id) => id !== action.payload
        )
        // Save to localStorage
        saveUserData(state.user)
      }
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (state.user && !state.user.watchlist.includes(action.payload)) {
        state.user.watchlist.push(action.payload)
        // Save to localStorage
        saveUserData(state.user)
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.watchlist = state.user.watchlist.filter(
          (id) => id !== action.payload
        )
        // Save to localStorage
        saveUserData(state.user)
      }
    },
    addToWatchHistory: (state, action: PayloadAction<string>) => {
      if (state.user) {
        if (!state.user.watchHistory.includes(action.payload)) {
          state.user.watchHistory.unshift(action.payload)
          if (state.user.watchHistory.length > 100) {
            state.user.watchHistory = state.user.watchHistory.slice(0, 100)
          }
          // Save to localStorage
          saveUserData(state.user)
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    loadUserFromStorage: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      const userData = loadUserData(userId)
      if (userData) {
        state.user = userData
        state.isAuthenticated = true
        state.error = null
      }
    },
    saveUserToStorage: (state) => {
      if (state.user) {
        saveUserData(state.user)
      }
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
  loadUserFromStorage,
  saveUserToStorage,
} = userSlice.actions

export default userSlice.reducer

