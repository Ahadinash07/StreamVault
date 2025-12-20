'use client'

import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { generateRecommendations } from '@/app/features/recommendations/recommendationsSlice'
import ContentRow from './ContentRow'

export default function Recommendations() {
  const [mounted, setMounted] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { recommendations } = useAppSelector((state) => state.recommendations)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user && user.watchHistory && user.watchHistory.length > 0) {
      dispatch(
        generateRecommendations({
          userId: user.id,
          watchHistory: user.watchHistory,
          favorites: user.favorites || [],
          allMovies: movies,
          allSeries: series,
        })
      )
    }
  }, [user, movies, series, dispatch])

  const userRecommendations = user ? recommendations[user.id] || [] : []
  
  if (!mounted || userRecommendations.length === 0) return null

  const recommendedMovies = userRecommendations
    .filter((r) => r.contentType === 'movie')
    .map((r) => movies.find((m) => m.id === r.contentId))
    .filter(Boolean) as any[]

  const recommendedSeries = userRecommendations
    .filter((r) => r.contentType === 'series')
    .map((r) => series.find((s) => s.id === r.contentId))
    .filter(Boolean) as any[]

  return (
    <>
      {recommendedMovies.length > 0 && (
        <ContentRow
          title="Recommended for You"
          items={recommendedMovies}
          type="movie"
        />
      )}
      {recommendedSeries.length > 0 && (
        <ContentRow
          title="Series You Might Like"
          items={recommendedSeries}
          type="series"
        />
      )}
    </>
  )
}

