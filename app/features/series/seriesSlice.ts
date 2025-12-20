import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Series } from '@/types/content'

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
  series: [],
  featuredSeries: null,
  trendingSeries: [],
  topRatedSeries: [],
  newReleases: [],
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

