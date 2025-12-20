'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentRow from '@/components/ContentRow'
import { FiClock, FiSun, FiMoon, FiCoffee, FiFilm, FiTv, FiPlay, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface TimeBasedContent {
  timeOfDay: string
  icon: React.ReactNode
  title: string
  description: string
  content: any[]
  color: string
}

export default function PerfectForRightNowPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeBasedContent, setTimeBasedContent] = useState<TimeBasedContent[]>([])
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Generate time-based content suggestions
    const hour = currentTime.getHours()
    const allContent = [...movies, ...series]

    let timeContent: TimeBasedContent[] = []

    if (hour >= 6 && hour < 12) {
      // Morning (6 AM - 12 PM)
      timeContent = [
        {
          timeOfDay: 'morning',
          icon: <FiSun className="w-6 h-6" />,
          title: 'Morning Motivation',
          description: 'Start your day with inspiring and uplifting content',
          content: allContent.filter(item =>
            item.genres?.some((genre: string) =>
              ['Drama', 'Biography', 'Documentary', 'Adventure'].includes(genre)
            )
          ).slice(0, 8),
          color: 'from-yellow-400 to-orange-500'
        },
        {
          timeOfDay: 'morning-coffee',
          icon: <FiCoffee className="w-6 h-6" />,
          title: 'Coffee Break Classics',
          description: 'Light-hearted content perfect with your morning coffee',
          content: allContent.filter(item =>
            item.genres?.some((genre: string) =>
              ['Comedy', 'Romance', 'Family'].includes(genre)
            )
          ).slice(0, 8),
          color: 'from-amber-400 to-yellow-600'
        }
      ]
    } else if (hour >= 12 && hour < 17) {
      // Afternoon (12 PM - 5 PM)
      timeContent = [
        {
          timeOfDay: 'afternoon',
          icon: <FiSun className="w-6 h-6" />,
          title: 'Afternoon Adventures',
          description: 'Exciting content to keep you energized',
          content: allContent.filter(item =>
            item.genres?.some((genre: string) =>
              ['Action', 'Adventure', 'Sci-Fi', 'Thriller'].includes(genre)
            )
          ).slice(0, 8),
          color: 'from-blue-400 to-purple-500'
        },
        {
          timeOfDay: 'afternoon-relax',
          icon: <FiCoffee className="w-6 h-6" />,
          title: 'Afternoon Relaxation',
          description: 'Calm and engaging content for your afternoon break',
          content: allContent.filter(item =>
            item.genres?.some((genre: string) =>
              ['Drama', 'Romance', 'Mystery'].includes(genre)
            )
          ).slice(0, 8),
          color: 'from-green-400 to-teal-500'
        }
      ]
    } else if (hour >= 17 && hour < 21) {
      // Evening (5 PM - 9 PM)
      timeContent = [
        {
          timeOfDay: 'evening',
          icon: <FiSun className="w-6 h-6" />,
          title: 'Evening Entertainment',
          description: 'Perfect content for your evening unwind',
          content: allContent.filter(item =>
            item.genres?.some((genre: string) =>
              ['Comedy', 'Romance', 'Family', 'Animation'].includes(genre)
            )
          ).slice(0, 8),
          color: 'from-purple-400 to-pink-500'
        },
        {
          timeOfDay: 'evening-dinner',
          icon: <FiPlay className="w-6 h-6" />,
          title: 'Dinner Time Viewing',
          description: 'Great content to enjoy while having dinner',
          content: allContent.filter(item =>
            item.rating >= 7.5 &&
            item.genres?.some((genre: string) =>
              ['Drama', 'Comedy', 'Crime'].includes(genre)
            )
          ).slice(0, 8),
          color: 'from-red-400 to-pink-500'
        }
      ]
    } else {
      // Night (9 PM - 6 AM)
      timeContent = [
        {
          timeOfDay: 'night',
          icon: <FiMoon className="w-6 h-6" />,
          title: 'Night Time Viewing',
          description: 'Captivating content for late night entertainment',
          content: allContent.filter(item =>
            item.genres?.some((genre: string) =>
              ['Thriller', 'Horror', 'Mystery', 'Sci-Fi'].includes(genre)
            )
          ).slice(0, 8),
          color: 'from-indigo-400 to-purple-600'
        },
        {
          timeOfDay: 'night-winddown',
          icon: <FiStar className="w-6 h-6" />,
          title: 'Wind Down Classics',
          description: 'Relaxing content to help you unwind before bed',
          content: allContent.filter(item =>
            item.genres?.some((genre: string) =>
              ['Drama', 'Romance', 'Documentary'].includes(genre)
            ) && item.rating >= 8.0
          ).slice(0, 8),
          color: 'from-blue-400 to-indigo-600'
        }
      ]
    }

    setTimeBasedContent(timeContent)
  }, [currentTime, movies, series])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) return 'Good Morning'
    if (hour >= 12 && hour < 17) return 'Good Afternoon'
    if (hour >= 17 && hour < 22) return 'Good Evening'
    return 'Good Night'
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiClock className="w-8 h-8 text-blue-400" />
                <div className="text-6xl font-bold text-white">
                  {formatTime(currentTime)}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {getGreeting()}! 🎬
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Perfect content suggestions based on the current time
              </p>

              <div className="flex items-center justify-center gap-4 text-gray-400">
                <FiStar className="w-5 h-5" />
                <span>AI-powered recommendations</span>
                <span>•</span>
                <span>Updated in real-time</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Time-Based Content Sections */}
        <div className="container mx-auto px-4 py-12">
          {timeBasedContent.map((section, index) => (
            <motion.div
              key={section.timeOfDay}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="mb-16"
            >
              <div className={`bg-gradient-to-r ${section.color} p-8 rounded-2xl mb-8`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {section.title}
                    </h2>
                    <p className="text-white/90 text-lg">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              {section.content.length > 0 ? (
                <ContentRow
                  title={section.title}
                  items={section.content}
                  type={section.content[0]?.type || 'movie'}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    No content available for this time slot right now.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Why This Works Section */}
        <div className="bg-dark-100 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Why Time Matters for Entertainment
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSun className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Morning Energy</h3>
                  <p className="text-gray-400">
                    Uplifting content to start your day with positive vibes and motivation.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCoffee className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Afternoon Focus</h3>
                  <p className="text-gray-400">
                    Engaging content that helps maintain concentration during work hours.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMoon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Evening Relaxation</h3>
                  <p className="text-gray-400">
                    Calming content perfect for unwinding and preparing for rest.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}