export interface Movie {
  id: string
  title: string
  description: string
  releaseDate: string
  rating: number
  duration: number
  genres: string[]
  director: string
  cast: string[]
  poster: string
  backdrop: string
  trailer?: string
  videoUrl?: string
  language: string
  isOriginal: boolean
  maturityRating: string
  type: 'movie'
}

export interface Series {
  id: string
  title: string
  description: string
  releaseDate: string
  rating: number
  genres: string[]
  cast: string[]
  poster: string
  backdrop: string
  trailer?: string
  language: string
  isOriginal: boolean
  maturityRating: string
  type: 'series'
  seasons: Season[]
}

export interface Season {
  id: string
  seasonNumber: number
  title: string
  description: string
  episodes: Episode[]
  releaseDate: string
  poster: string
}

export interface Episode {
  id: string
  episodeNumber: number
  title: string
  description: string
  duration: number
  releaseDate: string
  thumbnail: string
  videoUrl?: string
}

export interface Reel {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: number // in seconds
  views: number
  likes: number
  shares: number
  creator: string
  tags: string[]
  type: 'trailer' | 'behind-scenes' | 'clip' | 'teaser' | 'interview' | 'music-video' | 'short-film'
  relatedContent?: {
    type: 'movie' | 'series'
    id: string
    title: string
  }
  uploadDate: string
  isTrending: boolean
  isOriginal: boolean
}

export interface Theme {
  mode: 'light' | 'dark' | 'system'
}

export interface MoodPlaylist {
  id: string
  name: string
  description: string
  emoji: string
  color: string
  content: (Movie | Series)[]
  mood: 'happy' | 'sad' | 'excited' | 'relaxed' | 'adventurous' | 'romantic' | 'scary' | 'inspirational'
}

export interface SocialPost {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  type: 'review' | 'recommendation' | 'watch-party' | 'achievement' | 'poll'
  timestamp: string
  likes: number
  comments: number
  shares: number
  media?: {
    type: 'image' | 'video'
    url: string
    thumbnail?: string
  }
  relatedContent?: {
    type: 'movie' | 'series' | 'reel'
    id: string
    title: string
  }
}

export interface Poll {
  id: string
  question: string
  options: {
    id: string
    text: string
    votes: number
  }[]
  totalVotes: number
  relatedContent?: {
    type: 'movie' | 'series'
    id: string
    title: string
  }
  createdAt: string
  endsAt: string
  isActive: boolean
}

export interface WatchParty {
  id: string
  hostId: string
  hostName: string
  title: string
  description: string
  content: Movie | Series
  scheduledTime: string
  participants: {
    id: string
    name: string
    avatar: string
    joinedAt: string
  }[]
  maxParticipants: number
  isLive: boolean
  chatMessages: {
    id: string
    userId: string
    username: string
    message: string
    timestamp: string
    type: 'text' | 'emoji' | 'reaction'
  }[]
}

