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
}

interface SocialState {
  friends: Friend[]
  reviews: Record<string, Review[]>
  activities: Activity[]
  watchParties: WatchParty[]
  messages: Record<string, Message[]> // conversationId -> messages
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
}

const initialState: SocialState = {
  friends: [],
  reviews: {},
  activities: [],
  watchParties: [],
  messages: {},
}

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
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
    addReview: (state, action: PayloadAction<Review>) => {
      if (!state.reviews[action.payload.contentId]) {
        state.reviews[action.payload.contentId] = []
      }
      state.reviews[action.payload.contentId].push(action.payload)
    },
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
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.unshift(action.payload)
      if (state.activities.length > 100) {
        state.activities = state.activities.slice(0, 100)
      }
    },
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
  },
})

export const {
  setFriends,
  addFriend,
  removeFriend,
  addReview,
  likeReview,
  addActivity,
  createWatchParty,
  updateWatchParty,
  joinWatchParty,
  leaveWatchParty,
  addWatchPartyMessage,
  sendMessage,
  markMessageAsRead,
} = socialSlice.actions

export default socialSlice.reducer

