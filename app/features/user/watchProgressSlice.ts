import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { saveWatchProgress, loadWatchProgress } from '@/utils/userPersistence'

export interface WatchProgress {
  contentId: string
  episodeId?: string
  seasonId?: string
  currentTime: number
  duration: number
  lastWatched: string
  type: 'movie' | 'series'
}

interface WatchProgressState {
  progress: Record<string, WatchProgress>
  userId: string | null
}

const initialState: WatchProgressState = {
  progress: {},
  userId: null,
}

const watchProgressSlice = createSlice({
  name: 'watchProgress',
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<WatchProgress>) => {
      const key = action.payload.episodeId 
        ? `${action.payload.contentId}-${action.payload.seasonId}-${action.payload.episodeId}`
        : action.payload.contentId
      state.progress[key] = {
        ...action.payload,
        lastWatched: new Date().toISOString(),
      }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveWatchProgress(state.userId, state.progress)
      }
    },
    removeProgress: (state, action: PayloadAction<string>) => {
      delete state.progress[action.payload]
      // Save to localStorage if userId is set
      if (state.userId) {
        saveWatchProgress(state.userId, state.progress)
      }
    },
    clearAllProgress: (state) => {
      state.progress = {}
      // Save to localStorage if userId is set
      if (state.userId) {
        saveWatchProgress(state.userId, {})
      }
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    loadProgressFromStorage: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      state.userId = userId
      state.progress = loadWatchProgress(userId)
    },
  },
})

export const { updateProgress, removeProgress, clearAllProgress, setUserId, loadProgressFromStorage } = watchProgressSlice.actions
export default watchProgressSlice.reducer

