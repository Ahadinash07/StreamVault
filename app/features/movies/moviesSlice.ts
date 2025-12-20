import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Movie } from '@/types/content'

interface MoviesState {
  movies: Movie[]
  featuredMovie: Movie | null
  trendingMovies: Movie[]
  topRatedMovies: Movie[]
  newReleases: Movie[]
  loading: boolean
  error: string | null
}

const initialState: MoviesState = {
  movies: [],
  featuredMovie: null,
  trendingMovies: [],
  topRatedMovies: [],
  newReleases: [],
  loading: false,
  error: null,
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload
    },
    setFeaturedMovie: (state, action: PayloadAction<Movie>) => {
      state.featuredMovie = action.payload
    },
    setTrendingMovies: (state, action: PayloadAction<Movie[]>) => {
      state.trendingMovies = action.payload
    },
    setTopRatedMovies: (state, action: PayloadAction<Movie[]>) => {
      state.topRatedMovies = action.payload
    },
    setNewReleases: (state, action: PayloadAction<Movie[]>) => {
      state.newReleases = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setMovies,
  setFeaturedMovie,
  setTrendingMovies,
  setTopRatedMovies,
  setNewReleases,
  setLoading,
  setError,
} = moviesSlice.actions

export default moviesSlice.reducer

