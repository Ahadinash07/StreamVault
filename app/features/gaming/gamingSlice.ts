import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Game {
  id: string
  title: string
  description: string
  genre: string
  rating: number
  players: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  image: string
  trailer: string
  featured: boolean
  new: boolean
  tags: string[]
  screenshots?: string[]
  achievements?: Achievement[]
  reviews?: Review[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

export interface Review {
  id: string
  userId: string
  username: string
  avatar: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
}

export interface GameSession {
  id: string
  gameId: string
  startTime: string
  endTime?: string
  score?: number
  duration: number
  completed: boolean
}

export interface UserGameStats {
  gameId: string
  totalPlayTime: number
  sessionsPlayed: number
  bestScore?: number
  achievementsUnlocked: number
  lastPlayed: string
  favorite: boolean
  rating?: number
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar: string
  score: number
  gamesPlayed: number
  rank: number
  change: number // position change from last week
}

export interface Tournament {
  id: string
  title: string
  description: string
  gameId: string
  startDate: string
  endDate: string
  prizePool: number
  maxParticipants: number
  currentParticipants: number
  status: 'upcoming' | 'active' | 'completed'
  entryFee: number
  rules: string[]
}

export interface GamingState {
  games: Game[]
  userGameStats: UserGameStats[]
  currentGameSession: GameSession | null
  leaderboard: LeaderboardEntry[]
  tournaments: Tournament[]
  achievements: Achievement[]
  loading: boolean
  error: string | null
  activeTab: string
  filters: {
    genre: string
    difficulty: string
    sortBy: string
  }
  searchQuery: string
}

const initialState: GamingState = {
  games: [
    {
      id: 'game-1',
      title: 'Stream Quest',
      description: 'An epic adventure game designed for streamers and viewers to play together',
      genre: 'Adventure',
      rating: 9.2,
      players: '1-4 Players',
      duration: '30-60 min',
      difficulty: 'Medium',
      image: 'https://picsum.photos/seed/game1/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      featured: true,
      new: true,
      tags: ['Multiplayer', 'Adventure', 'Co-op'],
      screenshots: [
        'https://picsum.photos/seed/game1-1/800/600',
        'https://picsum.photos/seed/game1-2/800/600',
        'https://picsum.photos/seed/game1-3/800/600'
      ],
      achievements: [
        {
          id: 'ach-1',
          title: 'First Quest',
          description: 'Complete your first quest',
          icon: '🎯',
          rarity: 'Common',
          unlocked: true,
          unlockedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'ach-2',
          title: 'Team Player',
          description: 'Play with 3 other players',
          icon: '👥',
          rarity: 'Rare',
          unlocked: false,
          progress: 2,
          maxProgress: 3
        }
      ],
      reviews: [
        {
          id: 'rev-1',
          userId: 'user-1',
          username: 'MovieMaster2024',
          avatar: 'https://picsum.photos/seed/user1/40/40',
          rating: 5,
          comment: 'Amazing game! The co-op mechanics are fantastic.',
          createdAt: '2024-01-10T14:20:00Z',
          helpful: 12
        }
      ]
    },
    {
      id: 'game-2',
      title: 'Movie Trivia Master',
      description: 'Test your movie knowledge with friends in this interactive trivia game',
      genre: 'Trivia',
      rating: 8.8,
      players: '2-8 Players',
      duration: '15-30 min',
      difficulty: 'Easy',
      image: 'https://picsum.photos/seed/game2/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      featured: true,
      new: false,
      tags: ['Trivia', 'Educational', 'Party']
    },
    {
      id: 'game-3',
      title: 'Director\'s Cut',
      description: 'Create your own movie scenes and compete with other aspiring directors',
      genre: 'Creative',
      rating: 9.0,
      players: '1-6 Players',
      duration: '45-90 min',
      difficulty: 'Hard',
      image: 'https://picsum.photos/seed/game3/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      featured: false,
      new: true,
      tags: ['Creative', 'Strategy', 'Educational']
    },
    {
      id: 'game-4',
      title: 'Binge Watch Challenge',
      description: 'Race against time to identify movie scenes and quotes',
      genre: 'Puzzle',
      rating: 8.5,
      players: '1-4 Players',
      duration: '20-40 min',
      difficulty: 'Medium',
      image: 'https://picsum.photos/seed/game4/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      featured: false,
      new: false,
      tags: ['Puzzle', 'Quick', 'Competitive']
    },
    {
      id: 'game-5',
      title: 'Cinematic Puzzles',
      description: 'Solve intricate puzzles based on famous movie scenes',
      genre: 'Puzzle',
      rating: 8.9,
      players: '1 Player',
      duration: '20-45 min',
      difficulty: 'Medium',
      image: 'https://picsum.photos/seed/game5/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      featured: false,
      new: false,
      tags: ['Puzzle', 'Single Player', 'Brain Teaser']
    },
    {
      id: 'game-6',
      title: 'Streaming Showdown',
      description: 'Battle other streamers in movie-themed combat',
      genre: 'Action',
      rating: 9.1,
      players: '2-4 Players',
      duration: '25-50 min',
      difficulty: 'Hard',
      image: 'https://picsum.photos/seed/game6/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      featured: true,
      new: false,
      tags: ['Action', 'Competitive', 'Fast-Paced']
    },
    {
      id: 'game-7',
      title: 'Genre Blender',
      description: 'Mix and match movie genres to create hilarious combinations',
      genre: 'Party',
      rating: 8.7,
      players: '3-8 Players',
      duration: '30-45 min',
      difficulty: 'Easy',
      image: 'https://picsum.photos/seed/game7/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      featured: false,
      new: false,
      tags: ['Party', 'Creative', 'Funny']
    },
    {
      id: 'game-8',
      title: 'Plot Twister',
      description: 'Rewrite famous movie plots with unexpected twists and endings',
      genre: 'Creative',
      rating: 9.3,
      players: '2-4 Players',
      duration: '40-70 min',
      difficulty: 'Medium',
      image: 'https://picsum.photos/seed/game8/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      featured: true,
      new: true,
      tags: ['Creative', 'Writing', 'Co-op']
    },
    {
      id: 'game-9',
      title: 'Oscar Night',
      description: 'Host your own virtual Oscars and vote on the best movie moments',
      genre: 'Party',
      rating: 8.4,
      players: '4-12 Players',
      duration: '45-90 min',
      difficulty: 'Easy',
      image: 'https://picsum.photos/seed/game9/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      featured: false,
      new: false,
      tags: ['Party', 'Voting', 'Celebration']
    },
    {
      id: 'game-10',
      title: 'Script Doctor',
      description: 'Diagnose and fix plot holes in famous movie scripts',
      genre: 'Puzzle',
      rating: 8.6,
      players: '1-4 Players',
      duration: '30-50 min',
      difficulty: 'Medium',
      image: 'https://picsum.photos/seed/game10/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      featured: false,
      new: false,
      tags: ['Puzzle', 'Educational', 'Analysis']
    },
    {
      id: 'game-11',
      title: 'Stream Wars',
      description: 'Epic battles between streaming platforms in a sci-fi universe',
      genre: 'Strategy',
      rating: 9.4,
      players: '2-6 Players',
      duration: '90-150 min',
      difficulty: 'Hard',
      image: 'https://picsum.photos/seed/game11/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      featured: true,
      new: false,
      tags: ['Strategy', 'Sci-Fi', 'Competitive']
    },
    {
      id: 'game-12',
      title: 'Reel Time',
      description: 'Real-time movie making with split-second decisions',
      genre: 'Action',
      rating: 8.3,
      players: '1-2 Players',
      duration: '15-25 min',
      difficulty: 'Medium',
      image: 'https://picsum.photos/seed/game12/400/300',
      trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      featured: false,
      new: false,
      tags: ['Action', 'Real-time', 'Decision Making']
    }
  ],
  userGameStats: [],
  currentGameSession: null,
  leaderboard: [
    { id: '1', username: 'MovieMaster2024', avatar: 'https://picsum.photos/seed/user1/40/40', score: 1500, gamesPlayed: 25, rank: 1, change: 0 },
    { id: '2', username: 'Cinephile99', avatar: 'https://picsum.photos/seed/user2/40/40', score: 1420, gamesPlayed: 22, rank: 2, change: 1 },
    { id: '3', username: 'StreamKing', avatar: 'https://picsum.photos/seed/user3/40/40', score: 1380, gamesPlayed: 20, rank: 3, change: -1 },
    { id: '4', username: 'FilmBuff42', avatar: 'https://picsum.photos/seed/user4/40/40', score: 1320, gamesPlayed: 18, rank: 4, change: 2 },
    { id: '5', username: 'DirectorDreams', avatar: 'https://picsum.photos/seed/user5/40/40', score: 1280, gamesPlayed: 16, rank: 5, change: -1 }
  ],
  tournaments: [
    {
      id: 'tournament-1',
      title: 'Winter Movie Championship',
      description: 'The ultimate movie gaming tournament of the season',
      gameId: 'game-1',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-28T23:59:59Z',
      prizePool: 5000,
      maxParticipants: 64,
      currentParticipants: 42,
      status: 'active',
      entryFee: 50,
      rules: ['Must complete all quests', 'No cheating allowed', 'Fair play required']
    },
    {
      id: 'tournament-2',
      title: 'Trivia Masters Cup',
      description: 'Test your movie knowledge in this prestigious tournament',
      gameId: 'game-2',
      startDate: '2024-02-15T00:00:00Z',
      endDate: '2024-03-15T23:59:59Z',
      prizePool: 3000,
      maxParticipants: 32,
      currentParticipants: 28,
      status: 'upcoming',
      entryFee: 25,
      rules: ['All questions must be answered', 'Time limits apply', 'No external help']
    }
  ],
  achievements: [],
  loading: false,
  error: null,
  activeTab: 'games',
  filters: {
    genre: 'all',
    difficulty: 'all',
    sortBy: 'rating'
  },
  searchQuery: ''
}

const gamingSlice = createSlice({
  name: 'gaming',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<GamingState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    startGameSession: (state, action: PayloadAction<{ gameId: string }>) => {
      const session: GameSession = {
        id: `session-${Date.now()}`,
        gameId: action.payload.gameId,
        startTime: new Date().toISOString(),
        duration: 0,
        completed: false
      }
      state.currentGameSession = session
    },
    endGameSession: (state, action: PayloadAction<{ score?: number; completed?: boolean }>) => {
      if (state.currentGameSession) {
        state.currentGameSession.endTime = new Date().toISOString()
        state.currentGameSession.score = action.payload.score
        state.currentGameSession.completed = action.payload.completed || false
        state.currentGameSession.duration = new Date(state.currentGameSession.endTime).getTime() -
                                          new Date(state.currentGameSession.startTime).getTime()

        // Update user stats
        const existingStats = state.userGameStats.find(
          stats => stats.gameId === state.currentGameSession!.gameId
        )

        if (existingStats) {
          existingStats.totalPlayTime += state.currentGameSession.duration
          existingStats.sessionsPlayed += 1
          existingStats.lastPlayed = new Date().toISOString()
          if (action.payload.score && (!existingStats.bestScore || action.payload.score > existingStats.bestScore)) {
            existingStats.bestScore = action.payload.score
          }
        } else {
          state.userGameStats.push({
            gameId: state.currentGameSession.gameId,
            totalPlayTime: state.currentGameSession.duration,
            sessionsPlayed: 1,
            bestScore: action.payload.score,
            achievementsUnlocked: 0,
            lastPlayed: new Date().toISOString(),
            favorite: false
          })
        }

        state.currentGameSession = null
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const stats = state.userGameStats.find(stats => stats.gameId === action.payload)
      if (stats) {
        stats.favorite = !stats.favorite
      } else {
        state.userGameStats.push({
          gameId: action.payload,
          totalPlayTime: 0,
          sessionsPlayed: 0,
          achievementsUnlocked: 0,
          lastPlayed: new Date().toISOString(),
          favorite: true
        })
      }
    },
    rateGame: (state, action: PayloadAction<{ gameId: string; rating: number }>) => {
      const stats = state.userGameStats.find(stats => stats.gameId === action.payload.gameId)
      if (stats) {
        stats.rating = action.payload.rating
      } else {
        state.userGameStats.push({
          gameId: action.payload.gameId,
          totalPlayTime: 0,
          sessionsPlayed: 0,
          achievementsUnlocked: 0,
          lastPlayed: new Date().toISOString(),
          favorite: false,
          rating: action.payload.rating
        })
      }
    },
    unlockAchievement: (state, action: PayloadAction<{ gameId: string; achievementId: string }>) => {
      const game = state.games.find(g => g.id === action.payload.gameId)
      const achievement = game?.achievements?.find(a => a.id === action.payload.achievementId)

      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date().toISOString()

        // Update user stats
        const stats = state.userGameStats.find(stats => stats.gameId === action.payload.gameId)
        if (stats) {
          stats.achievementsUnlocked += 1
        }
      }
    },
    joinTournament: (state, action: PayloadAction<string>) => {
      const tournament = state.tournaments.find(t => t.id === action.payload)
      if (tournament && tournament.currentParticipants < tournament.maxParticipants) {
        tournament.currentParticipants += 1
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  setActiveTab,
  setFilters,
  setSearchQuery,
  startGameSession,
  endGameSession,
  toggleFavorite,
  rateGame,
  unlockAchievement,
  joinTournament,
  setLoading,
  setError
} = gamingSlice.actions

export default gamingSlice.reducer