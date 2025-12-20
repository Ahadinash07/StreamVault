import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Reel } from '@/types/content'
import { mockReels } from '@/data/reelsData'

interface ReelsState {
  reels: Reel[]
  currentReel: Reel | null
  isPlaying: boolean
  likedReels: string[]
  watchedReels: string[]
  loading: boolean
  error: string | null
}

const initialState: ReelsState = {
  reels: mockReels,
  currentReel: null,
  isPlaying: false,
  likedReels: [],
  watchedReels: [],
  loading: false,
  error: null,
}

const reelsSlice = createSlice({
  name: 'reels',
  initialState,
  reducers: {
    setCurrentReel: (state, action: PayloadAction<Reel | null>) => {
      state.currentReel = action.payload
      state.isPlaying = !!action.payload
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying
    },
    likeReel: (state, action: PayloadAction<string>) => {
      const reelId = action.payload
      const reel = state.reels.find(r => r.id === reelId)
      if (reel) {
        if (state.likedReels.includes(reelId)) {
          state.likedReels = state.likedReels.filter(id => id !== reelId)
          reel.likes -= 1
        } else {
          state.likedReels.push(reelId)
          reel.likes += 1
        }
      }
    },
    markReelWatched: (state, action: PayloadAction<string>) => {
      const reelId = action.payload
      if (!state.watchedReels.includes(reelId)) {
        state.watchedReels.push(reelId)
        const reel = state.reels.find(r => r.id === reelId)
        if (reel) {
          reel.views += 1
        }
      }
    },
    shareReel: (state, action: PayloadAction<string>) => {
      const reelId = action.payload
      const reel = state.reels.find(r => r.id === reelId)
      if (reel) {
        reel.shares += 1
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    filterReels: (state, action: PayloadAction<{ type?: Reel['type'], trending?: boolean, original?: boolean }>) => {
      // This would be used for filtering logic
      // For now, we'll keep all reels but mark this for future enhancement
    },
  },
})

export const {
  setCurrentReel,
  togglePlayPause,
  likeReel,
  markReelWatched,
  shareReel,
  setLoading,
  setError,
  filterReels,
} = reelsSlice.actions

export default reelsSlice.reducer