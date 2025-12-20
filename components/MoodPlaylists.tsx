'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import { motion } from 'framer-motion'
import { generateMoodPlaylists, getPersonalizedMoodSuggestions, MoodPlaylist } from '@/utils/moodDetection'
import ContentRow from './ContentRow'
import { FiStar, FiClock } from 'react-icons/fi'

export default function MoodPlaylists() {
  const [mounted, setMounted] = useState(false)
  const [enhancedPlaylists, setEnhancedPlaylists] = useState<MoodPlaylist[]>([])
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const { moodPlaylists } = useAppSelector((state) => state.recommendations)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)
  const watchProgressState = useAppSelector((state) => state.watchProgress)

  useEffect(() => {
    setMounted(true)
    // Generate enhanced mood playlists
    const playlists = generateMoodPlaylists(movies, series)
    setEnhancedPlaylists(playlists)
  }, [movies, series])

  // Get user's watch history for personalized suggestions
  const userHistory = Object.values(watchProgressState.progress)
    .filter(progress => progress.currentTime / progress.duration > 0.8) // Watched more than 80%
    .map(progress => {
      const movie = movies.find(m => m.id === progress.contentId)
      const show = series.find(s => s.id === progress.contentId)
      return movie || show
    })
    .filter(Boolean) as (typeof movies[0] | typeof series[0])[]

  const personalizedSuggestions = getPersonalizedMoodSuggestions(userHistory)

  const getContent = (contentId: string) => {
    return movies.find((m) => m.id === contentId) || series.find((s) => s.id === contentId)
  }

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(selectedMood === moodId ? null : moodId)
  }

  if (!mounted) return null

  return (
    <div className="mb-8 md:mb-12">
      {/* AI-Powered Mood Recommendations */}
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiStar className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">AI Mood Recommendations</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Personalized suggestions based on your viewing history and current mood
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedSuggestions.slice(0, 6).map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handleMoodSelect(playlist.id)}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  selectedMood === playlist.id
                    ? 'border-purple-400 bg-purple-600/20'
                    : 'border-gray-600 hover:border-purple-400 hover:bg-purple-600/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{playlist.emoji}</span>
                  <div>
                    <h3 className="text-white font-semibold text-left">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm text-left">{playlist.content.length} items</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm text-left">{playlist.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Mood Content */}
      {selectedMood && (
        <div className="mb-12 px-4 sm:px-6 lg:px-8">
          {enhancedPlaylists
            .filter(playlist => playlist.id === selectedMood)
            .map((playlist) => (
              <div key={playlist.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${playlist.color} flex items-center justify-center`}>
                    <span className="text-2xl">{playlist.emoji}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{playlist.name}</h3>
                    <p className="text-gray-300">{playlist.description}</p>
                  </div>
                </div>

                {playlist.content.length > 0 ? (
                  <ContentRow
                    title=""
                    items={playlist.content}
                    type={playlist.content[0]?.type || 'movie'}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No content available for this mood yet.</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Original Mood Playlists */}
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 px-4 sm:px-6 lg:px-8">
        Mood-Based Playlists
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8">
        {moodPlaylists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link href={`/playlist/${playlist.id}`}>
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-dark-100">
                <Image
                  src={playlist.coverImage}
                  alt={playlist.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg mb-1">{playlist.name}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{playlist.description}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {playlist.contentIds.length} {playlist.contentIds.length === 1 ? 'title' : 'titles'}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Time-Based Suggestions */}
      <div className="mt-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiClock className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Perfect for Right Now</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Content suggestions based on the current time of day
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {enhancedPlaylists.slice(0, 4).map((playlist) => (
              <div
                key={playlist.id}
                className="p-4 rounded-lg bg-dark-100 border border-dark-200 hover:border-green-400 transition-colors cursor-pointer"
                onClick={() => handleMoodSelect(playlist.id)}
              >
                <div className="text-center">
                  <span className="text-3xl mb-2 block">{playlist.emoji}</span>
                  <h3 className="text-white font-semibold mb-1">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm">{playlist.content.length} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

