'use client'

import { use } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VideoPlayer from '@/components/VideoPlayer'
import ContentRow from '@/components/ContentRow'
import Reviews from '@/components/Reviews'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist, addToWatchHistory } from '../../features/user/userSlice'
import { FiPlay, FiPlus, FiCheck, FiShare2, FiHeart, FiUsers } from 'react-icons/fi'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'
import WatchParty from '@/components/WatchParty'

export default function MovieDetailPage() {
  const params = useParams()
  const movieId = params.id as string
  const dispatch = useAppDispatch()
  const { movies } = useAppSelector((state) => state.movies)
  const { user } = useAppSelector((state) => state.user)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showWatchParty, setShowWatchParty] = useState(false)

  const movie = movies.find((m) => m.id === movieId)
  const isFavorite = user?.favorites?.includes(movieId) || false
  const isInWatchlist = user?.watchlist?.includes(movieId) || false

  if (!movie) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-gray-400 text-lg">Movie not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handlePlay = () => {
    setShowPlayer(true)
    if (user) {
      dispatch(addToWatchHistory(movieId))
    }
  }

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please sign in to add favorites')
      return
    }
    if (isFavorite) {
      dispatch(removeFromFavorites(movieId))
      toast.success('Removed from favorites')
    } else {
      dispatch(addToFavorites(movieId))
      toast.success('Added to favorites')
    }
  }

  const handleWatchlist = () => {
    if (!user) {
      toast.error('Please sign in to add to watchlist')
      return
    }
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movieId))
      toast.success('Removed from watchlist')
    } else {
      dispatch(addToWatchlist(movieId))
      toast.success('Added to watchlist')
    }
  }

  const similarMovies = movies
    .filter((m) => m.id !== movieId && m.genres.some((g) => movie.genres.includes(g)))
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      {showWatchParty && (
        <WatchParty content={movie} onClose={() => setShowWatchParty(false)} />
      )}
      {showPlayer ? (
        <VideoPlayer
          content={movie}
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
                src={movie.backdrop}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="relative z-20 h-full flex items-end">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {movie.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm md:text-base">
                    <span className="px-3 py-1 bg-green-500 text-black font-semibold rounded">
                      {movie.rating.toFixed(1)} Rating
                    </span>
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                    <span className="px-3 py-1 border border-white/30 rounded">
                      {movie.maturityRating}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-200 mb-6 text-base md:text-lg">
                    {movie.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handlePlay}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-semibold"
                    >
                      <FiPlay className="w-5 h-5" />
                      <span>Play</span>
                    </button>
                    <button
                      onClick={handleWatchlist}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-md hover:bg-white/30 transition-colors"
                      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      {isInWatchlist ? (
                        <FiCheck className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <FiPlus className="w-5 h-5" aria-hidden="true" />
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
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiHeart className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button 
                      className="p-3 bg-white/20 backdrop-blur-md text-white rounded-md hover:bg-white/30 transition-colors"
                      aria-label="Share"
                      title="Share"
                    >
                      <FiShare2 className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => {
                        if (!user) {
                          toast.error('Please sign in to start a watch party')
                          return
                        }
                        setShowWatchParty(true)
                      }}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors font-semibold"
                    >
                      <FiUsers className="w-5 h-5" />
                      <span>Watch Party</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-2">Director</h3>
                <p className="text-gray-400">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Cast</h3>
                <p className="text-gray-400">{movie.cast.join(', ')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Release Date</h3>
                <p className="text-gray-400">
                  {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">More Like This</h2>
                <ContentRow title="" items={similarMovies} type="movie" />
              </div>
            )}

            {/* Reviews */}
            <Reviews contentId={movieId} />
          </div>
        </main>
      )}
      <Footer />
    </div>
  )
}

