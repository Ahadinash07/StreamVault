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

