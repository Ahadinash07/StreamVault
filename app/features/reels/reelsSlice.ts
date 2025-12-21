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
  currentIndex: number
  isMuted: boolean
  isFullscreen: boolean
  filteredReels: Reel[]
  activeFilter: 'all' | 'trending' | 'original' | 'trailers' | 'clips'
  volume: number
  videoProgress: number
  videoDuration: number
  currentTime: number
  videoLoading: boolean
  videoError: string | null
}

const initialState: ReelsState = {
  reels: mockReels,
  currentReel: null,
  isPlaying: false,
  likedReels: [],
  watchedReels: [],
  loading: false,
  error: null,
  currentIndex: 0,
  isMuted: true,
  isFullscreen: false,
  filteredReels: mockReels,
  activeFilter: 'all',
  volume: 1,
  videoProgress: 0,
  videoDuration: 0,
  currentTime: 0,
  videoLoading: true,
  videoError: null,
}

const reelsSlice = createSlice({
  name: 'reels',
  initialState,
  reducers: {
    setCurrentReel: (state, action: PayloadAction<Reel | null>) => {
      state.currentReel = action.payload
      state.isPlaying = !!action.payload
      if (action.payload) {
        const index = state.filteredReels.findIndex(reel => reel.id === action.payload!.id)
        state.currentIndex = index >= 0 ? index : 0
      }
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload
      if (state.filteredReels[action.payload]) {
        state.currentReel = state.filteredReels[action.payload]
        state.isPlaying = true
      }
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
    toggleMute: (state) => {
      state.isMuted = !state.isMuted
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload))
    },
    setVideoProgress: (state, action: PayloadAction<number>) => {
      state.videoProgress = action.payload
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.videoDuration = action.payload
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
    setVideoLoading: (state, action: PayloadAction<boolean>) => {
      state.videoLoading = action.payload
    },
    setVideoError: (state, action: PayloadAction<string | null>) => {
      state.videoError = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    filterReels: (state, action: PayloadAction<{ type?: Reel['type'], trending?: boolean, original?: boolean }>) => {
      const { type, trending, original } = action.payload
      let filtered = [...state.reels]

      if (type) {
        filtered = filtered.filter(reel => reel.type === type)
      }
      if (trending !== undefined) {
        filtered = filtered.filter(reel => reel.isTrending === trending)
      }
      if (original !== undefined) {
        filtered = filtered.filter(reel => reel.isOriginal === original)
      }

      state.filteredReels = filtered
      state.currentIndex = 0
      state.currentReel = filtered[0] || null
    },
    setActiveFilter: (state, action: PayloadAction<ReelsState['activeFilter']>) => {
      state.activeFilter = action.payload

      let filtered = [...state.reels]

      switch (action.payload) {
        case 'trending':
          filtered = filtered.filter(reel => reel.isTrending)
          break
        case 'original':
          filtered = filtered.filter(reel => reel.isOriginal)
          break
        case 'trailers':
          filtered = filtered.filter(reel => reel.type === 'trailer')
          break
        case 'clips':
          filtered = filtered.filter(reel => reel.type === 'clip')
          break
        case 'all':
        default:
          // No filtering
          break
      }

      state.filteredReels = filtered
      state.currentIndex = 0
      state.currentReel = filtered[0] || null
      state.isPlaying = !!filtered[0]
    },
    nextReel: (state) => {
      if (state.currentIndex < state.filteredReels.length - 1) {
        state.currentIndex += 1
        state.currentReel = state.filteredReels[state.currentIndex]
        state.isPlaying = true
      }
    },
    prevReel: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1
        state.currentReel = state.filteredReels[state.currentIndex]
        state.isPlaying = true
      }
    },
    addReel: (state, action: PayloadAction<Reel>) => {
      state.reels.push(action.payload)
      if (state.activeFilter === 'all') {
        state.filteredReels.push(action.payload)
      }
    },
    removeReel: (state, action: PayloadAction<string>) => {
      state.reels = state.reels.filter(reel => reel.id !== action.payload)
      state.filteredReels = state.filteredReels.filter(reel => reel.id !== action.payload)

      // Adjust current index if necessary
      if (state.currentIndex >= state.filteredReels.length) {
        state.currentIndex = Math.max(0, state.filteredReels.length - 1)
        state.currentReel = state.filteredReels[state.currentIndex] || null
      }
    },
    updateReelStats: (state, action: PayloadAction<{ reelId: string, views?: number, likes?: number, shares?: number }>) => {
      const { reelId, views, likes, shares } = action.payload
      const reel = state.reels.find(r => r.id === reelId)
      if (reel) {
        if (views !== undefined) reel.views = views
        if (likes !== undefined) reel.likes = likes
        if (shares !== undefined) reel.shares = shares
      }
    },
  },
})

export const {
  setCurrentReel,
  setCurrentIndex,
  togglePlayPause,
  likeReel,
  markReelWatched,
  shareReel,
  toggleMute,
  toggleFullscreen,
  setVolume,
  setVideoProgress,
  setVideoDuration,
  setCurrentTime,
  setVideoLoading,
  setVideoError,
  setLoading,
  setError,
  filterReels,
  setActiveFilter,
  nextReel,
  prevReel,
  addReel,
  removeReel,
  updateReelStats,
} = reelsSlice.actions

export default reelsSlice.reducer