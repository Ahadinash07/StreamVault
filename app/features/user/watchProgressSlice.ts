import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
}

const initialState: WatchProgressState = {
  progress: {},
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
    },
    removeProgress: (state, action: PayloadAction<string>) => {
      delete state.progress[action.payload]
    },
    clearAllProgress: (state) => {
      state.progress = {}
    },
  },
})

export const { updateProgress, removeProgress, clearAllProgress } = watchProgressSlice.actions
export default watchProgressSlice.reducer

