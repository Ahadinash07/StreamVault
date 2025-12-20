import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './features/movies/moviesSlice'
import seriesReducer from './features/series/seriesSlice'
import userReducer from './features/user/userSlice'
import subscriptionReducer from './features/subscription/subscriptionSlice'
import searchReducer from './features/search/searchSlice'
import filterReducer from './features/filters/filterSlice'
import watchProgressReducer from './features/user/watchProgressSlice'
import socialReducer from './features/social/socialSlice'
import recommendationsReducer from './features/recommendations/recommendationsSlice'
import achievementsReducer from './features/achievements/achievementsSlice'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    series: seriesReducer,
    user: userReducer,
    subscription: subscriptionReducer,
    search: searchReducer,
    filters: filterReducer,
    watchProgress: watchProgressReducer,
    social: socialReducer,
    recommendations: recommendationsReducer,
    achievements: achievementsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

