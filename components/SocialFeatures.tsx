'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { FiUsers, FiMessageCircle, FiHeart, FiShare, FiPlay, FiPlus, FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface SocialFeaturesProps {
  contentId?: string
  contentType?: 'movie' | 'series'
}

export default function SocialFeatures({ contentId, contentType }: SocialFeaturesProps) {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)

  const [activeTab, setActiveTab] = useState<'feed' | 'watch-parties' | 'polls'>('feed')
  const [showCreateWatchParty, setShowCreateWatchParty] = useState(false)

  // Mock social data - in a real app, this would come from an API
  const mockSocialPosts = [
    {
      id: '1',
      user: 'MovieBuff2024',
      avatar: 'https://picsum.photos/seed/user1/40/40',
      content: 'Just finished watching Inception! The ending blew my mind 🤯 What did you think?',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      type: 'review',
      relatedContent: { type: 'movie', id: '2', title: 'Inception' }
    },
    {
      id: '2',
      user: 'SeriesLover',
      avatar: 'https://picsum.photos/seed/user2/40/40',
      content: 'Who else is excited for the Stranger Things finale? The theories are wild! 🎭',
      timestamp: '4 hours ago',
      likes: 156,
      comments: 42,
      shares: 28,
      type: 'discussion',
      relatedContent: { type: 'series', id: '1', title: 'Stranger Things' }
    },
    {
      id: '3',
      user: 'Cinephile99',
      avatar: 'https://picsum.photos/seed/user3/40/40',
      content: 'Creating a watch party for The Dark Knight tonight at 8 PM! Join if you want to discuss the movie live 🎥',
      timestamp: '6 hours ago',
      likes: 67,
      comments: 15,
      shares: 12,
      type: 'watch-party',
      relatedContent: { type: 'movie', id: '1', title: 'The Dark Knight' }
    }
  ]

  const mockWatchParties = [
    {
      id: 'wp1',
      title: 'Dark Knight Marathon',
      host: 'BatmanFan',
      content: 'The Dark Knight',
      scheduledTime: '2024-12-25T20:00:00',
      participants: 12,
      maxParticipants: 20,
      isLive: false
    },
    {
      id: 'wp2',
      title: 'Sci-Fi Sunday',
      host: 'SciFiLover',
      content: 'Interstellar',
      scheduledTime: '2024-12-24T18:00:00',
      participants: 8,
      maxParticipants: 15,
      isLive: true
    }
  ]

  const mockPolls = [
    {
      id: 'poll1',
      question: 'Which Christopher Nolan movie is your favorite?',
      options: [
        { text: 'Inception', votes: 45 },
        { text: 'The Dark Knight', votes: 67 },
        { text: 'Interstellar', votes: 38 },
        { text: 'Dunkirk', votes: 23 }
      ],
      totalVotes: 173,
      relatedContent: { type: 'movie', title: 'Christopher Nolan Collection' }
    },
    {
      id: 'poll2',
      question: 'Best superhero movie of 2024?',
      options: [
        { text: 'Avengers: Endgame', votes: 89 },
        { text: 'The Dark Knight', votes: 76 },
        { text: 'Logan', votes: 45 },
        { text: 'Black Panther', votes: 52 }
      ],
      totalVotes: 262,
      relatedContent: { type: 'movie', title: 'Superhero Movies' }
    }
  ]

  const tabs = [
    { id: 'feed', label: 'Social Feed', icon: FiMessageCircle },
    { id: 'watch-parties', label: 'Watch Parties', icon: FiUsers },
    { id: 'polls', label: 'Polls', icon: FiHeart }
  ]

  return (
    <div className="bg-dark-100 border border-dark-200 rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-dark-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                : 'text-gray-400 hover:text-white hover:bg-dark-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Create Post */}
            {isAuthenticated && (
              <div className="bg-dark-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <img
                    src={user?.avatar || 'https://picsum.photos/seed/default/40/40'}
                    alt={user?.name || 'User'}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts about movies and series..."
                      className="w-full bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Posts */}
            <div className="space-y-4">
              {mockSocialPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-200 rounded-lg p-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={post.avatar}
                      alt={post.user}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{post.user}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{post.timestamp}</span>
                      </div>

                      <p className="text-gray-300 mb-3">{post.content}</p>

                      {post.relatedContent && (
                        <div className="bg-dark-100 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-400">
                            Related to: <span className="text-blue-400">{post.relatedContent.title}</span>
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                          <FiHeart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <FiMessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                          <FiShare className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'watch-parties' && (
          <div className="space-y-6">
            {/* Create Watch Party Button */}
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateWatchParty(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg py-3 px-6 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Create Watch Party
              </button>
            )}

            {/* Watch Parties List */}
            <div className="space-y-4">
              {mockWatchParties.map((party) => (
                <div key={party.id} className="bg-dark-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{party.title}</h3>
                      <p className="text-gray-400 text-sm">Hosted by {party.host}</p>
                    </div>
                    {party.isLive && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-sm text-gray-300">
                      <FiPlay className="w-4 h-4 inline mr-1" />
                      {party.content}
                    </div>
                    <div className="text-sm text-gray-300">
                      <FiUsers className="w-4 h-4 inline mr-1" />
                      {party.participants}/{party.maxParticipants}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {new Date(party.scheduledTime).toLocaleString()}
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      {party.isLive ? 'Join Live' : 'Join Party'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'polls' && (
          <div className="space-y-6">
            {mockPolls.map((poll) => (
              <div key={poll.id} className="bg-dark-200 rounded-lg p-4">
                <h3 className="text-white font-semibold text-lg mb-2">{poll.question}</h3>

                {poll.relatedContent && (
                  <p className="text-gray-400 text-sm mb-4">
                    Related to: {poll.relatedContent.title}
                  </p>
                )}

                <div className="space-y-3 mb-4">
                  {poll.options.map((option, index) => {
                    const percentage = (option.votes / poll.totalVotes) * 100
                    return (
                      <div key={index} className="relative">
                        <button className="w-full text-left p-3 bg-dark-100 hover:bg-dark-300 rounded-lg transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300">{option.text}</span>
                            <span className="text-gray-400 text-sm">{option.votes} votes</span>
                          </div>
                          <div className="w-full bg-dark-300 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="text-center text-gray-400 text-sm">
                  Total votes: {poll.totalVotes}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}