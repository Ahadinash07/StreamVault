'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../hooks'
import { setGenres, setYear, setRating, setSortBy, clearFilters, toggleGenre, setShowFilters } from '../features/filters/filterSlice'
import { FiFilter, FiX } from 'react-icons/fi'
import { Series } from '@/types/content'
import type { Genre, SortOption } from '../features/filters/filterSlice'

export default function SeriesPage() {
  const dispatch = useAppDispatch()
  const { series } = useAppSelector((state) => state.series)
  const { genres, year, rating, sortBy, showFilters } = useAppSelector((state) => state.filters)
  const [filteredSeries, setFilteredSeries] = useState<Series[]>(series)

  const allGenres: Genre[] = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller', 'Western'
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Rating' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'newest', label: 'Newest First' },
  ]

  useEffect(() => {
    let filtered = [...series]

    // Filter by genres
    if (genres.length > 0) {
      filtered = filtered.filter((s) =>
        genres.some((genre) => s.genres.includes(genre))
      )
    }

    // Filter by year
    if (year) {
      filtered = filtered.filter(
        (s) => new Date(s.releaseDate).getFullYear() === year
      )
    }

    // Filter by rating
    if (rating) {
      filtered = filtered.filter((s) => s.rating >= rating)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'release_date':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        default:
          return 0
      }
    })

    setFilteredSeries(filtered)
  }, [series, genres, year, rating, sortBy])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-0">
              TV Series
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
                className="px-4 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => dispatch(setShowFilters(!showFilters))}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-100 border border-dark-200 rounded-md hover:bg-dark-200 transition-colors"
              >
                <FiFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Sidebar */}
          {showFilters && (
            <div className="mb-8 p-6 bg-dark-100 rounded-lg border border-dark-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch(clearFilters())}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => dispatch(setShowFilters(false))}
                    className="p-1 hover:bg-dark-200 rounded"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Genres */}
                <div>
                  <label className="block text-sm font-medium mb-2">Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => dispatch(toggleGenre(genre))}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          genres.includes(genre)
                            ? 'bg-blue-600 text-white'
                            : 'bg-dark-200 text-gray-300 hover:bg-dark-300'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <select
                    value={year || ''}
                    onChange={(e) =>
                      dispatch(setYear(e.target.value ? parseInt(e.target.value) : null))
                    }
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-md text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Rating: {rating || 'Any'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={rating || 0}
                    onChange={(e) =>
                      dispatch(setRating(e.target.value ? parseFloat(e.target.value) : null))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div>
            <p className="text-gray-400 mb-6">
              Showing {filteredSeries.length} {filteredSeries.length === 1 ? 'series' : 'series'}
            </p>
            {filteredSeries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredSeries.map((series, index) => (
                  <div key={series.id} className="group">
                    <Link href={`/series/${series.id}`}>
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-dark-100">
                        <img
                          src={series.poster}
                          alt={series.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-semibold line-clamp-2">{series.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-300">
                              {new Date(series.releaseDate).getFullYear()}
                            </span>
                            <span className="text-xs text-yellow-400">★ {series.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="space-y-1">
                      <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {series.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(series.releaseDate).getFullYear()}</span>
                        <span className="text-yellow-400">★ {series.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {series.genres.slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 bg-dark-200 text-gray-300 text-xs rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No series found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

