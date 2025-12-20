import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Genre =
  | 'Action'
  | 'Adventure'
  | 'Animation'
  | 'Comedy'
  | 'Crime'
  | 'Documentary'
  | 'Drama'
  | 'Fantasy'
  | 'Horror'
  | 'Mystery'
  | 'Romance'
  | 'Sci-Fi'
  | 'Thriller'
  | 'Western'
  | 'Biography'
  | 'History'
  | 'Music'
  | 'Sport'
  | 'War'
  | 'Family'
  | 'Musical'

export type SortOption =
  | 'popularity'
  | 'rating'
  | 'release_date'
  | 'title'
  | 'newest'
  | 'trending'
  | 'recently_added'
  | 'alphabetical'

export type ContentType = 'all' | 'movie' | 'series'

export type Language =
  | 'all'
  | 'english'
  | 'hindi'
  | 'spanish'
  | 'french'
  | 'german'
  | 'italian'
  | 'japanese'
  | 'korean'
  | 'chinese'
  | 'russian'
  | 'arabic'
  | 'portuguese'
  | 'tamil'
  | 'telugu'
  | 'kannada'
  | 'malayalam'
  | 'bengali'

export type Quality = 'all' | 'SD' | 'HD' | '4K' | '8K'

export type AgeRating = 'all' | 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'TV-Y' | 'TV-Y7' | 'TV-G' | 'TV-PG' | 'TV-14' | 'TV-MA'

export type ReleaseStatus = 'all' | 'released' | 'coming_soon' | 'in_production' | 'post_production'

export type DurationRange = 'all' | 'short' | 'medium' | 'long' | 'epic'

export type Country = 'all' | 'us' | 'uk' | 'india' | 'china' | 'japan' | 'korea' | 'france' | 'germany' | 'italy' | 'spain' | 'canada' | 'australia'

interface FilterState {
  // Basic filters
  genres: Genre[]
  year: number | null
  yearRange: { min: number | null; max: number | null }
  rating: number | null
  language: Language
  sortBy: SortOption
  contentType: ContentType
  showFilters: boolean

  // Advanced filters
  quality: Quality
  ageRating: AgeRating
  releaseStatus: ReleaseStatus
  durationRange: DurationRange
  country: Country
  audioLanguages: Language[]
  subtitleLanguages: Language[]
  productionCompanies: string[]
  cast: string[]
  directors: string[]
  awards: string[]

  // Search and discovery
  searchQuery: string
  mood: string
  decade: string
  isOriginal: boolean | null
  hasSubtitles: boolean | null
  isDubbed: boolean | null

  // User preferences
  excludeWatched: boolean
  onlyFavorites: boolean
  onlyWatchlist: boolean
}

