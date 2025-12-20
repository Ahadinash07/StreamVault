import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Movie, Series } from '@/types/content'

interface SearchState {
  query: string
  results: (Movie | Series)[]
  recentSearches: string[]
  isSearching: boolean
  showSuggestions: boolean
  suggestions: string[]
}

const initialState: SearchState = {
  query: '',
  results: [],
  recentSearches: [],
  isSearching: false,
  showSuggestions: false,
  suggestions: [],
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
    },
    setResults: (state, action: PayloadAction<(Movie | Series)[]>) => {
      state.results = action.payload
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      if (action.payload.trim()) {
        state.recentSearches = [
          action.payload,
          ...state.recentSearches.filter((s) => s !== action.payload),
        ].slice(0, 10)
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = []
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload
    },
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload
    },
    clearSearch: (state) => {
      state.query = ''
      state.results = []
      state.showSuggestions = false
    },
  },
})

export const {
  setQuery,
  setResults,
  addRecentSearch,
  clearRecentSearches,
  setSearching,
  setShowSuggestions,
  setSuggestions,
  clearSearch,
} = searchSlice.actions

export default searchSlice.reducer

