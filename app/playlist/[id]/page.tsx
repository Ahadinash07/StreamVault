'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentRow from '@/components/ContentRow'
import { FiPlay, FiHeart, FiShare, FiClock, FiUsers, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function PlaylistDetailPage() {
  const params = useParams()
  const playlistId = params.id as string
  const { moodPlaylists } = useAppSelector((state) => state.recommendations)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  const [playlist, setPlaylist] = useState<any>(null)
  const [content, setContent] = useState<any[]>([])
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const foundPlaylist = moodPlaylists.find(p => p.id === playlistId)
    if (foundPlaylist) {
      setPlaylist(foundPlaylist)

      // Get content for this playlist
      const playlistContent = foundPlaylist.contentIds.map((contentId: string) => {
        return movies.find(m => m.id === contentId) || series.find(s => s.id === contentId)
      }).filter(Boolean)

      setContent(playlistContent)
    }
  }, [playlistId, moodPlaylists, movies, series])

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Playlist Not Found</h1>
              <p className="text-gray-400 mb-6">The playlist you're looking for doesn't exist.</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <FiPlay className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <Image
            src={playlist.coverImage}
            alt={playlist.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-blue-600/80 text-white text-sm font-semibold rounded-full">
                    {playlist.mood.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Curated Playlist</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {playlist.name}
                </h1>

                <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl">
                  {playlist.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiClock className="w-5 h-5" />
                    <span>{content.length} {content.length === 1 ? 'title' : 'titles'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiUsers className="w-5 h-5" />
                    <span>AI Curated</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    <FiPlay className="w-5 h-5 mr-2" />
                    Play All
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`inline-flex items-center px-6 py-3 border-2 font-semibold rounded-lg transition-colors ${
                      isLiked
                        ? 'border-red-500 text-red-500 bg-red-500/10'
                        : 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button className="inline-flex items-center px-6 py-3 border-2 border-gray-400 text-gray-300 hover:border-white hover:text-white font-semibold rounded-lg transition-colors">
                    <FiShare className="w-5 h-5 mr-2" />
                    Share
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Playlist Content
            </h2>

            {content.length > 0 ? (
              <div className="space-y-8">
                {/* Movies Section */}
                {content.filter(item => item.type === 'movie').length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                      Movies ({content.filter(item => item.type === 'movie').length})
                    </h3>
                    <ContentRow
                      title={`Movies (${content.filter(item => item.type === 'movie').length})`}
                      items={content.filter(item => item.type === 'movie')}
                      type="movie"
                    />
                  </div>
                )}

                {/* Series Section */}
                {content.filter(item => item.type === 'series').length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                      Series ({content.filter(item => item.type === 'series').length})
                    </h3>
                    <ContentRow
                      title={`Series (${content.filter(item => item.type === 'series').length})`}
                      items={content.filter(item => item.type === 'series')}
                      type="series"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiPlay className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Content Available</h3>
                <p className="text-gray-400">
                  This playlist doesn't have any content available right now.
                </p>
              </div>
            )}
          </motion.div>

          {/* Similar Playlists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Similar Playlists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moodPlaylists
                .filter(p => p.id !== playlistId)
                .slice(0, 4)
                .map((similarPlaylist) => (
                  <Link
                    key={similarPlaylist.id}
                    href={`/playlist/${similarPlaylist.id}`}
                    className="group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-dark-100">
                      <Image
                        src={similarPlaylist.coverImage}
                        alt={similarPlaylist.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FiPlay className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      {similarPlaylist.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {similarPlaylist.contentIds.length} {similarPlaylist.contentIds.length === 1 ? 'title' : 'titles'}
                    </p>
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}