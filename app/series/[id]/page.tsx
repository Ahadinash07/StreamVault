'use client'

import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VideoPlayer from '@/components/VideoPlayer'
import ContentRow from '@/components/ContentRow'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist } from '../../features/user/userSlice'
import { FiPlay, FiPlus, FiCheck, FiShare2, FiHeart, FiChevronDown } from 'react-icons/fi'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SeriesDetailPage() {
  const params = useParams()
  const seriesId = params.id as string
  const dispatch = useAppDispatch()
  const { series } = useAppSelector((state) => state.series)
  const { user } = useAppSelector((state) => state.user)
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(0)
  const [selectedEpisode, setSelectedEpisode] = useState(0)
  const [expandedSeason, setExpandedSeason] = useState<number | null>(0)

  const s = series.find((s) => s.id === seriesId)
  const isFavorite = user?.favorites?.includes(seriesId) || false
  const isInWatchlist = user?.watchlist?.includes(seriesId) || false

  if (!s) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-gray-400 text-lg">Series not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentSeason = s.seasons[selectedSeason]
  const currentEpisode = currentSeason?.episodes[selectedEpisode]

  const handlePlay = (seasonIndex: number, episodeIndex: number) => {
    setSelectedSeason(seasonIndex)
    setSelectedEpisode(episodeIndex)
    setShowPlayer(true)
  }

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please sign in to add favorites')
      return
    }
    if (isFavorite) {
      dispatch(removeFromFavorites(seriesId))
      toast.success('Removed from favorites')
    } else {
      dispatch(addToFavorites(seriesId))
      toast.success('Added to favorites')
    }
  }

  const handleWatchlist = () => {
    if (!user) {
      toast.error('Please sign in to add to watchlist')
      return
    }
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(seriesId))
      toast.success('Removed from watchlist')
    } else {
      dispatch(addToWatchlist(seriesId))
      toast.success('Added to watchlist')
    }
  }

  const similarSeries = series
    .filter((s) => s.id !== seriesId && s.genres.some((g) => s.genres.includes(g)))
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      {showPlayer && currentEpisode ? (
        <VideoPlayer
          content={s}
          episode={currentEpisode}
          season={currentSeason}
          onClose={() => setShowPlayer(false)}
        />
      ) : (
        <main className="pt-20 md:pt-24">
          {/* Hero Section */}
          <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              <Image
                src={s.backdrop}
                alt={s.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="relative z-20 h-full flex items-end">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {s.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm md:text-base">
                    <span className="px-3 py-1 bg-green-500 text-black font-semibold rounded">
                      {s.rating.toFixed(1)} Rating
                    </span>
                    <span>{new Date(s.releaseDate).getFullYear()}</span>
                    <span className="px-3 py-1 border border-white/30 rounded">
                      {s.maturityRating}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-200 mb-6 text-base md:text-lg">
                    {s.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {currentEpisode && (
                      <button
                        onClick={() => handlePlay(selectedSeason, selectedEpisode)}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-semibold"
                      >
                        <FiPlay className="w-5 h-5" />
                        <span>Play</span>
                      </button>
                    )}
                    <button
                      onClick={handleWatchlist}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-md hover:bg-white/30 transition-colors"
                    >
                      {isInWatchlist ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <FiPlus className="w-5 h-5" />
                      )}
                      <span>My List</span>
                    </button>
                    <button
                      onClick={handleFavorite}
                      className={`p-3 rounded-md transition-colors ${
                        isFavorite
                          ? 'bg-red-600 text-white'
                          : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                      }`}
                    >
                      <FiHeart className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/20 backdrop-blur-md text-white rounded-md hover:bg-white/30 transition-colors">
                      <FiShare2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes Section */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Episodes</h2>
            <div className="space-y-4">
              {s.seasons.map((season, seasonIndex) => (
                <div key={season.id} className="bg-dark-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedSeason(expandedSeason === seasonIndex ? null : seasonIndex)
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-dark-200 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">
                        {season.title} ({season.episodes.length} episodes)
                      </h3>
                      <span className="text-sm text-gray-400">
                        {new Date(season.releaseDate).getFullYear()}
                      </span>
                    </div>
                    <FiChevronDown
                      className={`w-5 h-5 transition-transform ${
                        expandedSeason === seasonIndex ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedSeason === seasonIndex && (
                    <div className="p-4 space-y-2">
                      {season.episodes.map((episode, episodeIndex) => (
                        <button
                          key={episode.id}
                          onClick={() => handlePlay(seasonIndex, episodeIndex)}
                          className="w-full flex items-center space-x-4 p-3 hover:bg-dark-200 rounded transition-colors text-left"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-dark-200 rounded flex items-center justify-center font-semibold">
                            {episode.episodeNumber}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{episode.title}</h4>
                            <p className="text-sm text-gray-400 line-clamp-1">
                              {episode.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {episode.duration} min
                            </p>
                          </div>
                          <FiPlay className="w-5 h-5 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Similar Series */}
            {similarSeries.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">More Like This</h2>
                <ContentRow title="" items={similarSeries} type="series" />
              </div>
            )}
          </div>
        </main>
      )}
      <Footer />
    </div>
  )
}

