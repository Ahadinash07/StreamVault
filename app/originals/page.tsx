'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentRow from '@/components/ContentRow'
import { useAppSelector } from '../hooks'

export default function OriginalsPage() {
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  // Filter for original content (assuming isOriginal flag exists)
  const originalMovies = movies.filter(movie => movie.isOriginal)
  const originalSeries = series.filter(show => show.isOriginal)

  const featuredOriginals = [...originalMovies.slice(0, 3), ...originalSeries.slice(0, 2)]
  const newOriginals = [...originalMovies.slice(3, 8), ...originalSeries.slice(2, 5)]
  const trendingOriginals = [...originalMovies.slice(8, 13), ...originalSeries.slice(5, 8)]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">StreamVault Originals</h1>
            <p className="text-gray-300 text-lg max-w-3xl">
              Exclusive content created exclusively for StreamVault. From groundbreaking series
              to original films, discover stories that can only be found here.
            </p>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="relative h-[60vh] rounded-lg overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://picsum.photos/seed/originals-hero/1920/1080')`
                }}
              />
              <div className="absolute bottom-8 left-8 z-20 max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Exclusive Original Content
                </h2>
                <p className="text-gray-200 text-lg">
                  Groundbreaking stories, innovative formats, and unforgettable experiences
                  that push the boundaries of entertainment.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            <ContentRow
              title="Featured Originals"
              items={featuredOriginals}
              type="movie"
            />

            <ContentRow
              title="New Original Releases"
              items={newOriginals}
              type="movie"
            />

            <ContentRow
              title="Trending Originals"
              items={trendingOriginals}
              type="movie"
            />

            {/* Original Series Spotlight */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Original Series Spotlight</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {originalSeries.slice(0, 6).map((show, index) => (
                  <div key={show.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={show.backdrop}
                        alt={show.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <span className="text-black text-xl">▶</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{show.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{show.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Original Films */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Original Films</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {originalMovies.slice(0, 8).map((movie, index) => (
                  <div key={movie.id} className="group cursor-pointer">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <span className="text-black text-xl">▶</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">{movie.releaseDate.split('-')[0]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why StreamVault Originals */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Why StreamVault Originals?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🎬</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Bold Storytelling</h3>
                  <p className="text-gray-300 text-sm">
                    Unconventional narratives and innovative formats that challenge traditional entertainment.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🌟</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Star Power</h3>
                  <p className="text-gray-300 text-sm">
                    A-list talent bringing exclusive performances and fresh collaborations.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🎭</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Diverse Voices</h3>
                  <p className="text-gray-300 text-sm">
                    Authentic stories from underrepresented creators and global perspectives.
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Coming Soon</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">"Midnight Chronicles"</h3>
                  <p className="text-gray-300 mb-4">
                    A supernatural thriller series exploring the hidden world of urban legends.
                    Premieres February 2025.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Genre: Supernatural Thriller</span>
                    <span>8 Episodes</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">"Code Red"</h3>
                  <p className="text-gray-300 mb-4">
                    A high-stakes cyber thriller about hackers fighting corporate corruption.
                    Premieres March 2025.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Genre: Cyber Thriller</span>
                    <span>10 Episodes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}