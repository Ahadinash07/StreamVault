import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Movie, Series } from '@/types/content'

export interface Recommendation {
  contentId: string
  contentType: 'movie' | 'series'
  score: number
  reason: string
}

export interface RecommendationRule {
  id: string
  name: string
  description: string
  weight: number
  conditions: {
    genres?: string[]
    languages?: string[]
    countries?: string[]
    decades?: string[]
    moods?: string[]
    minRating?: number
    maxRating?: number
    contentType?: 'movie' | 'series'
    excludeGenres?: string[]
    excludeLanguages?: string[]
    excludeCountries?: string[]
  }
  boostFactors: {
    recentReleases?: number
    popularity?: number
    userRating?: number
    similarity?: number
    trending?: number
    awards?: number
  }
}

export interface UserPreferences {
  userId: string
  favoriteGenres: string[]
  favoriteLanguages: string[]
  favoriteCountries: string[]
  preferredDecades: string[]
  preferredMoods: string[]
  preferredContentTypes: ('movie' | 'series')[]
  preferredQuality: string[]
  preferredAgeRatings: string[]
  watchHistory: string[]
  favorites: string[]
  watchlist: string[]
  dislikedContent: string[]
  blockedGenres: string[]
  blockedLanguages: string[]
  blockedCountries: string[]
  maxDuration?: number
  minRating: number
  notificationsEnabled: boolean
  autoPlayEnabled: boolean
  subtitlesEnabled: boolean
  audioLanguage: string
  subtitleLanguage: string
}

export interface RecommendationResult {
  contentId: string
  score: number
  reasons: string[]
  confidence: number
  category: 'personalized' | 'trending' | 'similar' | 'mood_based' | 'seasonal' | 'social'
}

export interface MoodPlaylist {
  id: string
  name: string
  description: string
  mood: string
  contentIds: string[]
  contentType: 'movie' | 'series' | 'mixed'
  coverImage: string
}

interface RecommendationsState {
  recommendations: Record<string, Recommendation[]>
  moodPlaylists: MoodPlaylist[]
  trending: {
    movies: string[]
    series: string[]
  }
  userPreferences: Record<string, UserPreferences>
  recommendationRules: RecommendationRule[]
  personalizedRecommendations: Record<string, RecommendationResult[]>
  trendingRecommendations: RecommendationResult[]
  moodBasedRecommendations: Record<string, RecommendationResult[]>
  similarContentRecommendations: Record<string, RecommendationResult[]>
  seasonalRecommendations: RecommendationResult[]
  socialRecommendations: Record<string, RecommendationResult[]>
  discoveryQueue: Record<string, string[]>
  lastUpdated: Record<string, number>
  isGenerating: boolean
  cache: {
    userBased: Record<string, { data: RecommendationResult[]; timestamp: number }>
    contentBased: Record<string, { data: RecommendationResult[]; timestamp: number }>
    collaborative: Record<string, { data: RecommendationResult[]; timestamp: number }>
  }
}

