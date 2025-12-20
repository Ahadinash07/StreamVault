import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'watching' | 'social' | 'exploration' | 'streak'
  points: number
  unlockedAt?: string
  progress: number
  target: number
}

interface AchievementsState {
  achievements: Achievement[]
  totalPoints: number
  level: number
}

const initialAchievements: Achievement[] = [
  {
    id: 'first-watch',
    title: 'First Watch',
    description: 'Watch your first movie or series',
    icon: '🎬',
    category: 'watching',
    points: 10,
    progress: 0,
    target: 1,
  },
  {
    id: 'binge-watcher',
    title: 'Binge Watcher',
    description: 'Watch 10 episodes in one day',
    icon: '📺',
    category: 'watching',
    points: 50,
    progress: 0,
    target: 10,
  },
  {
    id: 'movie-buff',
    title: 'Movie Buff',
    description: 'Watch 50 movies',
    icon: '🎞️',
    category: 'watching',
    points: 100,
    progress: 0,
    target: 50,
  },
  {
    id: 'series-master',
    title: 'Series Master',
    description: 'Complete 10 series',
    icon: '🏆',
    category: 'watching',
    points: 150,
    progress: 0,
    target: 10,
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Add 10 friends',
    icon: '👥',
    category: 'social',
    points: 75,
    progress: 0,
    target: 10,
  },
  {
    id: 'critic',
    title: 'Critic',
    description: 'Write 20 reviews',
    icon: '✍️',
    category: 'social',
    points: 100,
    progress: 0,
    target: 20,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Watch content from 10 different genres',
    icon: '🗺️',
    category: 'exploration',
    points: 80,
    progress: 0,
    target: 10,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Watch content after midnight 10 times',
    icon: '🦉',
    category: 'watching',
    points: 60,
    progress: 0,
    target: 10,
  },
  {
    id: 'streak-7',
    title: 'Weekly Streak',
    description: 'Watch something 7 days in a row',
    icon: '🔥',
    category: 'streak',
    points: 100,
    progress: 0,
    target: 7,
  },
  {
    id: 'streak-30',
    title: 'Monthly Streak',
    description: 'Watch something 30 days in a row',
    icon: '💪',
    category: 'streak',
    points: 500,
    progress: 0,
    target: 30,
  },
]

const initialState: AchievementsState = {
  achievements: initialAchievements,
  totalPoints: 0,
  level: 1,
}

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    updateAchievementProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      const achievement = state.achievements.find((a) => a.id === action.payload.id)
      if (achievement) {
        achievement.progress = action.payload.progress
        if (achievement.progress >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date().toISOString()
          state.totalPoints += achievement.points
          state.level = Math.floor(state.totalPoints / 100) + 1
        }
      }
    },
    unlockAchievement: (state, action: PayloadAction<string>) => {
      const achievement = state.achievements.find((a) => a.id === action.payload)
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString()
        achievement.progress = achievement.target
        state.totalPoints += achievement.points
        state.level = Math.floor(state.totalPoints / 100) + 1
      }
    },
    resetAchievements: (state) => {
      state.achievements = initialAchievements.map((a) => ({
        ...a,
        unlockedAt: undefined,
        progress: 0,
      }))
      state.totalPoints = 0
      state.level = 1
    },
  },
})

export const { updateAchievementProgress, unlockAchievement, resetAchievements } =
  achievementsSlice.actions

export default achievementsSlice.reducer