const initialState: FilterState = {
  // Basic filters
  genres: [],
  year: null,
  yearRange: { min: null, max: null },
  rating: null,
  language: 'all',
  sortBy: 'popularity',
  contentType: 'all',
  showFilters: false,

  // Advanced filters
  quality: 'all',
  ageRating: 'all',
  releaseStatus: 'all',
  durationRange: 'all',
  country: 'all',
  audioLanguages: [],
  subtitleLanguages: [],
  productionCompanies: [],
  cast: [],
  directors: [],
  awards: [],

  // Search and discovery
  searchQuery: '',
  mood: '',
  decade: '',
  isOriginal: null,
  hasSubtitles: null,
  isDubbed: null,

  // User preferences
  excludeWatched: false,
  onlyFavorites: false,
  onlyWatchlist: false,
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Basic filters
    setGenres: (state, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload
    },
    toggleGenre: (state, action: PayloadAction<Genre>) => {
      const index = state.genres.indexOf(action.payload)
      if (index > -1) {
        state.genres.splice(index, 1)
      } else {
        state.genres.push(action.payload)
      }
    },
    setYear: (state, action: PayloadAction<number | null>) => {
      state.year = action.payload
    },
    setYearRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.yearRange = action.payload
    },
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload
    },
    setContentType: (state, action: PayloadAction<ContentType>) => {
      state.contentType = action.payload
    },
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload
    },

    // Advanced filters
    setQuality: (state, action: PayloadAction<Quality>) => {
      state.quality = action.payload
    },
    setAgeRating: (state, action: PayloadAction<AgeRating>) => {
      state.ageRating = action.payload
    },
    setReleaseStatus: (state, action: PayloadAction<ReleaseStatus>) => {
      state.releaseStatus = action.payload
    },
    setDurationRange: (state, action: PayloadAction<DurationRange>) => {
      state.durationRange = action.payload
    },
    setCountry: (state, action: PayloadAction<Country>) => {
      state.country = action.payload
    },
    toggleAudioLanguage: (state, action: PayloadAction<Language>) => {
      const index = state.audioLanguages.indexOf(action.payload)
      if (index > -1) {
        state.audioLanguages.splice(index, 1)
      } else {
        state.audioLanguages.push(action.payload)
      }
    },
    toggleSubtitleLanguage: (state, action: PayloadAction<Language>) => {
      const index = state.subtitleLanguages.indexOf(action.payload)
      if (index > -1) {
        state.subtitleLanguages.splice(index, 1)
      } else {
        state.subtitleLanguages.push(action.payload)
      }
    },
    toggleProductionCompany: (state, action: PayloadAction<string>) => {
      const index = state.productionCompanies.indexOf(action.payload)
      if (index > -1) {
        state.productionCompanies.splice(index, 1)
      } else {
        state.productionCompanies.push(action.payload)
      }
    },
    toggleCast: (state, action: PayloadAction<string>) => {
      const index = state.cast.indexOf(action.payload)
      if (index > -1) {
        state.cast.splice(index, 1)
      } else {
        state.cast.push(action.payload)
      }
    },
    toggleDirector: (state, action: PayloadAction<string>) => {
      const index = state.directors.indexOf(action.payload)
      if (index > -1) {
        state.directors.splice(index, 1)
      } else {
        state.directors.push(action.payload)
      }
    },
    toggleAward: (state, action: PayloadAction<string>) => {
      const index = state.awards.indexOf(action.payload)
      if (index > -1) {
        state.awards.splice(index, 1)
      } else {
        state.awards.push(action.payload)
      }
    },

    // Search and discovery
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setMood: (state, action: PayloadAction<string>) => {
      state.mood = action.payload
    },
    setDecade: (state, action: PayloadAction<string>) => {
      state.decade = action.payload
    },
    setIsOriginal: (state, action: PayloadAction<boolean | null>) => {
      state.isOriginal = action.payload
    },
    setHasSubtitles: (state, action: PayloadAction<boolean | null>) => {
      state.hasSubtitles = action.payload
    },
    setIsDubbed: (state, action: PayloadAction<boolean | null>) => {
      state.isDubbed = action.payload
    },

    // User preferences
    setExcludeWatched: (state, action: PayloadAction<boolean>) => {
      state.excludeWatched = action.payload
    },
    setOnlyFavorites: (state, action: PayloadAction<boolean>) => {
      state.onlyFavorites = action.payload
    },
    setOnlyWatchlist: (state, action: PayloadAction<boolean>) => {
      state.onlyWatchlist = action.payload
    },

    // Utility actions
    clearFilters: (state) => {
      // Basic filters
      state.genres = []
      state.year = null
      state.yearRange = { min: null, max: null }
      state.rating = null
      state.language = 'all'
      state.sortBy = 'popularity'
      state.contentType = 'all'

      // Advanced filters
      state.quality = 'all'
      state.ageRating = 'all'
      state.releaseStatus = 'all'
      state.durationRange = 'all'
      state.country = 'all'
      state.audioLanguages = []
      state.subtitleLanguages = []
      state.productionCompanies = []
      state.cast = []
      state.directors = []
      state.awards = []

      // Search and discovery
      state.searchQuery = ''
      state.mood = ''
      state.decade = ''
      state.isOriginal = null
      state.hasSubtitles = null
      state.isDubbed = null

      // User preferences
      state.excludeWatched = false
      state.onlyFavorites = false
      state.onlyWatchlist = false
    },
    clearAdvancedFilters: (state) => {
      state.quality = 'all'
      state.ageRating = 'all'
      state.releaseStatus = 'all'
      state.durationRange = 'all'
      state.country = 'all'
      state.audioLanguages = []
      state.subtitleLanguages = []
      state.productionCompanies = []
      state.cast = []
      state.directors = []
      state.awards = []
      state.isOriginal = null
      state.hasSubtitles = null
      state.isDubbed = null
    },
  },
})

export const {
  // Basic filters
  setGenres,
  toggleGenre,
  setYear,
  setYearRange,
  setRating,
  setLanguage,
  setSortBy,
  setContentType,
  setShowFilters,

  // Advanced filters
  setQuality,
  setAgeRating,
  setReleaseStatus,
  setDurationRange,
  setCountry,
  toggleAudioLanguage,
  toggleSubtitleLanguage,
  toggleProductionCompany,
  toggleCast,
  toggleDirector,
  toggleAward,

  // Search and discovery
  setSearchQuery,
  setMood,
  setDecade,
  setIsOriginal,
  setHasSubtitles,
  setIsDubbed,

  // User preferences
  setExcludeWatched,
  setOnlyFavorites,
  setOnlyWatchlist,

  // Utility actions
  clearFilters,
  clearAdvancedFilters,
} = filterSlice.actions

export default filterSlice.reducer

