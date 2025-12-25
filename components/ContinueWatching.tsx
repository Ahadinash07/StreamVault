'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import { Movie, Series } from '@/types/content'
import { FiPlay } from 'react-icons/fi'

export default function ContinueWatching() {
  const [mounted, setMounted] = useState(false)
  const { progress } = useAppSelector((state) => state.watchProgress)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  useEffect(() => {
    setMounted(true)
  }, [])

  const continueWatching = useMemo(() => {
    const items: Array<{
      content: Movie | Series
      progress: number
      episode?: { id: string; title: string; seasonId?: string }
    }> = []

    Object.entries(progress)
      .sort(([, a], [, b]) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
      .slice(0, 10)
      .forEach(([key, prog]) => {
        if (prog.type === 'movie') {
          const movie = movies.find((m) => m.id === prog.contentId)
          if (movie && prog.currentTime < prog.duration * 0.9) {
            items.push({
              content: movie,
              progress: (prog.currentTime / prog.duration) * 100,
            })
          }
        } else {
          const s = series.find((s) => s.id === prog.contentId)
          if (s && prog.episodeId) {
            const season = s.seasons.find((se) => se.id === prog.seasonId)
            const episode = season?.episodes.find((e) => e.id === prog.episodeId)
            if (episode && prog.currentTime < prog.duration * 0.9) {
              items.push({
                content: s,
                progress: (prog.currentTime / prog.duration) * 100,
                episode: {
                  id: episode.id,
                  title: episode.title,
                  seasonId: prog.seasonId,
                },
              })
            }
          }
        }
      })

    return items
  }, [progress, movies, series])

  if (!mounted || continueWatching.length === 0) return null

  return (
    <div className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 px-4 sm:px-6 lg:px-8">
        Continue Watching
      </h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4">
        {continueWatching.map((item) => (
          <Link
            key={`${item.content.id}-${item.episode?.id || ''}`}
            href={`/${item.content.type === 'movie' ? 'movies' : 'series'}/${item.content.id}`}
            className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] group"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-dark-100">
              <Image
                src={item.content.backdrop}
                alt={item.content.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <FiPlay className="w-8 h-8 text-white ml-1" />
                </div>
              </div>

              {/* Content Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
                  {item.content.title}
                </h3>
                {item.episode && (
                  <p className="text-gray-300 text-sm mb-2">{item.episode.title}</p>
                )}
                <p className="text-gray-400 text-xs">
                  {Math.round(item.progress)}% watched
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

