'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiPlay, FiInfo } from 'react-icons/fi'
import { useAppSelector } from '@/app/hooks'
import { Movie, Series } from '@/types/content'

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const featuredMovie = useAppSelector((state) => state.movies.featuredMovie)
  const featuredSeries = useAppSelector((state) => state.series.featuredSeries)

  useEffect(() => {
    setMounted(true)
  }, [])

  const featured = featuredMovie || featuredSeries

  if (!mounted || !featured) return null

  return (
    <div className="relative h-[60vh] md:h-[80vh] lg:h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <Image
          src={featured.backdrop}
          alt={featured.title}
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {featured.title}
            </h1>
            <div className="flex items-center space-x-4 mb-4 text-sm md:text-base">
              <span className="px-3 py-1 bg-green-500 text-black font-semibold rounded">
                {featured.rating.toFixed(1)} Rating
              </span>
              <span>{new Date(featured.releaseDate).getFullYear()}</span>
              {featured.type === 'movie' && (
                <span>{Math.floor(featured.duration / 60)}h {featured.duration % 60}m</span>
              )}
              <span className="px-3 py-1 border border-white/30 rounded">
                {featured.maturityRating}
              </span>
            </div>
            <p className="text-gray-200 mb-6 text-sm md:text-base lg:text-lg line-clamp-3">
              {featured.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${featured.type === 'movie' ? 'movies' : 'series'}/${featured.id}`}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-semibold"
              >
                <FiPlay className="w-5 h-5" />
                <span>Play</span>
              </Link>
              <Link
                href={`/${featured.type === 'movie' ? 'movies' : 'series'}/${featured.id}`}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-md hover:bg-white/30 transition-colors font-semibold"
              >
                <FiInfo className="w-5 h-5" />
                <span>More Info</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

