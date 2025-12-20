import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ContentMetadata {
  id: string
  title: string
  description: string
  poster: string
  backdrop: string
  releaseDate: string
  rating: number
  duration: number
  genres: string[]
  language: string
  country: string
  director?: string
  cast: string[]
  productionCompanies: string[]
  awards: string[]
  ageRating: string
  quality: string[]
  audioLanguages: string[]
  subtitleLanguages: string[]
  isOriginal: boolean
  hasSubtitles: boolean
  isDubbed: boolean
  releaseStatus: 'released' | 'coming_soon' | 'in_production' | 'post_production'
  budget?: number
  revenue?: number
  imdbId?: string
  tmdbId?: number
  popularity: number
  voteCount: number
  similarContent: string[]
  recommendations: string[]
  tags: string[]
  mood: string[]
  decade: string
  contentType: 'movie' | 'series'
}

export interface ContentState {
  metadata: Record<string, ContentMetadata>
  similarContent: Record<string, string[]>
  recommendations: Record<string, string[]>
  trending: string[]
  popular: string[]
  topRated: string[]
  newReleases: string[]
  comingSoon: string[]
  originals: string[]
  byGenre: Record<string, string[]>
  byLanguage: Record<string, string[]>
  byCountry: Record<string, string[]>
  byDecade: Record<string, string[]>
  byMood: Record<string, string[]>
  searchIndex: Record<string, string[]>
  lastUpdated: number
}

const initialState: ContentState = {
  metadata: {},
  similarContent: {},
  recommendations: {},
  trending: [],
  popular: [],
  topRated: [],
  newReleases: [],
  comingSoon: [],
  originals: [],
  byGenre: {},
  byLanguage: {},
  byCountry: {},
  byDecade: {},
  byMood: {},
  searchIndex: {},
  lastUpdated: 0,
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentMetadata: (state, action: PayloadAction<ContentMetadata>) => {
      const content = action.payload
      state.metadata[content.id] = content

      // Update indexes
      content.genres.forEach(genre => {
        if (!state.byGenre[genre]) state.byGenre[genre] = []
        if (!state.byGenre[genre].includes(content.id)) {
          state.byGenre[genre].push(content.id)
        }
      })

      if (!state.byLanguage[content.language]) state.byLanguage[content.language] = []
      if (!state.byLanguage[content.language].includes(content.id)) {
        state.byLanguage[content.language].push(content.id)
      }

      if (!state.byCountry[content.country]) state.byCountry[content.country] = []
      if (!state.byCountry[content.country].includes(content.id)) {
        state.byCountry[content.country].push(content.id)
      }

      if (!state.byDecade[content.decade]) state.byDecade[content.decade] = []
      if (!state.byDecade[content.decade].includes(content.id)) {
        state.byDecade[content.decade].push(content.id)
      }

      content.mood.forEach(mood => {
        if (!state.byMood[mood]) state.byMood[mood] = []
        if (!state.byMood[mood].includes(content.id)) {
          state.byMood[mood].push(content.id)
        }
      })

      // Update search index
      const searchTerms = [
        content.title.toLowerCase(),
        content.description.toLowerCase(),
        ...content.genres.map(g => g.toLowerCase()),
        ...content.cast.map(c => c.toLowerCase()),
        content.director?.toLowerCase(),
        ...content.tags.map(t => t.toLowerCase())
      ].filter((term): term is string => term !== undefined)

      searchTerms.forEach(term => {
        if (!state.searchIndex[term]) state.searchIndex[term] = []
        if (!state.searchIndex[term].includes(content.id)) {
          state.searchIndex[term].push(content.id)
        }
      })

      state.lastUpdated = Date.now()
    },

    setSimilarContent: (state, action: PayloadAction<{ contentId: string; similarIds: string[] }>) => {
      state.similarContent[action.payload.contentId] = action.payload.similarIds
    },

    setRecommendations: (state, action: PayloadAction<{ contentId: string; recommendedIds: string[] }>) => {
      state.recommendations[action.payload.contentId] = action.payload.recommendedIds
    },

    setTrending: (state, action: PayloadAction<string[]>) => {
      state.trending = action.payload
    },

    setPopular: (state, action: PayloadAction<string[]>) => {
      state.popular = action.payload
    },

    setTopRated: (state, action: PayloadAction<string[]>) => {
      state.topRated = action.payload
    },

    setNewReleases: (state, action: PayloadAction<string[]>) => {
      state.newReleases = action.payload
    },

    setComingSoon: (state, action: PayloadAction<string[]>) => {
      state.comingSoon = action.payload
    },

    setOriginals: (state, action: PayloadAction<string[]>) => {
      state.originals = action.payload
    },

    updateContentPopularity: (state, action: PayloadAction<{ contentId: string; popularity: number }>) => {
      if (state.metadata[action.payload.contentId]) {
        state.metadata[action.payload.contentId].popularity = action.payload.popularity
      }
    },

    addToWatchHistory: (state, action: PayloadAction<{ userId: string; contentId: string; timestamp: number }>) => {
      // This would typically be handled in a separate watch history slice
      // For now, we'll just update the popularity
      if (state.metadata[action.payload.contentId]) {
        state.metadata[action.payload.contentId].popularity += 0.1
      }
    },

    // Advanced search and filtering helpers
    getContentByFilters: (state, action: PayloadAction<{
      genres?: string[]
      language?: string
      country?: string
      decade?: string
      mood?: string
      quality?: string
      ageRating?: string
      releaseStatus?: string
      minRating?: number
      yearRange?: { min: number; max: number }
      contentType?: 'movie' | 'series'
      excludeIds?: string[]
    }>) => {
      // This is a selector that would be used in components
      // The actual filtering logic would be in the component using useMemo
    },

    // AI-powered recommendations
    generatePersonalizedRecommendations: (state, action: PayloadAction<{
      userId: string
      watchHistory: string[]
      favorites: string[]
      watchlist: string[]
      preferredGenres: string[]
      preferredLanguages: string[]
    }>) => {
      // This would trigger AI recommendation generation
      // For now, it's a placeholder for future AI integration
    },

    // Content discovery
    discoverContent: (state, action: PayloadAction<{
      mood?: string
      occasion?: string
      timeOfDay?: string
      weather?: string
      groupSize?: number
      duration?: number
    }>) => {
      // AI-powered content discovery based on context
    },

    clearContentCache: (state) => {
      state.lastUpdated = 0
    },
  },
})

export const {
  setContentMetadata,
  setSimilarContent,
  setRecommendations,
  setTrending,
  setPopular,
  setTopRated,
  setNewReleases,
  setComingSoon,
  setOriginals,
  updateContentPopularity,
  addToWatchHistory,
  getContentByFilters,
  generatePersonalizedRecommendations,
  discoverContent,
  clearContentCache,
} = contentSlice.actions

export default contentSlice.reducer