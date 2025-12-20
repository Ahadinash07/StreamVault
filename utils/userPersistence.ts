import { User } from '@/app/features/user/userSlice'
import { WatchProgress } from '@/app/features/user/watchProgressSlice'
import { Settings } from '@/app/features/settings/settingsSlice'

// User data persistence keys
const USER_DATA_KEY = 'streamvault_user_data'
const WATCH_PROGRESS_KEY = 'streamvault_watch_progress'
const SETTINGS_KEY = 'streamvault_settings'

// Save user data to localStorage
export const saveUserData = (user: User) => {
  try {
    const userData = {
      ...user,
      lastLogin: new Date().toISOString(),
    }
    localStorage.setItem(`${USER_DATA_KEY}_${user.id}`, JSON.stringify(userData))
  } catch (error) {
    console.error('Failed to save user data:', error)
  }
}

// Load user data from localStorage
export const loadUserData = (userId: string): User | null => {
  try {
    const data = localStorage.getItem(`${USER_DATA_KEY}_${userId}`)
    if (data) {
      const userData = JSON.parse(data)
      // Remove lastLogin from the returned data as it's not part of the User interface
      const { lastLogin, ...user } = userData
      return user
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
  return null
}

// Save watch progress for a user
export const saveWatchProgress = (userId: string, progress: Record<string, WatchProgress>) => {
  try {
    localStorage.setItem(`${WATCH_PROGRESS_KEY}_${userId}`, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save watch progress:', error)
  }
}

// Load watch progress for a user
export const loadWatchProgress = (userId: string): Record<string, WatchProgress> => {
  try {
    const data = localStorage.getItem(`${WATCH_PROGRESS_KEY}_${userId}`)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Failed to load watch progress:', error)
    return {}
  }
}

// Save user settings
export const saveUserSettings = (userId: string, settings: Settings) => {
  try {
    localStorage.setItem(`${SETTINGS_KEY}_${userId}`, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save user settings:', error)
  }
}

// Load user settings
export const loadUserSettings = (userId: string): Settings | null => {
  try {
    const data = localStorage.getItem(`${SETTINGS_KEY}_${userId}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load user settings:', error)
    return null
  }
}

// Clear all user data (for logout)
export const clearUserData = (userId: string) => {
  try {
    localStorage.removeItem(`${USER_DATA_KEY}_${userId}`)
    localStorage.removeItem(`${WATCH_PROGRESS_KEY}_${userId}`)
    localStorage.removeItem(`${SETTINGS_KEY}_${userId}`)
  } catch (error) {
    console.error('Failed to clear user data:', error)
  }
}

// Get all stored user IDs (for account switching)
export const getStoredUserIds = (): string[] => {
  try {
    const keys = Object.keys(localStorage)
    return keys
      .filter(key => key.startsWith(USER_DATA_KEY))
      .map(key => key.replace(`${USER_DATA_KEY}_`, ''))
  } catch (error) {
    console.error('Failed to get stored user IDs:', error)
    return []
  }
}

// Check if user data exists for a given ID
export const hasUserData = (userId: string): boolean => {
  try {
    return localStorage.getItem(`${USER_DATA_KEY}_${userId}`) !== null
  } catch (error) {
    return false
  }
}

// Export/import user data (for backup/restore)
export const exportUserData = (userId: string) => {
  try {
    const userData = loadUserData(userId)
    const watchProgress = loadWatchProgress(userId)
    const settings = loadUserSettings(userId)

    return {
      userId,
      userData,
      watchProgress,
      settings,
      exportedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to export user data:', error)
    return null
  }
}

export const importUserData = (data: any) => {
  try {
    if (data.userId && data.userData) {
      saveUserData(data.userData)
    }
    if (data.userId && data.watchProgress) {
      saveWatchProgress(data.userId, data.watchProgress)
    }
    if (data.userId && data.settings) {
      saveUserSettings(data.userId, data.settings)
    }
    return true
  } catch (error) {
    console.error('Failed to import user data:', error)
    return false
  }
}

// Get storage usage for a user
export const getUserStorageUsage = (userId: string) => {
  try {
    const userData = localStorage.getItem(`${USER_DATA_KEY}_${userId}`) || ''
    const watchProgress = localStorage.getItem(`${WATCH_PROGRESS_KEY}_${userId}`) || ''
    const settings = localStorage.getItem(`${SETTINGS_KEY}_${userId}`) || ''

    const totalBytes = userData.length + watchProgress.length + settings.length
    const totalKB = Math.round(totalBytes / 1024)
    const totalMB = Math.round(totalKB / 1024 * 100) / 100

    return {
      bytes: totalBytes,
      kb: totalKB,
      mb: totalMB,
    }
  } catch (error) {
    console.error('Failed to calculate storage usage:', error)
    return { bytes: 0, kb: 0, mb: 0 }
  }
}