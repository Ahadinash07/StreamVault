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

