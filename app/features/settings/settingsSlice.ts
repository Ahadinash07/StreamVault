import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { saveUserSettings, loadUserSettings } from '@/utils/userPersistence'

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  newReleases: boolean
  recommendations: boolean
  watchPartyInvites: boolean
  socialActivity: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showWatchHistory: boolean
  showWatchlist: boolean
  allowDataCollection: boolean
  shareViewingStats: boolean
}

export interface PlaybackSettings {
  autoPlay: boolean
  autoPlayPreviews: boolean
  defaultQuality: 'low' | 'medium' | 'high' | 'ultra'
  skipIntro: boolean
  skipCredits: boolean
  enableSubtitles: boolean
  subtitleLanguage: string
  audioLanguage: string
}

export interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reduceMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
}

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  language: string
  region: string
  notifications: NotificationSettings
  privacy: PrivacySettings
  playback: PlaybackSettings
  accessibility: AccessibilitySettings
  parentalControls: {
    enabled: boolean
    pin: string
    restrictContent: boolean
    maxRating: string
  }
  downloads: {
    downloadQuality: 'low' | 'medium' | 'high'
    downloadOverWifi: boolean
    autoDelete: boolean
    storageLimit: number
  }
}

interface SettingsState {
  settings: Settings
  loading: boolean
  error: string | null
  userId: string | null
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  region: 'US',
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    newReleases: true,
    recommendations: true,
    watchPartyInvites: true,
    socialActivity: true,
  },
  privacy: {
    profileVisibility: 'public',
    showWatchHistory: true,
    showWatchlist: true,
    allowDataCollection: true,
    shareViewingStats: false,
  },
  playback: {
    autoPlay: true,
    autoPlayPreviews: true,
    defaultQuality: 'high',
    skipIntro: false,
    skipCredits: false,
    enableSubtitles: false,
    subtitleLanguage: 'en',
    audioLanguage: 'en',
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
  },
  parentalControls: {
    enabled: false,
    pin: '',
    restrictContent: false,
    maxRating: 'R',
  },
  downloads: {
    downloadQuality: 'high',
    downloadOverWifi: true,
    autoDelete: false,
    storageLimit: 50, // GB
  },
}

const initialState: SettingsState = {
  settings: defaultSettings,
  loading: false,
  error: null,
  userId: null,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Settings['theme']>) => {
      state.settings.theme = action.payload
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    updateNotifications: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.settings.notifications = { ...state.settings.notifications, ...action.payload }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    updatePrivacy: (state, action: PayloadAction<Partial<PrivacySettings>>) => {
      state.settings.privacy = { ...state.settings.privacy, ...action.payload }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    updatePlayback: (state, action: PayloadAction<Partial<PlaybackSettings>>) => {
      state.settings.playback = { ...state.settings.playback, ...action.payload }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    updateAccessibility: (state, action: PayloadAction<Partial<AccessibilitySettings>>) => {
      state.settings.accessibility = { ...state.settings.accessibility, ...action.payload }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    updateParentalControls: (state, action: PayloadAction<Partial<Settings['parentalControls']>>) => {
      state.settings.parentalControls = { ...state.settings.parentalControls, ...action.payload }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    updateDownloads: (state, action: PayloadAction<Partial<Settings['downloads']>>) => {
      state.settings.downloads = { ...state.settings.downloads, ...action.payload }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.settings.language = action.payload
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    setRegion: (state, action: PayloadAction<string>) => {
      state.settings.region = action.payload
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    loadSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = { ...defaultSettings, ...action.payload }
    },
    resetSettings: (state) => {
      state.settings = { ...defaultSettings }
      // Save to localStorage if userId is set
      if (state.userId) {
        saveUserSettings(state.userId, defaultSettings)
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    loadSettingsFromStorage: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      state.userId = userId
      const savedSettings = loadUserSettings(userId)
      if (savedSettings) {
        state.settings = { ...defaultSettings, ...savedSettings }
      }
    },
    saveSettingsToStorage: (state) => {
      if (state.userId) {
        saveUserSettings(state.userId, state.settings)
      }
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
  },
})

export const {
  setTheme,
  updateNotifications,
  updatePrivacy,
  updatePlayback,
  updateAccessibility,
  updateParentalControls,
  updateDownloads,
  setLanguage,
  setRegion,
  loadSettings,
  resetSettings,
  setLoading,
  setError,
  setUserId,
  loadSettingsFromStorage,
  saveSettingsToStorage,
} = settingsSlice.actions

export default settingsSlice.reducer