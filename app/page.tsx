'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ContentRow from '@/components/ContentRow'
import ContinueWatching from '@/components/ContinueWatching'
import MoodPlaylists from '@/components/MoodPlaylists'
import Recommendations from '@/components/Recommendations'
import Achievements from '@/components/Achievements'
import SocialFeatures from '@/components/SocialFeatures'
import { useAppSelector } from './hooks'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const {
    trendingMovies,
    topRatedMovies,
    newReleases: newMovies,
  } = useAppSelector((state) => state.movies)
  const { trendingSeries, topRatedSeries } = useAppSelector((state) => state.series)
  const { user } = useAppSelector((state) => state.user)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main>
          <div className="h-[60vh] md:h-[80vh] lg:h-[90vh] w-full bg-dark-100 animate-pulse" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <div className="mt-8 md:mt-12">
          <ContinueWatching />
          <MoodPlaylists />
          <Recommendations />
          <Achievements />

          {/* Social Features - Unique to StreamVault */}
          <div className="mb-8 md:mb-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
              Community Hub
            </h2>
            <SocialFeatures />
          </div>

          {/* Reels Section - Short-form content */}
          <div className="mb-8 md:mb-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                Trending Reels
              </h2>
              <a
                href="/reels"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                View All →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Mock reel thumbnails - in real app, this would come from reels state */}
              {Array.from({ length: 12 }, (_, i) => (
                <a
                  key={i}
                  href="/reels"
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-2 bg-dark-100">
                    <img
                      src={`https://picsum.photos/seed/reel${i}/300/500`}
                      alt={`Reel ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">▶</span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(Math.random() * 60) + 15}s
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {['Behind the scenes', 'Trailer clip', 'Fan reaction', 'Movie review'][i % 4]}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <ContentRow title="Trending Now" items={trendingMovies} type="movie" />
          <ContentRow title="Top Rated Movies" items={topRatedMovies} type="movie" />
          <ContentRow title="New Releases" items={newMovies} type="movie" />
          <ContentRow title="Trending Series" items={trendingSeries} type="series" />
          <ContentRow title="Top Rated Series" items={topRatedSeries} type="series" />
          <ContentRow
            title="Because You Watched"
            items={trendingMovies.slice(0, 10)}
            type="movie"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

