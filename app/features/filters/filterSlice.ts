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

export type SortOption = 
  | 'popularity'
  | 'rating'
  | 'release_date'
  | 'title'
  | 'newest'

export type ContentType = 'all' | 'movie' | 'series'

interface FilterState {
  genres: Genre[]
  year: number | null
  rating: number | null
  language: string
  sortBy: SortOption
  contentType: ContentType
  showFilters: boolean
}

const initialState: FilterState = {
  genres: [],
  year: null,
  rating: null,
  language: 'all',
  sortBy: 'popularity',
  contentType: 'all',
  showFilters: false,
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
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
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
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
    clearFilters: (state) => {
      state.genres = []
      state.year = null
      state.rating = null
      state.language = 'all'
      state.sortBy = 'popularity'
      state.contentType = 'all'
    },
  },
})

export const {
  setGenres,
  toggleGenre,
  setYear,
  setRating,
  setLanguage,
  setSortBy,
  setContentType,
  setShowFilters,
  clearFilters,
} = filterSlice.actions

export default filterSlice.reducer

