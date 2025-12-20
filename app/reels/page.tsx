'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { setCurrentReel, togglePlayPause, likeReel, markReelWatched, shareReel } from '../features/reels/reelsSlice'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiHeart, FiMessageCircle, FiShare, FiPlay, FiPause, FiVolume2, FiVolumeX, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Reel } from '@/types/content'

export default function ReelsPage() {
  const dispatch = useAppDispatch()
  const { reels, currentReel, isPlaying, likedReels } = useAppSelector((state) => state.reels)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)

  // Filter reels for display
  const displayReels = reels

  // Auto-play logic
  useEffect(() => {
    if (currentReel && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Handle autoplay restrictions
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [currentReel, isPlaying])

  // Handle video end
  useEffect(() => {
    if (videoRef.current) {
      const handleEnded = () => {
        if (currentIndex < displayReels.length - 1) {
          goToNextReel()
        }
      }

      videoRef.current.addEventListener('ended', handleEnded)
      return () => videoRef.current?.removeEventListener('ended', handleEnded)
    }
  }, [currentIndex, displayReels])

  // Intersection Observer for auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            if (index !== currentIndex) {
              setCurrentIndex(index)
              dispatch(setCurrentReel(displayReels[index]))
              dispatch(markReelWatched(displayReels[index].id))
            }
          }
        })
      },
      { threshold: 0.7 }
    )

    const videoElements = document.querySelectorAll('[data-index]')
    videoElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [currentIndex, displayReels, dispatch])

  const goToNextReel = useCallback(() => {
    if (currentIndex < displayReels.length - 1) {
      setCurrentIndex(currentIndex + 1)
      dispatch(setCurrentReel(displayReels[currentIndex + 1]))
      dispatch(markReelWatched(displayReels[currentIndex].id))
    }
  }, [currentIndex, displayReels, dispatch])

  const goToPrevReel = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      dispatch(setCurrentReel(displayReels[currentIndex - 1]))
      dispatch(markReelWatched(displayReels[currentIndex].id))
    }
  }, [currentIndex, displayReels, dispatch])

  const handleLike = (reelId: string) => {
    dispatch(likeReel(reelId))
  }

  const handleShare = (reelId: string) => {
    dispatch(shareReel(reelId))
    if (navigator.share) {
      navigator.share({
        title: 'Check out this reel!',
        url: window.location.href
      })
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY.current

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        goToNextReel()
      } else {
        goToPrevReel()
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  // Mobile-first responsive design
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Reels</h1>
              <p className="text-gray-300 text-lg max-w-3xl">
                Discover short-form content, trailers, behind-the-scenes footage, and trending clips
                from your favorite movies and series.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Reels List */}
              <div className="lg:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-white mb-4">Explore Reels</h2>
                {displayReels.map((reel, index) => (
                  <div
                    key={reel.id}
                    onClick={() => {
                      setCurrentIndex(index)
                      dispatch(setCurrentReel(reel))
                      dispatch(markReelWatched(reel.id))
                    }}
                    className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                      currentReel?.id === reel.id
                        ? 'ring-2 ring-blue-500 shadow-lg'
                        : 'hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={reel.thumbnail}
                        alt={reel.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <FiPlay className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(reel.duration)}
                      </div>
                      {reel.isTrending && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                          TRENDING
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-dark-100">
                      <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{reel.title}</h3>
                      <p className="text-gray-400 text-xs">{reel.creator}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{formatViews(reel.views)} views</span>
                        <span>{reel.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video Player */}
              <div className="lg:col-span-3">
                {currentReel ? (
                  <div className="sticky top-24">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        src={currentReel.videoUrl}
                        poster={currentReel.thumbnail}
                        className="w-full h-full object-cover"
                        muted={isMuted}
                        playsInline
                        onClick={() => dispatch(togglePlayPause())}
                      />

                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => dispatch(togglePlayPause())}
                          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          {isPlaying ? (
                            <FiPause className="w-8 h-8 text-white" />
                          ) : (
                            <FiPlay className="w-8 h-8 text-white ml-1" />
                          )}
                        </button>
                      </div>

                      {/* Top Controls */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          {isMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-white font-semibold text-lg mb-2">{currentReel.title}</h2>
                        <p className="text-gray-300 text-sm mb-2">{currentReel.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{currentReel.creator}</span>
                          <span>•</span>
                          <span>{formatViews(currentReel.views)} views</span>
                          <span>•</span>
                          <span>{new Date(currentReel.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLike(currentReel.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            likedReels.includes(currentReel.id)
                              ? 'text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <FiHeart className={`w-6 h-6 ${likedReels.includes(currentReel.id) ? 'fill-current' : ''}`} />
                          <span>{currentReel.likes}</span>
                        </button>

                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <FiMessageCircle className="w-6 h-6" />
                          <span>Comments</span>
                        </button>

                        <button
                          onClick={() => handleShare(currentReel.id)}
                          className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
                        >
                          <FiShare className="w-6 h-6" />
                          <span>Share</span>
                        </button>
                      </div>

                      {currentReel.relatedContent && (
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Related to</p>
                          <p className="text-white font-medium">{currentReel.relatedContent.title}</p>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentReel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-dark-100 text-gray-300 rounded-full text-sm hover:bg-dark-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-dark-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FiPlay className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Select a reel to start watching</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trending Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {reels
                  .filter(reel => reel.isTrending)
                  .slice(0, 12)
                  .map((reel) => (
                    <div
                      key={reel.id}
                      onClick={() => {
                        const index = displayReels.indexOf(reel)
                        setCurrentIndex(index)
                        dispatch(setCurrentReel(reel))
                        dispatch(markReelWatched(reel.id))
                      }}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <img
                          src={reel.thumbnail}
                          alt={reel.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FiPlay className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                          🔥
                        </div>
                      </div>
                      <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">{reel.title}</h3>
                      <p className="text-gray-400 text-xs">{formatViews(reel.views)} views</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Full Screen Vertical Scrolling */}
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black z-50">
            {/* Mobile Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => window.history.back()}
                  className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                  aria-label="Close reels"
                >
                  <FiX className="w-5 h-5" />
                </button>
                <h1 className="text-white font-semibold">Reels</h1>
                <div className="w-8" /> {/* Spacer */}
              </div>
            </div>

            {/* Reels Container */}
            <div
              ref={containerRef}
              className="h-full overflow-y-auto snap-y snap-mandatory"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {displayReels.map((reel, index) => (
                <div
                  key={reel.id}
                  data-index={index}
                  className="h-screen snap-start relative flex items-center justify-center"
                >
                  {/* Video Background */}
                  <video
                    ref={index === currentIndex ? videoRef : null}
                    src={reel.videoUrl}
                    poster={reel.thumbnail}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted={isMuted}
                    playsInline
                    loop
                    autoPlay={index === currentIndex}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Content Overlay */}
                  <div className="relative z-10 w-full h-full flex">
                    {/* Left Side - Action Buttons */}
                    <div className="w-16 flex flex-col items-center justify-end pb-20 space-y-6 mr-4">
                      <button
                        onClick={() => handleLike(reel.id)}
                        className={`p-2 rounded-full transition-colors ${
                          likedReels.includes(reel.id)
                            ? 'text-red-500'
                            : 'text-white hover:text-red-500'
                        }`}
                        aria-label="Like this reel"
                      >
                        <FiHeart className={`w-7 h-7 ${likedReels.includes(reel.id) ? 'fill-current' : ''}`} />
                      </button>
                      <div className="text-white text-xs text-center">
                        <div className="font-semibold">{reel.likes}</div>
                        <div className="text-gray-300">likes</div>
                      </div>

                      <button
                        onClick={() => {/* Comments */}}
                        className="p-2 rounded-full text-white hover:text-blue-500 transition-colors"
                        aria-label="View comments"
                      >
                        <FiMessageCircle className="w-7 h-7" />
                      </button>
                      <div className="text-white text-xs text-center">
                        <div className="font-semibold">42</div>
                        <div className="text-gray-300">comments</div>
                      </div>

                      <button
                        onClick={() => handleShare(reel.id)}
                        className="p-2 rounded-full text-white hover:text-green-500 transition-colors"
                        aria-label="Share this reel"
                      >
                        <FiShare className="w-7 h-7" />
                      </button>
                      <div className="text-white text-xs text-center">
                        <div className="font-semibold">Share</div>
                      </div>
                    </div>

                    {/* Center - Video Info */}
                    <div className="flex-1 flex flex-col justify-end pb-20 px-4">
                      <div className="text-white">
                        <h2 className="font-bold text-lg mb-2">{reel.title}</h2>
                        <p className="text-gray-200 text-sm mb-3 line-clamp-2">{reel.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                          <span className="font-medium">{reel.creator}</span>
                          <span>•</span>
                          <span>{formatViews(reel.views)} views</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {reel.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/20 text-white rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Related Content */}
                        {reel.relatedContent && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                            <p className="text-gray-300 text-xs mb-1">Related to</p>
                            <p className="text-white font-medium text-sm">{reel.relatedContent.title}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Navigation */}
                    <div className="w-16 flex flex-col items-center justify-center space-y-4">
                      <button
                        onClick={goToPrevReel}
                        disabled={index === 0}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous reel"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="text-white text-xs text-center">
                        <div className="w-1 h-1 bg-white rounded-full mx-auto mb-1" />
                        <div className="text-gray-400 text-xs">{index + 1}/{displayReels.length}</div>
                      </div>
                      <button
                        onClick={goToNextReel}
                        disabled={index === displayReels.length - 1}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next reel"
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="absolute top-16 left-4 right-4">
                    <div className="flex gap-1">
                      {displayReels.map((_, i) => (
                        <div
                          key={i}
                          className={`h-0.5 flex-1 rounded-full transition-colors ${
                            i === index ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Trending Badge */}
                  {reel.isTrending && (
                    <div className="absolute top-20 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      🔥 TRENDING
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
                </button>
                <div className="text-white text-center">
                  <div className="text-sm font-medium">Tap to play/pause</div>
                  <div className="text-xs text-gray-400">Swipe up/down to navigate</div>
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}