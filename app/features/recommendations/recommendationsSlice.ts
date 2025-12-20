import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Movie, Series } from '@/types/content'

export interface Recommendation {
  contentId: string
  contentType: 'movie' | 'series'
  score: number
  reason: string
}

interface RecommendationsState {
  recommendations: Record<string, Recommendation[]>
  moodPlaylists: MoodPlaylist[]
  trending: {
    movies: string[]
    series: string[]
  }
}

export interface MoodPlaylist {
  id: string
  name: string
  description: string
  mood: string
  contentIds: string[]
  contentType: 'movie' | 'series' | 'mixed'
  coverImage: string
}

const initialState: RecommendationsState = {
  recommendations: {},
  moodPlaylists: [
    {
      id: 'mood-1',
      name: 'Feel Good Movies',
      description: 'Movies to lift your spirits',
      mood: 'happy',
      contentIds: ['8', '15', '25', '34'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/happy/800/450',
    },
    {
      id: 'mood-2',
      name: 'Thriller Night',
      description: 'Edge-of-your-seat suspense',
      mood: 'thriller',
      contentIds: ['1', '4', '16', '27'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/thriller/800/450',
    },
    {
      id: 'mood-3',
      name: 'Sci-Fi Adventures',
      description: 'Journey through space and time',
      mood: 'sci-fi',
      contentIds: ['2', '3', '4', '17'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/scifi/800/450',
    },
    {
      id: 'mood-4',
      name: 'Romantic Evenings',
      description: 'Perfect for date night',
      mood: 'romance',
      contentIds: ['8', '12', '25', '45'],
      contentType: 'movie',
      coverImage: 'https://picsum.photos/seed/romance/800/450',
    },
  ],
  trending: {
    movies: [],
    series: [],
  },
}

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations: (
      state,
      action: PayloadAction<{ userId: string; recommendations: Recommendation[] }>
    ) => {
      state.recommendations[action.payload.userId] = action.payload.recommendations
    },
    generateRecommendations: (
      state,
      action: PayloadAction<{
        userId: string
        watchHistory: string[]
        favorites: string[]
        allMovies: Movie[]
        allSeries: Series[]
      }>
    ) => {
      const { userId, watchHistory, favorites, allMovies, allSeries } = action.payload
      const recommendations: Recommendation[] = []

      // Get genres from watched content
      const watchedGenres = new Set<string>()
      watchHistory.forEach((id) => {
        const movie = allMovies.find((m) => m.id === id)
        const series = allSeries.find((s) => s.id === id)
        const content = movie || series
        if (content) {
          content.genres.forEach((g) => watchedGenres.add(g))
        }
      })

      // Recommend similar content
      const allContent = [...allMovies, ...allSeries]
      allContent
        .filter((c) => !watchHistory.includes(c.id) && !favorites.includes(c.id))
        .forEach((content) => {
          const commonGenres = content.genres.filter((g) => watchedGenres.has(g)).length
          if (commonGenres > 0) {
            const score = commonGenres * 0.3 + content.rating * 0.7
            recommendations.push({
              contentId: content.id,
              contentType: content.type,
              score,
              reason: `Similar to what you've watched`,
            })
          }
        })

      // Sort by score and take top 20
      recommendations.sort((a, b) => b.score - a.score)
      state.recommendations[userId] = recommendations.slice(0, 20)
    },
    setTrending: (
      state,
      action: PayloadAction<{ movies: string[]; series: string[] }>
    ) => {
      state.trending = action.payload
    },
  },
})

export const { setRecommendations, generateRecommendations, setTrending } =
  recommendationsSlice.actions

export default recommendationsSlice.reducer

