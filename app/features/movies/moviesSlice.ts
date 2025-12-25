import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Movie } from '@/types/content'
import { mockMovies } from '@/data/mockData'

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
  movies: mockMovies,
  featuredMovie: mockMovies[2] || null, // Changed to Interstellar
  trendingMovies: mockMovies.slice(0, 5),
  topRatedMovies: mockMovies.slice().sort((a, b) => b.rating - a.rating).slice(0, 5),
  newReleases: mockMovies.slice().sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 5),
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

