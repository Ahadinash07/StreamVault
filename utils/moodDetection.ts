import { Movie, Series } from '@/types/content'

export interface MoodPlaylist {
  id: string
  name: string
  description: string
  emoji: string
  color: string
  content: (Movie | Series)[]
  mood: 'happy' | 'sad' | 'excited' | 'relaxed' | 'adventurous' | 'romantic' | 'scary' | 'inspirational'
}

// Mood-based content mapping
const moodKeywords = {
  happy: ['comedy', 'funny', 'light', 'feel-good', 'musical', 'animation'],
  sad: ['drama', 'emotional', 'tragic', 'melancholy', 'coming-of-age'],
  excited: ['action', 'adventure', 'thriller', 'superhero', 'sci-fi'],
  relaxed: ['documentary', 'nature', 'slice-of-life', 'mystery', 'indie'],
  adventurous: ['adventure', 'exploration', 'travel', 'survival', 'fantasy'],
  romantic: ['romance', 'love', 'relationship', 'drama', 'comedy'],
  scary: ['horror', 'thriller', 'supernatural', 'mystery', 'crime'],
  inspirational: ['biography', 'sports', 'motivational', 'true-story', 'drama']
}

const moodPlaylists: MoodPlaylist[] = [
  {
    id: 'mood-happy',
    name: 'Feel Good Vibes',
    description: 'Movies and shows that will brighten your day',
    emoji: '😊',
    color: 'from-yellow-400 to-orange-500',
    content: [],
    mood: 'happy'
  },
  {
    id: 'mood-sad',
    name: 'Emotional Journeys',
    description: 'Thought-provoking stories that touch the heart',
    emoji: '😢',
    color: 'from-blue-400 to-indigo-500',
    content: [],
    mood: 'sad'
  },
  {
    id: 'mood-excited',
    name: 'Adrenaline Rush',
    description: 'High-energy content that gets your blood pumping',
    emoji: '⚡',
    color: 'from-red-400 to-pink-500',
    content: [],
    mood: 'excited'
  },
  {
    id: 'mood-relaxed',
    name: 'Chill & Unwind',
    description: 'Peaceful content for relaxation and mindfulness',
    emoji: '🧘',
    color: 'from-green-400 to-teal-500',
    content: [],
    mood: 'relaxed'
  },
  {
    id: 'mood-adventurous',
    name: 'Epic Adventures',
    description: 'Journey to new worlds and exciting discoveries',
    emoji: '🗺️',
    color: 'from-purple-400 to-violet-500',
    content: [],
    mood: 'adventurous'
  },
  {
    id: 'mood-romantic',
    name: 'Love Stories',
    description: 'Heartwarming tales of love and relationships',
    emoji: '💕',
    color: 'from-pink-400 to-rose-500',
    content: [],
    mood: 'romantic'
  },
  {
    id: 'mood-scary',
    name: 'Thrill Seekers',
    description: 'Spine-tingling horror and suspense',
    emoji: '👻',
    color: 'from-gray-600 to-gray-800',
    content: [],
    mood: 'scary'
  },
  {
    id: 'mood-inspirational',
    name: 'Motivational Tales',
    description: 'Stories that inspire and uplift the spirit',
    emoji: '✨',
    color: 'from-amber-400 to-yellow-500',
    content: [],
    mood: 'inspirational'
  }
]

// AI-like mood detection based on content analysis
export function detectMoodFromContent(content: Movie | Series): string[] {
  const genres = content.genres.map(g => g.toLowerCase())
  const description = content.description.toLowerCase()
  const title = content.title.toLowerCase()

  const detectedMoods: string[] = []

  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    const hasMatchingGenre = genres.some(genre => keywords.includes(genre))
    const hasMatchingDescription = keywords.some(keyword =>
      description.includes(keyword) || title.includes(keyword)
    )

    if (hasMatchingGenre || hasMatchingDescription) {
      detectedMoods.push(mood)
    }
  })

  return detectedMoods.length > 0 ? detectedMoods : ['relaxed'] // default fallback
}

// Generate mood-based playlists from content library
export function generateMoodPlaylists(movies: Movie[], series: Series[]): MoodPlaylist[] {
  const allContent = [...movies, ...series]

  return moodPlaylists.map(playlist => {
    const matchingContent = allContent.filter(content => {
      const contentMoods = detectMoodFromContent(content)
      return contentMoods.includes(playlist.mood)
    }).slice(0, 12) // Limit to 12 items per playlist

    return {
      ...playlist,
      content: matchingContent
    }
  })
}

// Get mood suggestions based on time of day and user preferences
export function getMoodSuggestions(timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'): MoodPlaylist[] {
  const hour = new Date().getHours()

  let suggestedMoods: string[] = []

  if (timeOfDay) {
    switch (timeOfDay) {
      case 'morning':
        suggestedMoods = ['inspirational', 'happy', 'relaxed']
        break
      case 'afternoon':
        suggestedMoods = ['adventurous', 'excited', 'romantic']
        break
      case 'evening':
        suggestedMoods = ['relaxed', 'romantic', 'scary']
        break
      case 'night':
        suggestedMoods = ['scary', 'thriller', 'emotional']
        break
    }
  } else {
    // Auto-detect based on current time
    if (hour >= 5 && hour < 12) {
      suggestedMoods = ['inspirational', 'happy']
    } else if (hour >= 12 && hour < 17) {
      suggestedMoods = ['adventurous', 'excited']
    } else if (hour >= 17 && hour < 22) {
      suggestedMoods = ['relaxed', 'romantic']
    } else {
      suggestedMoods = ['scary', 'emotional']
    }
  }

  return moodPlaylists.filter(playlist => suggestedMoods.includes(playlist.mood))
}

// Advanced mood detection using multiple factors
export function getPersonalizedMoodSuggestions(
  userHistory: (Movie | Series)[],
  currentTime: Date = new Date()
): MoodPlaylist[] {
  if (userHistory.length === 0) {
    return getMoodSuggestions()
  }

  // Analyze user's viewing history
  const userMoods = userHistory.flatMap(content => detectMoodFromContent(content))
  const moodFrequency = userMoods.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get top 3 preferred moods
  const topMoods = Object.entries(moodFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([mood]) => mood)

  // Consider time of day for final suggestions
  const hour = currentTime.getHours()
  let timeBasedMoods: string[] = []

  if (hour >= 5 && hour < 12) {
    timeBasedMoods = ['inspirational', 'happy', 'relaxed']
  } else if (hour >= 12 && hour < 17) {
    timeBasedMoods = ['adventurous', 'excited', 'romantic']
  } else if (hour >= 17 && hour < 22) {
    timeBasedMoods = ['relaxed', 'romantic', 'sad']
  } else {
    timeBasedMoods = ['scary', 'emotional', 'relaxed']
  }

  // Combine user preferences with time-based suggestions
  const combinedMoods = Array.from(new Set([...topMoods, ...timeBasedMoods]))

  return moodPlaylists
    .filter(playlist => combinedMoods.includes(playlist.mood))
    .sort((a, b) => {
      const aScore = topMoods.includes(a.mood) ? 2 : 1
      const bScore = topMoods.includes(b.mood) ? 2 : 1
      return bScore - aScore
    })
}