const initialState: RecommendationsState = {
  recommendations: {},
  moodPlaylists: [
    {
      id: 'mood-1',
      name: 'Feel Good Movies',
      description: 'Movies to lift your spirits',
      mood: 'happy',
      contentIds: ['8', '15', '25', '34'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/happy/800/450',
    },
    {
      id: 'mood-2',
      name: 'Thriller Night',
      description: 'Edge-of-your-seat suspense',
      mood: 'thriller',
      contentIds: ['1', '4', '16', '27'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/thriller/800/450',
    },
    {
      id: 'mood-3',
      name: 'Sci-Fi Adventures',
      description: 'Journey through space and time',
      mood: 'sci-fi',
      contentIds: ['2', '3', '4', '17'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/scifi/800/450',
    },
    {
      id: 'mood-4',
      name: 'Romantic Evenings',
      description: 'Perfect for date night',
      mood: 'romance',
      contentIds: ['8', '12', '25', '45'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/romance/800/450',
    },
  ],
  trending: {
    movies: [],
    series: [],
  },
  userPreferences: {},
  recommendationRules: [
    {
      id: 'genre_match',
      name: 'Genre Matching',
      description: 'Content with matching genres to user preferences',
      weight: 0.3,
      conditions: {},
      boostFactors: { similarity: 1.2 }
    },
    {
      id: 'language_preference',
      name: 'Language Preference',
      description: 'Content in preferred languages',
      weight: 0.2,
      conditions: {},
      boostFactors: { similarity: 1.1 }
    },
    {
      id: 'recent_releases',
      name: 'Recent Releases',
      description: 'Newly released content',
      weight: 0.15,
      conditions: {},
      boostFactors: { recentReleases: 1.3 }
    },
    {
      id: 'high_rated',
      name: 'Highly Rated',
      description: 'Content with high ratings',
      weight: 0.2,
      conditions: { minRating: 7.0 },
      boostFactors: { userRating: 1.2 }
    },
    {
      id: 'trending',
      name: 'Trending Now',
      description: 'Currently trending content',
      weight: 0.15,
      conditions: {},
      boostFactors: { trending: 1.4, popularity: 1.1 }
    }
  ],
  personalizedRecommendations: {},
  trendingRecommendations: [],
  moodBasedRecommendations: {},
  similarContentRecommendations: {},
  seasonalRecommendations: [],
  socialRecommendations: {},
  discoveryQueue: {},
  lastUpdated: {},
  isGenerating: false,
  cache: {
    userBased: {},
    contentBased: {},
    collaborative: {}
  }
}

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations: (
      state,
      action: PayloadAction<{ userId: string; recommendations: Recommendation[] }>
    ) => {
      state.recommendations[action.payload.userId] = action.payload.recommendations
    },

    generateRecommendations: (
      state,
      action: PayloadAction<{
        userId: string
        watchHistory: string[]
        favorites: string[]
        allMovies: Movie[]
        allSeries: Series[]
      }>
    ) => {
      const { userId, watchHistory, favorites, allMovies, allSeries } = action.payload
      const recommendations: Recommendation[] = []

      // Get genres from watched content
      const watchedGenres = new Set<string>()
      watchHistory.forEach((id) => {
        const movie = allMovies.find((m) => m.id === id)
        const series = allSeries.find((s) => s.id === id)
        const content = movie || series
        if (content) {
          content.genres.forEach((g) => watchedGenres.add(g))
        }
      })

      // Recommend similar content
      const allContent = [...allMovies, ...allSeries]
      allContent
        .filter((c) => !watchHistory.includes(c.id) && !favorites.includes(c.id))
        .forEach((content) => {
          const commonGenres = content.genres.filter((g) => watchedGenres.has(g)).length
          if (commonGenres > 0) {
            const score = commonGenres * 0.3 + content.rating * 0.7
            recommendations.push({
              contentId: content.id,
              contentType: content.type,
              score,
              reason: `Similar to what you've watched`,
            })
          }
        })

      // Sort by score and take top 20
      recommendations.sort((a, b) => b.score - a.score)
      state.recommendations[userId] = recommendations.slice(0, 20)
    },

    setTrending: (
      state,
      action: PayloadAction<{ movies: string[]; series: string[] }>
    ) => {
      state.trending = action.payload
    },

    // Advanced User Preferences Management
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.userPreferences[action.payload.userId] = action.payload
      state.lastUpdated[action.payload.userId] = Date.now()
    },

    updateUserPreferences: (state, action: PayloadAction<{ userId: string; updates: Partial<UserPreferences> }>) => {
      const { userId, updates } = action.payload
      if (state.userPreferences[userId]) {
        Object.assign(state.userPreferences[userId], updates)
        state.lastUpdated[userId] = Date.now()
      }
    },

    addToWatchHistory: (state, action: PayloadAction<{ userId: string; contentId: string }>) => {
      const { userId, contentId } = action.payload
      if (state.userPreferences[userId]) {
        if (!state.userPreferences[userId].watchHistory.includes(contentId)) {
          state.userPreferences[userId].watchHistory.push(contentId)
        }
        state.lastUpdated[userId] = Date.now()
      }
    },

    addToFavorites: (state, action: PayloadAction<{ userId: string; contentId: string }>) => {
      const { userId, contentId } = action.payload
      if (state.userPreferences[userId]) {
        if (!state.userPreferences[userId].favorites.includes(contentId)) {
          state.userPreferences[userId].favorites.push(contentId)
        }
        state.lastUpdated[userId] = Date.now()
      }
    },

    removeFromFavorites: (state, action: PayloadAction<{ userId: string; contentId: string }>) => {
      const { userId, contentId } = action.payload
      if (state.userPreferences[userId]) {
        state.userPreferences[userId].favorites = state.userPreferences[userId].favorites.filter(
          id => id !== contentId
        )
        state.lastUpdated[userId] = Date.now()
      }
    },

    addToWatchlist: (state, action: PayloadAction<{ userId: string; contentId: string }>) => {
      const { userId, contentId } = action.payload
      if (state.userPreferences[userId]) {
        if (!state.userPreferences[userId].watchlist.includes(contentId)) {
          state.userPreferences[userId].watchlist.push(contentId)
        }
        state.lastUpdated[userId] = Date.now()
      }
    },

    removeFromWatchlist: (state, action: PayloadAction<{ userId: string; contentId: string }>) => {
      const { userId, contentId } = action.payload
      if (state.userPreferences[userId]) {
        state.userPreferences[userId].watchlist = state.userPreferences[userId].watchlist.filter(
          id => id !== contentId
        )
        state.lastUpdated[userId] = Date.now()
      }
    },

    addToDisliked: (state, action: PayloadAction<{ userId: string; contentId: string }>) => {
      const { userId, contentId } = action.payload
      if (state.userPreferences[userId]) {
        if (!state.userPreferences[userId].dislikedContent.includes(contentId)) {
          state.userPreferences[userId].dislikedContent.push(contentId)
        }
        state.lastUpdated[userId] = Date.now()
      }
    },

    // Advanced Recommendation Management
    setPersonalizedRecommendations: (state, action: PayloadAction<{ userId: string; recommendations: RecommendationResult[] }>) => {
      state.personalizedRecommendations[action.payload.userId] = action.payload.recommendations
      state.lastUpdated[action.payload.userId] = Date.now()
    },

    setTrendingRecommendations: (state, action: PayloadAction<RecommendationResult[]>) => {
      state.trendingRecommendations = action.payload
    },

    setMoodBasedRecommendations: (state, action: PayloadAction<{ mood: string; recommendations: RecommendationResult[] }>) => {
      state.moodBasedRecommendations[action.payload.mood] = action.payload.recommendations
    },

    setSimilarContentRecommendations: (state, action: PayloadAction<{ contentId: string; recommendations: RecommendationResult[] }>) => {
      state.similarContentRecommendations[action.payload.contentId] = action.payload.recommendations
    },

    setSeasonalRecommendations: (state, action: PayloadAction<RecommendationResult[]>) => {
      state.seasonalRecommendations = action.payload
    },

    setSocialRecommendations: (state, action: PayloadAction<{ userId: string; recommendations: RecommendationResult[] }>) => {
      state.socialRecommendations[action.payload.userId] = action.payload.recommendations
    },

    setDiscoveryQueue: (state, action: PayloadAction<{ userId: string; contentIds: string[] }>) => {
      state.discoveryQueue[action.payload.userId] = action.payload.contentIds
    },

    startRecommendationGeneration: (state) => {
      state.isGenerating = true
    },

    stopRecommendationGeneration: (state) => {
      state.isGenerating = false
    },

    updateRecommendationRules: (state, action: PayloadAction<RecommendationRule[]>) => {
      state.recommendationRules = action.payload
    },

    // Caching System
    cacheUserBasedRecommendations: (state, action: PayloadAction<{ userId: string; recommendations: RecommendationResult[] }>) => {
      state.cache.userBased[action.payload.userId] = {
        data: action.payload.recommendations,
        timestamp: Date.now()
      }
    },

    cacheContentBasedRecommendations: (state, action: PayloadAction<{ contentId: string; recommendations: RecommendationResult[] }>) => {
      state.cache.contentBased[action.payload.contentId] = {
        data: action.payload.recommendations,
        timestamp: Date.now()
      }
    },

    cacheCollaborativeRecommendations: (state, action: PayloadAction<{ userId: string; recommendations: RecommendationResult[] }>) => {
      state.cache.collaborative[action.payload.userId] = {
        data: action.payload.recommendations,
        timestamp: Date.now()
      }
    },

    clearRecommendationCache: (state, action: PayloadAction<{ userId?: string; contentId?: string }>) => {
      if (action.payload.userId) {
        delete state.cache.userBased[action.payload.userId]
        delete state.cache.collaborative[action.payload.userId]
      }
      if (action.payload.contentId) {
        delete state.cache.contentBased[action.payload.contentId]
      }
    },

    // AI-Powered Recommendation Triggers
    generateMoodBasedRecommendations: (state, action: PayloadAction<{ mood: string; context?: any }>) => {
      state.isGenerating = true
    },

    generateContextualRecommendations: (state, action: PayloadAction<{
      userId: string
      context: {
        timeOfDay?: string
        weather?: string
        occasion?: string
        groupSize?: number
        duration?: number
        location?: string
      }
    }>) => {
      state.isGenerating = true
    },

    generateSocialRecommendations: (state, action: PayloadAction<{ userId: string; socialContext: any }>) => {
      state.isGenerating = true
    },

    resetRecommendations: (state, action: PayloadAction<{ userId?: string }>) => {
      if (action.payload.userId) {
        delete state.personalizedRecommendations[action.payload.userId]
        delete state.socialRecommendations[action.payload.userId]
        delete state.discoveryQueue[action.payload.userId]
        delete state.lastUpdated[action.payload.userId]
      } else {
        state.personalizedRecommendations = {}
        state.socialRecommendations = {}
        state.discoveryQueue = {}
        state.lastUpdated = {}
      }
    },
  },
})

export const {
  setRecommendations,
  generateRecommendations,
  setTrending,
  setUserPreferences,
  updateUserPreferences,
  addToWatchHistory,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
  addToDisliked,
  setPersonalizedRecommendations,
  setTrendingRecommendations,
  setMoodBasedRecommendations,
  setSimilarContentRecommendations,
  setSeasonalRecommendations,
  setSocialRecommendations,
  setDiscoveryQueue,
  startRecommendationGeneration,
  stopRecommendationGeneration,
  updateRecommendationRules,
  cacheUserBasedRecommendations,
  cacheContentBasedRecommendations,
  cacheCollaborativeRecommendations,
  clearRecommendationCache,
  generateMoodBasedRecommendations,
  generateContextualRecommendations,
  generateSocialRecommendations,
  resetRecommendations,
} = recommendationsSlice.actions

export default recommendationsSlice.reducer

