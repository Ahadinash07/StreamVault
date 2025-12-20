import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Friend {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastWatched?: {
    contentId: string
    title: string
    type: 'movie' | 'series'
    timestamp: string
  }
}

export interface Review {
  id: string
  contentId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  likes: number
  timestamp: string
  isLiked?: boolean
  title?: string
  isSpoiler?: boolean
  isVerified?: boolean
  replies?: Reply[]
}

export interface Reply {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: number
  likes: string[]
  parentId?: string
}

export interface UserRating {
  userId: string
  contentId: string
  rating: number
  createdAt: number
  isPublic: boolean
}

export interface Activity {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  type: 'watched' | 'reviewed' | 'favorited' | 'added_to_watchlist' | 'posted'
  contentId?: string
  contentTitle: string
  contentType: 'movie' | 'series'
  timestamp: string
  message?: string
}

export interface Message {
  id: string
  fromId: string
  toId: string
  content: string
  timestamp: string
  isRead: boolean
}

export interface WatchPartyMessage {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
  type?: 'text' | 'emoji' | 'system'
  reactions?: { [emoji: string]: string[] }
}

export interface SocialNotification {
  id: string
  userId: string
  type: 'follow' | 'like' | 'comment' | 'review' | 'watch_party_invite' | 'rating' | 'activity'
  fromUserId: string
  fromUserName: string
  contentId?: string
  message: string
  isRead: boolean
  createdAt: number
  actionUrl?: string
}

export interface WatchParty {
  id: string
  hostId: string
  hostName: string
  contentId: string
  contentTitle: string
  contentType: 'movie' | 'series'
  episodeId?: string
  seasonId?: string
  participants: string[]
  isActive: boolean
  currentTime: number
  isPlaying: boolean
  createdAt: string
  scheduledTime?: string
  maxParticipants?: number
  messages: WatchPartyMessage[]
  isPrivate?: boolean
  inviteCode?: string
  status?: 'scheduled' | 'active' | 'ended' | 'cancelled'
  settings?: {
    allowGuests: boolean
    syncPlayback: boolean
    allowChat: boolean
    moderationEnabled: boolean
  }
}

interface SocialState {
  friends: Friend[]
  reviews: Record<string, Review[]>
  ratings: Record<string, UserRating[]>
  userRatings: Record<string, UserRating>
  activities: Activity[]
  watchParties: WatchParty[]
  messages: Record<string, Message[]>
  notifications: SocialNotification[]
  followers: Record<string, string[]>
  following: Record<string, string[]>
  blockedUsers: Record<string, string[]>
  lastUpdated: Record<string, number>
}

