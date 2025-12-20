'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import { motion } from 'framer-motion'

export default function MoodPlaylists() {
  const [mounted, setMounted] = useState(false)
  const { moodPlaylists } = useAppSelector((state) => state.recommendations)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getContent = (contentId: string) => {
    return movies.find((m) => m.id === contentId) || series.find((s) => s.id === contentId)
  }

  if (!mounted) return null

  return (
    <div className="mb-8 md:mb-12">
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
    </div>
  )
}

