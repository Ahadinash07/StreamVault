'use client'

import { useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentRow from '@/components/ContentRow'
import { useAppSelector } from '../hooks'
import Link from 'next/link'

export default function MyListPage() {
  const { user } = useAppSelector((state) => state.user)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  const favoriteMovies = useMemo(() => {
    if (!user?.favorites || user.favorites.length === 0) return []
    return movies.filter((m) => user.favorites.includes(m.id))
  }, [user, movies])

  const favoriteSeries = useMemo(() => {
    if (!user?.favorites || user.favorites.length === 0) return []
    return series.filter((s) => user.favorites.includes(s.id))
  }, [user, series])

  const watchlistMovies = useMemo(() => {
    if (!user?.watchlist || user.watchlist.length === 0) return []
    return movies.filter((m) => user.watchlist.includes(m.id))
  }, [user, movies])

  const watchlistSeries = useMemo(() => {
    if (!user?.watchlist || user.watchlist.length === 0) return []
    return series.filter((s) => user.watchlist.includes(s.id))
  }, [user, series])

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-gray-400 text-lg mb-4">Please sign in to view your list</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">My List</h1>

          {favoriteMovies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Favorite Movies</h2>
              <ContentRow title="" items={favoriteMovies} type="movie" />
            </div>
          )}

          {favoriteSeries.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Favorite Series</h2>
              <ContentRow title="" items={favoriteSeries} type="series" />
            </div>
          )}

          {watchlistMovies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Watchlist Movies</h2>
              <ContentRow title="" items={watchlistMovies} type="movie" />
            </div>
          )}

          {watchlistSeries.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Watchlist Series</h2>
              <ContentRow title="" items={watchlistSeries} type="series" />
            </div>
          )}

          {favoriteMovies.length === 0 &&
            favoriteSeries.length === 0 &&
            watchlistMovies.length === 0 &&
            watchlistSeries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">Your list is empty</p>
                <p className="text-gray-500 text-sm">
                  Start adding movies and series to your list to see them here
                </p>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