const initialState: SocialState = {
  friends: [],
  reviews: {},
  ratings: {},
  userRatings: {},
  activities: [],
  watchParties: [],
  messages: {},
  notifications: [],
  followers: {},
  following: {},
  blockedUsers: {},
  lastUpdated: {},
}

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    // Friend Management
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      if (!state.friends.find((f) => f.id === action.payload.id)) {
        state.friends.push(action.payload)
      }
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter((f) => f.id !== action.payload)
    },

    // Review Management
    addReview: (state, action: PayloadAction<Review>) => {
      if (!state.reviews[action.payload.contentId]) {
        state.reviews[action.payload.contentId] = []
      }
      state.reviews[action.payload.contentId].push(action.payload)
      state.lastUpdated[action.payload.contentId] = Date.now()
    },
    updateReview: (state, action: PayloadAction<{ reviewId: string; contentId: string; updates: Partial<Review> }>) => {
      const { reviewId, contentId, updates } = action.payload
      const reviewIndex = state.reviews[contentId]?.findIndex(r => r.id === reviewId)
      if (reviewIndex !== undefined && reviewIndex >= 0) {
        Object.assign(state.reviews[contentId][reviewIndex], updates)
        state.lastUpdated[contentId] = Date.now()
      }
    },
    deleteReview: (state, action: PayloadAction<{ reviewId: string; contentId: string }>) => {
      const { reviewId, contentId } = action.payload
      if (state.reviews[contentId]) {
        state.reviews[contentId] = state.reviews[contentId].filter(r => r.id !== reviewId)
        state.lastUpdated[contentId] = Date.now()
      }
    },

    // Rating Management
    addRating: (state, action: PayloadAction<UserRating>) => {
      const rating = action.payload
      const ratingKey = `${rating.userId}_${rating.contentId}`

      if (!state.ratings[rating.contentId]) {
        state.ratings[rating.contentId] = []
      }
      state.ratings[rating.contentId].push(rating)
      state.userRatings[ratingKey] = rating
      state.lastUpdated[rating.contentId] = Date.now()
    },
    updateRating: (state, action: PayloadAction<{ userId: string; contentId: string; rating: number }>) => {
      const { userId, contentId, rating: newRating } = action.payload
      const ratingKey = `${userId}_${contentId}`
      const existingRating = state.userRatings[ratingKey]

      if (existingRating) {
        existingRating.rating = newRating
        const ratingIndex = state.ratings[contentId]?.findIndex(r => r.userId === userId)
        if (ratingIndex !== undefined && ratingIndex >= 0) {
          state.ratings[contentId][ratingIndex].rating = newRating
        }
        state.lastUpdated[contentId] = Date.now()
      }
    },
    removeRating: (state, action: PayloadAction<{ userId: string; contentId: string }>) => {
      const { userId, contentId } = action.payload
      const ratingKey = `${userId}_${contentId}`

      if (state.ratings[contentId]) {
        state.ratings[contentId] = state.ratings[contentId].filter(r => r.userId !== userId)
      }
      delete state.userRatings[ratingKey]
      state.lastUpdated[contentId] = Date.now()
    },

    // Review Interactions
    likeReview: (state, action: PayloadAction<{ contentId: string; reviewId: string }>) => {
      const reviews = state.reviews[action.payload.contentId]
      if (reviews) {
        const review = reviews.find((r) => r.id === action.payload.reviewId)
        if (review) {
          review.likes += review.isLiked ? -1 : 1
          review.isLiked = !review.isLiked
        }
      }
    },
    addReply: (state, action: PayloadAction<{ reviewId: string; contentId: string; reply: Reply }>) => {
      const { reviewId, contentId, reply } = action.payload
      const review = state.reviews[contentId]?.find(r => r.id === reviewId)
      if (review) {
        if (!review.replies) review.replies = []
        review.replies.push(reply)
        state.lastUpdated[contentId] = Date.now()
      }
    },

    // Activity Management
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.unshift(action.payload)
      if (state.activities.length > 100) {
        state.activities = state.activities.slice(0, 100)
      }
    },

    // Watch Party Management
    createWatchParty: (state, action: PayloadAction<WatchParty>) => {
      state.watchParties.push(action.payload)
    },
    updateWatchParty: (state, action: PayloadAction<Partial<WatchParty> & { id: string }>) => {
      const party = state.watchParties.find((p) => p.id === action.payload.id)
      if (party) {
        Object.assign(party, action.payload)
      }
    },
    joinWatchParty: (state, action: PayloadAction<{ partyId: string; userId: string }>) => {
      const party = state.watchParties.find((p) => p.id === action.payload.partyId)
      if (party && !party.participants.includes(action.payload.userId)) {
        party.participants.push(action.payload.userId)
      }
    },
    leaveWatchParty: (state, action: PayloadAction<{ partyId: string; userId: string }>) => {
      const party = state.watchParties.find((p) => p.id === action.payload.partyId)
      if (party) {
        party.participants = party.participants.filter((id) => id !== action.payload.userId)
      }
    },
    addWatchPartyMessage: (state, action: PayloadAction<{ partyId: string; message: WatchPartyMessage }>) => {
      const party = state.watchParties.find((p) => p.id === action.payload.partyId)
      if (party) {
        if (!party.messages) {
          party.messages = []
        }
        party.messages.push(action.payload.message)
      }
    },

    // Social Following
    followUser: (state, action: PayloadAction<{ followerId: string; followingId: string }>) => {
      const { followerId, followingId } = action.payload
      if (!state.following[followerId]) state.following[followerId] = []
      if (!state.followers[followingId]) state.followers[followingId] = []

      if (!state.following[followerId].includes(followingId)) {
        state.following[followerId].push(followingId)
      }
      if (!state.followers[followingId].includes(followerId)) {
        state.followers[followingId].push(followerId)
      }
    },
    unfollowUser: (state, action: PayloadAction<{ followerId: string; followingId: string }>) => {
      const { followerId, followingId } = action.payload
      if (state.following[followerId]) {
        state.following[followerId] = state.following[followerId].filter(id => id !== followingId)
      }
      if (state.followers[followingId]) {
        state.followers[followingId] = state.followers[followingId].filter(id => id !== followerId)
      }
    },
    blockUser: (state, action: PayloadAction<{ userId: string; blockedUserId: string }>) => {
      const { userId, blockedUserId } = action.payload
      if (!state.blockedUsers[userId]) state.blockedUsers[userId] = []
      if (!state.blockedUsers[userId].includes(blockedUserId)) {
        state.blockedUsers[userId].push(blockedUserId)
      }
      // Remove from following/followers if blocked
      state.following[userId] = state.following[userId]?.filter(id => id !== blockedUserId) || []
      state.followers[userId] = state.followers[userId]?.filter(id => id !== userId) || []
      state.following[blockedUserId] = state.following[blockedUserId]?.filter(id => id !== userId) || []
      state.followers[blockedUserId] = state.followers[blockedUserId]?.filter(id => id !== userId) || []
    },

    // Messaging
    sendMessage: (state, action: PayloadAction<Message>) => {
      const conversationId = [action.payload.fromId, action.payload.toId].sort().join('-')
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = []
      }
      state.messages[conversationId].push(action.payload)
    },
    markMessageAsRead: (state, action: PayloadAction<{ messageId: string; conversationId: string }>) => {
      const messages = state.messages[action.payload.conversationId]
      if (messages) {
        const message = messages.find((m) => m.id === action.payload.messageId)
        if (message) {
          message.isRead = true
        }
      }
    },

    // Notifications
    addNotification: (state, action: PayloadAction<SocialNotification>) => {
      state.notifications.push(action.payload)
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(-50)
      }
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.isRead = true
      }
    },
    clearNotifications: (state, action: PayloadAction<{ userId: string }>) => {
      state.notifications = state.notifications.filter(n => n.userId !== action.payload.userId)
    },

    // Bulk Operations
    loadReviews: (state, action: PayloadAction<{ contentId: string; reviews: Review[] }>) => {
      state.reviews[action.payload.contentId] = action.payload.reviews
      state.lastUpdated[action.payload.contentId] = Date.now()
    },
    loadRatings: (state, action: PayloadAction<{ contentId: string; ratings: UserRating[] }>) => {
      state.ratings[action.payload.contentId] = action.payload.ratings
      state.lastUpdated[action.payload.contentId] = Date.now()
    },

    // Cleanup
    clearOldData: (state) => {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      state.notifications = state.notifications.filter(n => n.createdAt > oneWeekAgo)
      state.activities = state.activities.filter(a => new Date(a.timestamp).getTime() > oneWeekAgo)
    },
  },
})

export const {
  setFriends,
  addFriend,
  removeFriend,
  addReview,
  updateReview,
  deleteReview,
  addRating,
  updateRating,
  removeRating,
  likeReview,
  addReply,
  addActivity,
  createWatchParty,
  updateWatchParty,
  joinWatchParty,
  leaveWatchParty,
  addWatchPartyMessage,
  followUser,
  unfollowUser,
  blockUser,
  sendMessage,
  markMessageAsRead,
  addNotification,
  markNotificationRead,
  clearNotifications,
  loadReviews,
  loadRatings,
  clearOldData,
} = socialSlice.actions

export default socialSlice.reducer

