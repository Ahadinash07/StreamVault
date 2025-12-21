'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import {
  FiArrowLeft,
  FiHeart,
  FiShare,
  FiMessageSquare,
  FiEye,
  FiUser,
  FiCalendar,
  FiClock,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiSettings,
  FiSend,
  FiThumbsUp,
  FiUserPlus,
  FiStar,
  FiExternalLink,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import {
  setCurrentStream,
  followStreamer,
  subscribeToChannel,
  sendChatMessage,
  voteInPoll,
  setStreamSettings,
  connectToChat,
  disconnectFromChat
} from '@/app/features/streams/streamsSlice'

export default function StreamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const { streams, currentStream, chat, streamSettings } = useAppSelector((state) => state.streams)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [theaterMode, setTheaterMode] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const streamId = params.id as string
  const stream = streams.find(s => s.id === streamId) || currentStream

  // Set current stream on mount
  useEffect(() => {
    if (stream && stream.id !== currentStream?.id) {
      dispatch(setCurrentStream(stream))
      if (stream.chatEnabled) {
        dispatch(connectToChat())
      }
    }
  }, [stream, currentStream, dispatch])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chat.messages])

  // Handle video controls
  const togglePlayPause = () => {
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

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const toggleMute = () => {
    dispatch(setStreamSettings({
      volume: streamSettings.volume > 0 ? 0 : 1
    }))
    if (videoRef.current) {
      videoRef.current.volume = streamSettings.volume > 0 ? 0 : 1
    }
  }

  const toggleTheaterMode = () => {
    setTheaterMode(!theaterMode)
    dispatch(setStreamSettings({ theaterMode: !theaterMode }))
  }

  // Handle social interactions
  const handleFollow = () => {
    if (!isAuthenticated) return
    dispatch(followStreamer(stream!.streamer.id))
  }

  const handleSubscribe = () => {
    if (!isAuthenticated) return
    dispatch(subscribeToChannel(stream!.streamer.id))
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${stream!.streamer.displayName} - ${stream!.title}`,
        text: stream!.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Handle chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user || !newMessage.trim()) return

    dispatch(sendChatMessage({
      streamId: stream!.id,
      message: {
        userId: user.id,
        username: user.name,
        avatar: user.avatar || 'https://picsum.photos/seed/default/100/100',
        content: newMessage.trim(),
        isModerator: false,
        isSubscriber: false,
        isVIP: false,
        badges: [],
        emotes: [],
        mentions: []
      }
    }))
    setNewMessage('')
  }

  const handleVoteInPoll = (pollId: string, optionId: string) => {
    dispatch(voteInPoll({ pollId, optionId }))
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format viewer count
  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  // Format uptime
  const formatUptime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Stream Not Found</h1>
              <p className="text-gray-400 mb-8">The stream you're looking for doesn't exist or has ended.</p>
              <Link
                href="/gaming/streams"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back to Streams
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isFollowing = stream.isFollowing
  const isSubscribed = stream.isSubscribed

  return (
    <div className={`min-h-screen bg-black ${theaterMode ? 'theater-mode' : ''}`}>
      <Header />

      <main className="pt-16">
        {/* Stream Header */}
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back to Streams
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FiEye className="w-4 h-4" />
                  <span>{formatViewerCount(stream.viewerCount)} viewers</span>
                </div>
                {stream.isLive && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-500 font-semibold">LIVE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`flex ${theaterMode ? 'flex-col' : 'flex-col lg:flex-row'} gap-6 p-4 max-w-7xl mx-auto`}>
          {/* Main Stream Area */}
          <div className={`${theaterMode ? 'w-full' : 'flex-1'} space-y-4`}>
            {/* Stream Player */}
            <div className="relative bg-black rounded-lg overflow-hidden group">
              {stream.isLive ? (
                <video
                  ref={videoRef}
                  className="w-full aspect-video object-cover"
                  controls={false}
                  autoPlay
                  muted={streamSettings.volume === 0}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/api/stream" type="application/x-mpegURL" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <FiCalendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Stream Scheduled</h3>
                    <p className="text-gray-400">
                      {new Date(stream.scheduledFor!).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Stream Overlay */}
              {stream.isLive && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlayPause}
                        className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        {isPlaying ? <FiPause className="w-6 h-6" /> : <FiPlay className="w-6 h-6" />}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        {streamSettings.volume === 0 ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
                      </button>

                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        <FiSettings className="w-5 h-5" />
                      </button>

                      <button
                        onClick={toggleTheaterMode}
                        className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        {theaterMode ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stream Info Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 max-w-md">
                  <h1 className="text-white font-bold text-lg mb-1">{stream.title}</h1>
                  <p className="text-gray-300 text-sm line-clamp-2">{stream.description}</p>
                </div>

                {stream.isLive && (
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    LIVE
                  </div>
                )}
              </div>
            </div>

            {/* Stream Actions */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleFollow}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isFollowing
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FiHeart className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>

                {stream.subscriptionsEnabled && (
                  <button
                    onClick={handleSubscribe}
                    disabled={!isAuthenticated}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isSubscribed
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FiStar className={`w-5 h-5 ${isSubscribed ? 'fill-current' : ''}`} />
                    <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiShare className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <FiEye className="w-4 h-4" />
                  <span>{formatViewerCount(stream.viewerCount)}</span>
                </div>
                {stream.isLive && (
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>{formatUptime(stream.streamStats.uptime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stream Details */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <Image
                  src={stream.streamer.avatar}
                  alt={stream.streamer.displayName}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{stream.streamer.displayName}</h2>
                    {stream.streamer.isVerified && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <FiStar className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{stream.streamer.bio}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatViewerCount(stream.streamer.followerCount)} followers</span>
                    <span>{formatViewerCount(stream.streamer.totalViews)} total views</span>
                  </div>
                </div>
              </div>

              {/* Stream Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatViewerCount(stream.viewerCount)}</div>
                  <div className="text-sm text-gray-400">Viewers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatViewerCount(stream.peakViewers)}</div>
                  <div className="text-sm text-gray-400">Peak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stream.streamStats.newFollowers}</div>
                  <div className="text-sm text-gray-400">New Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stream.streamStats.chatMessages}</div>
                  <div className="text-sm text-gray-400">Chat Messages</div>
                </div>
              </div>

              {/* Stream Tags */}
              <div className="flex flex-wrap gap-2">
                {stream.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full border border-purple-600/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stream Goals */}
            {stream.goals.filter(goal => goal.isActive).map((goal) => (
              <div key={goal.id} className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                  <span className="text-sm text-gray-400">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-gray-300 text-sm">{goal.description}</p>
              </div>
            ))}

            {/* Polls */}
            {stream.polls.filter(poll => poll.isActive).map((poll) => (
              <div key={poll.id} className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{poll.question}</h3>
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleVoteInPoll(poll.id, option.id)}
                      className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 group-hover:text-white">{option.text}</span>
                        <span className="text-sm text-gray-500">{option.votes} votes</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-500 mt-4">
                  Total votes: {poll.totalVotes}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Sidebar */}
          <AnimatePresence>
            {showChat && stream.chatEnabled && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: theaterMode ? '100%' : 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className={`${theaterMode ? 'w-full mt-6' : 'w-80'} bg-gray-900 rounded-lg overflow-hidden flex flex-col`}
              >
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Live Chat</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                >
                  {chat.messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Image
                        src={message.avatar}
                        alt={message.username}
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{message.username}</span>
                          {message.isModerator && (
                            <span className="text-green-500 text-xs">MOD</span>
                          )}
                          {message.isSubscriber && (
                            <span className="text-purple-500 text-xs">SUB</span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm break-words">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                {isAuthenticated ? (
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 border-t border-gray-800 text-center">
                    <p className="text-gray-400 text-sm mb-2">Sign in to chat</p>
                    <Link
                      href="/login"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show Chat Toggle */}
          {!showChat && stream.chatEnabled && (
            <button
              onClick={() => setShowChat(true)}
              className="fixed bottom-4 right-4 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
            >
              <FiMessageSquare className="w-6 h-6" />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
