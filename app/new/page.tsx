'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentRow from '@/components/ContentRow'
import { useAppSelector } from '../hooks'

export default function NewPage() {
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  // Sort by release date (newest first)
  const newMovies = [...movies].sort((a, b) =>
    new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  ).slice(0, 10)

  const newSeries = [...series].sort((a, b) =>
    new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  ).slice(0, 8)

  // Popular content (highest rated)
  const popularMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10)
  const popularSeries = [...series].sort((a, b) => b.rating - a.rating).slice(0, 8)

  // Trending (combination of new and popular)
  const trendingMovies = [...movies]
    .sort((a, b) => (b.rating * 0.7 + (new Date(b.releaseDate).getTime() / 1000000000) * 0.3) -
                     (a.rating * 0.7 + (new Date(a.releaseDate).getTime() / 1000000000) * 0.3))
    .slice(0, 10)

  const trendingSeries = [...series]
    .sort((a, b) => (b.rating * 0.7 + (new Date(b.releaseDate).getTime() / 1000000000) * 0.3) -
                     (a.rating * 0.7 + (new Date(a.releaseDate).getTime() / 1000000000) * 0.3))
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">New & Popular</h1>
            <p className="text-gray-300 text-lg max-w-3xl">
              Discover the latest releases and most talked-about content. From fresh arrivals
              to trending favorites, find what's capturing everyone's attention.
            </p>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="relative h-[50vh] rounded-lg overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://picsum.photos/seed/new-popular-hero/1920/1080')`
                }}
              />
              <div className="absolute bottom-8 left-8 z-20 max-w-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Fresh Content Every Week
                </h2>
                <p className="text-gray-200">
                  New movies, series, and exclusive content added regularly.
                  Never run out of things to watch.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            <ContentRow
              title="Brand New Releases"
              items={newMovies}
              type="movie"
            />

            <ContentRow
              title="New TV Series"
              items={newSeries}
              type="series"
            />

            <ContentRow
              title="Trending Now"
              items={trendingMovies}
              type="movie"
            />

            <ContentRow
              title="Popular Movies"
              items={popularMovies}
              type="movie"
            />

            <ContentRow
              title="Popular Series"
              items={popularSeries}
              type="series"
            />

            {/* Weekly Highlights */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">This Week's Highlights</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newMovies.slice(0, 6).map((movie, index) => (
                  <div key={movie.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={movie.backdrop}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        NEW
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <span className="text-black text-xl">▶</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{movie.releaseDate.split('-')[0]}</span>
                      <span>•</span>
                      <span>★ {movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming This Month */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Coming This Month</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Movie Releases</h3>
                  <div className="space-y-3">
                    {newMovies.slice(0, 4).map((movie, index) => (
                      <div key={movie.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{movie.title}</h4>
                          <p className="text-gray-400 text-sm">{movie.releaseDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Series Premieres</h3>
                  <div className="space-y-3">
                    {newSeries.slice(0, 4).map((show, index) => (
                      <div key={show.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{show.title}</h4>
                          <p className="text-gray-400 text-sm">{show.releaseDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Popularity Metrics */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">What's Hot Right Now</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-2">🔥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Most Watched</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {popularMovies[0]?.title || 'Loading...'}
                  </p>
                  <div className="text-yellow-400 text-sm">
                    ★ {popularMovies[0]?.rating.toFixed(1) || '0.0'} rating
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500 mb-2">📈</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Rising Fast</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {trendingMovies[0]?.title || 'Loading...'}
                  </p>
                  <div className="text-green-400 text-sm">
                    Trending this week
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">🆕</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Fresh Arrival</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {newMovies[0]?.title || 'Loading...'}
                  </p>
                  <div className="text-blue-400 text-sm">
                    Released {newMovies[0]?.releaseDate || 'recently'}
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Never Miss New Releases</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get notified when new movies and series arrive. Join thousands of subscribers
                who stay ahead of the entertainment curve.
              </p>
              <div className="max-w-md mx-auto flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}