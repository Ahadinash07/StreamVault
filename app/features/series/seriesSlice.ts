import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Series } from '@/types/content'
import { mockSeries } from '@/data/mockData'

interface SeriesState {
  series: Series[]
  featuredSeries: Series | null
  trendingSeries: Series[]
  topRatedSeries: Series[]
  newReleases: Series[]
  loading: boolean
  error: string | null
}

const initialState: SeriesState = {
  series: mockSeries,
  featuredSeries: mockSeries[0] || null,
  trendingSeries: mockSeries.slice(0, 3),
  topRatedSeries: mockSeries.slice().sort((a, b) => b.rating - a.rating).slice(0, 3),
  newReleases: mockSeries.slice().sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 3),
  loading: false,
  error: null,
}

const seriesSlice = createSlice({
  name: 'series',
  initialState,
  reducers: {
    setSeries: (state, action: PayloadAction<Series[]>) => {
      state.series = action.payload
    },
    setFeaturedSeries: (state, action: PayloadAction<Series>) => {
      state.featuredSeries = action.payload
    },
    setTrendingSeries: (state, action: PayloadAction<Series[]>) => {
      state.trendingSeries = action.payload
    },
    setTopRatedSeries: (state, action: PayloadAction<Series[]>) => {
      state.topRatedSeries = action.payload
    },
    setNewReleases: (state, action: PayloadAction<Series[]>) => {
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
  setSeries,
  setFeaturedSeries,
  setTrendingSeries,
  setTopRatedSeries,
  setNewReleases,
  setLoading,
  setError,
} = seriesSlice.actions

export default seriesSlice.reducer

