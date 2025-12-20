'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentRow from '@/components/ContentRow'
import { useAppSelector, useAppDispatch } from '../hooks'
import { setQuery, setResults, addRecentSearch, clearSearch, clearRecentSearches } from '../features/search/searchSlice'
import { FiSearch, FiX } from 'react-icons/fi'
import { Movie, Series } from '@/types/content'

export default function SearchPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { query, results, recentSearches, showSuggestions } = useAppSelector((state) => state.search)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)
  const [localQuery, setLocalQuery] = useState(query)

  const allContent = useMemo(() => [...movies, ...series], [movies, series])

  useEffect(() => {
    if (localQuery.trim()) {
      const searchResults = allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(localQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(localQuery.toLowerCase()) ||
          item.genres.some((g) => g.toLowerCase().includes(localQuery.toLowerCase()))
      )
      dispatch(setResults(searchResults))
      dispatch(setQuery(localQuery))
    } else {
      dispatch(setResults([]))
      dispatch(setQuery(''))
    }
  }, [localQuery, allContent, dispatch])

  const handleSearch = (searchQuery: string) => {
    setLocalQuery(searchQuery)
    if (searchQuery.trim()) {
      dispatch(addRecentSearch(searchQuery))
    }
  }

  const suggestions = useMemo(() => {
    if (!localQuery.trim()) return []
    return allContent
      .filter((item) =>
        item.title.toLowerCase().startsWith(localQuery.toLowerCase())
      )
      .slice(0, 5)
      .map((item) => item.title)
  }, [localQuery, allContent])

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(localQuery)
                  }
                }}
                placeholder="Search for movies, series, genres..."
                className="w-full pl-12 pr-12 py-4 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg"
                autoFocus
              />
              {localQuery && (
                <button
                  onClick={() => {
                    setLocalQuery('')
                    dispatch(clearSearch())
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-dark-100 border border-dark-200 rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-dark-200 transition-colors flex items-center space-x-2"
                  >
                    <FiSearch className="w-4 h-4 text-gray-400" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recent Searches */}
          {!localQuery && recentSearches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Searches</h2>
                <button
                  onClick={() => dispatch(clearRecentSearches())}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 bg-dark-100 border border-dark-200 rounded-full hover:bg-dark-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {localQuery && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Search Results for &quot;{localQuery}&quot;
              </h2>
              {results.length > 0 ? (
                <ContentRow title="" items={results} type="movie" />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    No results found for &quot;{localQuery}&quot;
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Popular Searches */}
          {!localQuery && results.length === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
              <ContentRow title="" items={allContent.slice(0, 10)} type="movie" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

