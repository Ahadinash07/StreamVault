'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { FiUsers, FiMessageCircle, FiHeart, FiShare, FiPlay, FiPlus, FiCheck, FiX, FiSend, FiThumbsUp, FiSmile, FiCalendar, FiClock } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { addActivity, createWatchParty, joinWatchParty, addFriend, sendMessage } from '@/app/features/social/socialSlice'
import { addNotification } from '@/app/features/notifications/notificationsSlice'

interface SocialFeaturesProps {
  contentId?: string
  contentType?: 'movie' | 'series'
}

export default function SocialFeatures({ contentId, contentType }: SocialFeaturesProps) {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const { movies } = useAppSelector((state) => state.movies)
  const { series } = useAppSelector((state) => state.series)
  const { friends, activities, watchParties } = useAppSelector((state) => state.social)

  const [activeTab, setActiveTab] = useState<'feed' | 'watch-parties' | 'friends' | 'messages'>('feed')
  const [showCreateWatchParty, setShowCreateWatchParty] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [selectedContent, setSelectedContent] = useState('')
  const [watchPartyForm, setWatchPartyForm] = useState({
    contentTitle: '',
    contentType: 'movie' as 'movie' | 'series',
    scheduledTime: '',
    maxParticipants: 10
  })
  const [messageInput, setMessageInput] = useState('')
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && !(event.target as Element).closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmojiPicker])

  const handleCreatePost = () => {
    if (newPost.trim()) {
      dispatch(addActivity({
        id: Date.now().toString(),
        userId: user?.id || 'guest',
        userName: user?.name || 'Anonymous',
        type: 'posted',
        contentTitle: selectedContent || 'General Discussion',
        contentType: contentType || 'movie',
        timestamp: new Date().toISOString(),
        message: newPost
      }))
      setNewPost('')
      setSelectedContent('')
    }
  }

  const handleCreateWatchParty = () => {
    if (watchPartyForm.contentTitle) {
      dispatch(createWatchParty({
        id: Date.now().toString(),
        contentId: 'content-' + Date.now(), // Temporary content ID
        contentTitle: watchPartyForm.contentTitle,
        contentType: watchPartyForm.contentType,
        hostId: user?.id || 'guest',
        hostName: user?.name || 'Anonymous',
        participants: [user?.id || 'guest'],
        isActive: false,
        currentTime: 0,
        isPlaying: false,
        createdAt: new Date().toISOString(),
        scheduledTime: watchPartyForm.scheduledTime || new Date().toISOString(),
        maxParticipants: watchPartyForm.maxParticipants,
        messages: []
      }))

      setShowCreateWatchParty(false)
      setWatchPartyForm({
        contentTitle: '',
        contentType: 'movie',
        scheduledTime: '',
        maxParticipants: 10
      })
    }
  }

  const handleSendMessage = (friendId: string) => {
    if (messageInput.trim()) {
      dispatch(sendMessage({
        id: Date.now().toString(),
        fromId: user?.id || 'guest',
        toId: friendId,
        content: messageInput,
        timestamp: new Date().toISOString(),
        isRead: false
      }))
      setMessageInput('')
    }
  }

  const handleAddFriend = (friendId: string) => {
    // TODO: Implement proper friend request system
    // dispatch(addFriend(friendId))
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'friend_request',
      title: 'Friend Request Sent',
      message: `Your friend request has been sent successfully.`,
      timestamp: new Date().toISOString(),
      isRead: false
    }))
  }

  const tabs = [
    { id: 'feed', label: 'Activity Feed', icon: FiMessageCircle },
    { id: 'watch-parties', label: 'Watch Parties', icon: FiUsers },
    { id: 'friends', label: 'Friends', icon: FiHeart },
    { id: 'messages', label: 'Messages', icon: FiSend }
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
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-200 rounded-lg p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={user?.avatar || 'https://picsum.photos/seed/default/40/40'}
                    alt={user?.name || 'User'}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your thoughts about movies and series..."
                      className="w-full bg-dark-100 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3 relative">
                      <div className="flex gap-2">
                        <select
                          value={selectedContent}
                          onChange={(e) => setSelectedContent(e.target.value)}
                          className="bg-dark-100 border border-dark-200 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">General Discussion</option>
                          {movies.slice(0, 5).map(movie => (
                            <option key={movie.id} value={movie.title}>🎬 {movie.title}</option>
                          ))}
                          {series.slice(0, 5).map(series => (
                            <option key={series.id} value={series.title}>📺 {series.title}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 bg-dark-100 hover:bg-dark-300 rounded-lg transition-colors"
                        >
                          <FiSmile className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Emoji Picker */}
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className="absolute bottom-full mb-2 left-0 bg-dark-100 border border-dark-200 rounded-lg p-3 shadow-xl z-50 emoji-picker-container"
                          >
                            <div className="grid grid-cols-8 gap-2 max-w-xs">
                              {[
                                '😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎',
                                '❤️', '🔥', '🎬', '📺', '🍿', '🎭', '⭐', '💯',
                                '🤩', '😎', '🤗', '😴', '🤤', '🤯', '🥳', '😱',
                                '👏', '🙌', '🤝', '✨', '💫', '🌟', '🎉', '🎊'
                              ].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    setNewPost(prev => prev + emoji)
                                    setShowEmojiPicker(false)
                                  }}
                                  className="w-8 h-8 hover:bg-dark-300 rounded transition-colors text-lg flex items-center justify-center"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Activity Feed */}
            <div className="space-y-4">
              {activities.length > 0 ? activities.slice(0, 10).map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-200 rounded-lg p-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={`https://picsum.photos/seed/${activity.userId}/40/40`}
                      alt={activity.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{activity.userName}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      {activity.type === 'posted' && activity.message ? (
                        <div className="mb-3">
                          <p className="text-gray-300 mb-2">{activity.message}</p>
                          {activity.contentTitle !== 'General Discussion' && (
                            <div className="bg-dark-100 rounded-lg p-3">
                              <p className="text-sm text-gray-400">
                                {activity.contentType === 'movie' ? '🎬' : '📺'} {activity.contentTitle}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-300 mb-3">
                            {activity.type === 'watched' && `Watched ${activity.contentTitle}`}
                            {activity.type === 'reviewed' && `Reviewed ${activity.contentTitle}`}
                            {activity.type === 'favorited' && `Added ${activity.contentTitle} to favorites`}
                            {activity.type === 'added_to_watchlist' && `Added ${activity.contentTitle} to watchlist`}
                          </p>

                          <div className="bg-dark-100 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-400">
                              {activity.contentType === 'movie' ? '🎬' : '📺'} {activity.contentTitle}
                            </p>
                          </div>
                        </>
                      )}

                      {/* Interaction Buttons */}
                      <div className="flex items-center gap-4 pt-2 border-t border-dark-100">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                          <FiThumbsUp className="w-4 h-4" />
                          <span className="text-sm">Like</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-green-500 transition-colors">
                          <FiMessageCircle className="w-4 h-4" />
                          <span className="text-sm">Comment</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors">
                          <FiShare className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <FiMessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity</p>
                  <p className="text-gray-500 text-sm">Start watching to see activity here!</p>
                </div>
              )}
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

            {/* Create Watch Party Modal */}
            <AnimatePresence>
              {showCreateWatchParty && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowCreateWatchParty(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-dark-100 rounded-lg p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Create Watch Party</h3>
                      <button
                        onClick={() => setShowCreateWatchParty(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Content Title
                        </label>
                        <select
                          value={watchPartyForm.contentTitle}
                          onChange={(e) => setWatchPartyForm(prev => ({ ...prev, contentTitle: e.target.value }))}
                          className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select content...</option>
                          {movies.slice(0, 10).map(movie => (
                            <option key={movie.id} value={movie.title}>{movie.title}</option>
                          ))}
                          {series.slice(0, 10).map(series => (
                            <option key={series.id} value={series.title}>{series.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Schedule Time (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={watchPartyForm.scheduledTime}
                          onChange={(e) => setWatchPartyForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                          className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Participants
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="50"
                          value={watchPartyForm.maxParticipants}
                          onChange={(e) => setWatchPartyForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                          className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setShowCreateWatchParty(false)}
                          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateWatchParty}
                          disabled={!watchPartyForm.contentTitle}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          Create Party
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Watch Parties List */}
            <div className="space-y-4">
              {watchParties.length > 0 ? watchParties.map((party) => (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-dark-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{party.contentTitle}</h3>
                      <p className="text-gray-400 text-sm">Hosted by {party.hostName}</p>
                    </div>
                    {party.isActive && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-sm text-gray-300">
                      <FiPlay className="w-4 h-4 inline mr-1" />
                      {party.contentTitle}
                    </div>
                    <div className="text-sm text-gray-300">
                      <FiUsers className="w-4 h-4 inline mr-1" />
                      {party.participants.length}/{party.maxParticipants || 10}
                    </div>
                    {party.scheduledTime && (
                      <div className="text-sm text-gray-300">
                        <FiClock className="w-4 h-4 inline mr-1" />
                        {new Date(party.scheduledTime).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Created {new Date(party.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => dispatch(joinWatchParty({ partyId: party.id, userId: user?.id || 'guest' }))}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      {party.isActive ? 'Join Live' : 'Join Party'}
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <FiUsers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No active watch parties</p>
                  <p className="text-gray-500 text-sm">Create one to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-6">
            {/* Add Friend Search */}
            {isAuthenticated && (
              <div className="bg-dark-200 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Find Friends</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search for users..."
                    className="flex-1 bg-dark-100 border border-dark-300 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Search
                  </button>
                </div>
              </div>
            )}

            {/* Friends List */}
            <div className="space-y-4">
              {friends.length > 0 ? friends.map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-200"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{friend.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {friend.isOnline ? 'Online' : 'Offline'}
                        </p>
                        {friend.lastWatched && (
                          <p className="text-gray-500 text-xs">
                            Last watched: {friend.lastWatched.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedFriend(friend.id)
                          setActiveTab('messages')
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        Message
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg text-sm transition-colors">
                        Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <FiUsers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No friends yet</p>
                  <p className="text-gray-500 text-sm">Connect with other movie lovers!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Message Interface */}
            <div className="bg-dark-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-dark-300">
                <h3 className="text-white font-semibold">
                  {selectedFriend ? `Chat with ${friends.find(f => f.id === selectedFriend)?.name}` : 'Select a friend to message'}
                </h3>
              </div>

              {selectedFriend ? (
                <div className="h-96 flex flex-col">
                  {/* Messages Area */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {/* Mock messages - in real app, these would come from state */}
                    <div className="flex gap-3">
                      <img
                        src={`https://picsum.photos/seed/${selectedFriend}/32/32`}
                        alt="Friend"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="bg-dark-100 rounded-lg p-3 max-w-xs">
                        <p className="text-gray-300 text-sm">Hey! Did you watch the latest episode?</p>
                        <span className="text-gray-500 text-xs">2 hours ago</span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <div className="bg-blue-600 rounded-lg p-3 max-w-xs">
                        <p className="text-white text-sm">Not yet, planning to watch tonight!</p>
                        <span className="text-blue-200 text-xs">1 hour ago</span>
                      </div>
                      <img
                        src={user?.avatar || 'https://picsum.photos/seed/default/32/32'}
                        alt="You"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-dark-300">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-dark-100 border border-dark-300 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedFriend)}
                      />
                      <button
                        onClick={() => handleSendMessage(selectedFriend)}
                        disabled={!messageInput.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <FiSend className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <FiMessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a friend from the Friends tab to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}