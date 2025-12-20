'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { joinWatchParty, addWatchPartyMessage } from '@/app/features/social/socialSlice'
import { addNotification } from '@/app/features/notifications/notificationsSlice'
import {
  FiPlay,
  FiUsers,
  FiMessageCircle,
  FiSend,
  FiUser,
  FiClock,
  FiCalendar,
  FiVideo,
  FiMic,
  FiMicOff,
  FiPhone,
  FiPhoneOff,
  FiSettings,
  FiShare,
  FiHeart,
  FiThumbsUp
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function WatchPartyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const partyId = params.id as string
  const dispatch = useAppDispatch()

  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const { watchParties } = useAppSelector((state) => state.social)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  const [party, setParty] = useState<any>(null)
  const [content, setContent] = useState<any>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [message, setMessage] = useState('')
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)

  useEffect(() => {
    // Find the watch party
    const foundParty = watchParties.find(p => p.id === partyId)
    if (foundParty) {
      setParty(foundParty)
      // Find the content
      const foundContent = movies.find(m => m.id === foundParty.contentId) ||
                          series.find(s => s.id === foundParty.contentId)
      setContent(foundContent)
      // Check if user is already joined
      setIsJoined(foundParty.participants.some((p: any) => p.id === user?.id))
    }
  }, [partyId, watchParties, movies, series, user])

  const handleJoinParty = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    dispatch(joinWatchParty({
      partyId,
      userId: user!.id
    }))

    setIsJoined(true)

    dispatch(addNotification({
      id: `party-join-${Date.now()}`,
      type: 'success',
      title: 'Joined Watch Party!',
      message: `You've successfully joined the watch party for "${content?.title}"`,
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const handleSendMessage = () => {
    if (message.trim() && isAuthenticated) {
      dispatch(addWatchPartyMessage({
        partyId,
        message: {
          id: Date.now().toString(),
          userId: user!.id,
          userName: user!.name,
          content: message,
          timestamp: new Date().toISOString()
        }
      }))
      setMessage('')
    }
  }

  const handleStartCall = () => {
    setIsCallActive(true)
    // In a real app, this would initiate WebRTC connection
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    // In a real app, this would close WebRTC connection
  }

  if (!party) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Watch Party Not Found</h1>
              <p className="text-gray-400 mb-6">The watch party you're looking for doesn't exist or has ended.</p>
              <Link
                href="/watch-party"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <FiUsers className="w-4 h-4 mr-2" />
                Browse Watch Parties
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {content && (
            <Image
              src={content.backdrop || content.poster}
              alt={content.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-red-600/80 text-white text-sm font-semibold rounded-full">
                    LIVE WATCH PARTY
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{party.participants.length} watching</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {content?.title}
                </h1>

                <p className="text-lg text-gray-300 mb-4">
                  Watch together with friends
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(party.scheduledTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiClock className="w-4 h-4" />
                    <span>{new Date(party.scheduledTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiUsers className="w-4 h-4" />
                    <span>{party.participants.length}/{party.maxParticipants}</span>
                  </div>
                </div>

                {!isJoined ? (
                  <button
                    onClick={handleJoinParty}
                    className="inline-flex items-center px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <FiPlay className="w-5 h-5 mr-2" />
                    Join Watch Party
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-600/20 border border-green-500/50 text-green-400 font-semibold rounded-lg">
                      ✓ You're in this party!
                    </div>
                    {!isCallActive ? (
                      <button
                        onClick={handleStartCall}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <FiVideo className="w-5 h-5 mr-2" />
                        Start Call
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsMicOn(!isMicOn)}
                          className={`p-3 rounded-full transition-colors ${
                            isMicOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {isMicOn ? <FiMic className="w-5 h-5" /> : <FiMicOff className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => setIsVideoOn(!isVideoOn)}
                          className={`p-3 rounded-full transition-colors ${
                            isVideoOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {isVideoOn ? <FiVideo className="w-5 h-5" /> : <FiVideo className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={handleEndCall}
                          className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                        >
                          <FiPhoneOff className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Party Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-dark-200 rounded-lg p-6 mb-8"
              >
                <h2 className="text-xl font-bold text-white mb-4">About This Watch Party</h2>
                <p className="text-gray-300 mb-4">{party.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Host</h3>
                    <div className="flex items-center gap-3">
                      <Image
                        src={party.host.avatar || 'https://picsum.photos/seed/host/40/40'}
                        alt={party.host.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="text-gray-300">{party.host.name}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-2">Content</h3>
                    <Link
                      href={content?.type === 'movie' ? `/movies/${content.id}` : `/series/${content.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {content?.title}
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Participants */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-dark-200 rounded-lg p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">
                  Participants ({party.participants.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {party.participants.map((participant: any) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Image
                        src={participant.avatar || 'https://picsum.photos/seed/user/40/40'}
                        alt={participant.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-white font-medium">{participant.name}</p>
                        <p className="text-gray-400 text-sm">
                          {participant.id === party.host.id ? 'Host' : 'Member'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Chat */}
              {isJoined && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-dark-200 rounded-lg p-6 sticky top-24"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FiMessageCircle className="w-5 h-5" />
                    Party Chat
                  </h3>

                  <div className="h-64 overflow-y-auto mb-4 space-y-3">
                    {party.messages?.slice(-10).map((msg: any) => (
                      <div key={msg.id} className="flex gap-3">
                        <Image
                          src={msg.userAvatar || 'https://picsum.photos/seed/user/32/32'}
                          alt={msg.userName}
                          width={32}
                          height={32}
                          className="rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            <span className="font-medium">{msg.userName}:</span> {msg.content}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-dark-100 border border-dark-300 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <FiSend className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}