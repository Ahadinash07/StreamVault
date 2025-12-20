'use client'

import { useState, useRef, useEffect } from 'react'
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiX, FiSkipForward, FiSkipBack } from 'react-icons/fi'
import { Movie, Series, Episode } from '@/types/content'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { updateProgress } from '@/app/features/user/watchProgressSlice'

interface VideoPlayerProps {
  content: Movie | Series
  episode?: Episode
  season?: any
  onClose: () => void
}

export default function VideoPlayer({ content, episode, season, onClose }: VideoPlayerProps) {
  const dispatch = useAppDispatch()
  const { progress } = useAppSelector((state) => state.watchProgress)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Get progress key
  const progressKey = episode 
    ? `${content.id}-${season?.id}-${episode.id}`
    : content.id

  // Load saved progress after video is loaded
  useEffect(() => {
    const handleLoadedData = () => {
      const savedProgress = progress[progressKey]
      if (savedProgress && videoRef.current) {
        videoRef.current.currentTime = savedProgress.currentTime
        setCurrentTime(savedProgress.currentTime)
      }
    }

    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleLoadedData)
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleLoadedData)
        }
      }
    }
  }, [progressKey, progress])

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0)
    }
  }, [])

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && duration > 0) {
        dispatch(updateProgress({
          contentId: content.id,
          episodeId: episode?.id,
          seasonId: season?.id,
          currentTime: videoRef.current.currentTime,
          duration,
          lastWatched: new Date().toISOString(),
          type: content.type,
        }))
      }
    }, 5000) // Save every 5 seconds

    return () => clearInterval(interval)
  }, [content.id, episode?.id, season?.id, duration, dispatch])

  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <FiX className="w-6 h-6" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration)
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          autoPlay
        >
          <source 
            src={episode?.videoUrl || (content.type === 'movie' ? content.videoUrl : content.trailer) || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>

        {/* Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
              }}
            />
            <div className="flex items-center justify-between mt-1 text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPlaying ? (
                <FiPause className="w-6 h-6" />
              ) : (
                <FiPlay className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiSkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiSkipForward className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 flex-1">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <FiVolumeX className="w-5 h-5" />
                ) : (
                  <FiVolume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm">
                {episode
                  ? `S${season?.seasonNumber} E${episode.episodeNumber}`
                  : content.title}
              </span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiMaximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

