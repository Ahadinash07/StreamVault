import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ContentSection {
  id: string
  title: string
  subtitle?: string
  type: 'recommended' | 'trending' | 'top_rated' | 'new_releases' | 'mood_based' | 'genre_based' | 'language_based' | 'country_based' | 'decade_based' | 'because_watched' | 'ai_mood' | 'seasonal' | 'critically_acclaimed' | 'award_winners' | 'hidden_gems' | 'cult_classics' | 'family_favorites' | 'solo_watch' | 'group_watch' | 'quick_watch' | 'marathon_ready'
  contentIds: string[]
  contentType: 'movie' | 'series' | 'mixed'
  priority: number
  isVisible: boolean
  maxItems: number
  refreshInterval: number // in minutes
  lastUpdated: number
  metadata?: {
    mood?: string
    genre?: string
    language?: string
    country?: string
    decade?: string
    season?: string
    occasion?: string
    groupSize?: number
    duration?: number
    rating?: number
  }
}

export interface ContentSectionsState {
  sections: Record<string, ContentSection>
  sectionOrder: string[] // Order of sections on the page
  loadingStates: Record<string, boolean>
  errorStates: Record<string, string | null>
  lastRefresh: Record<string, number>
  userPreferences: {
    hiddenSections: string[]
    expandedSections: string[]
    favoriteSections: string[]
  }
  cache: {
    sectionData: Record<string, { data: ContentSection; timestamp: number }>
    contentLookup: Record<string, string[]> // contentId -> sectionIds
  }
}

const initialState: ContentSectionsState = {
  sections: {},
  sectionOrder: [
    'continue-watching',
    'trending-now',
    'top-rated',
    'new-releases',
    'recommended-for-you',
    'mood-playlists',
    'award-winners',
    'hidden-gems',
    'cult-classics',
    'family-favorites',
    'solo-watch',
    'group-watch',
    'quick-watch',
    'marathon-ready'
  ],
  loadingStates: {},
  errorStates: {},
  lastRefresh: {},
  userPreferences: {
    hiddenSections: [],
    expandedSections: [],
    favoriteSections: []
  },
  cache: {
    sectionData: {},
    contentLookup: {}
  }
}

const contentSectionsSlice = createSlice({
  name: 'contentSections',
  initialState,
  reducers: {
    // Section Management
    setSection: (state, action: PayloadAction<ContentSection>) => {
      const section = action.payload
      state.sections[section.id] = section
      state.lastRefresh[section.id] = Date.now()

      // Update content lookup
      section.contentIds.forEach(contentId => {
        if (!state.cache.contentLookup[contentId]) {
          state.cache.contentLookup[contentId] = []
        }
        if (!state.cache.contentLookup[contentId].includes(section.id)) {
          state.cache.contentLookup[contentId].push(section.id)
        }
      })

      // Cache section data
      state.cache.sectionData[section.id] = {
        data: section,
        timestamp: Date.now()
      }
    },

    updateSectionContent: (state, action: PayloadAction<{ sectionId: string; contentIds: string[] }>) => {
      const { sectionId, contentIds } = action.payload
      if (state.sections[sectionId]) {
        // Remove old content lookups
        state.sections[sectionId].contentIds.forEach(contentId => {
          if (state.cache.contentLookup[contentId]) {
            state.cache.contentLookup[contentId] = state.cache.contentLookup[contentId].filter(id => id !== sectionId)
          }
        })

        // Update section
        state.sections[sectionId].contentIds = contentIds
        state.sections[sectionId].lastUpdated = Date.now()

        // Add new content lookups
        contentIds.forEach(contentId => {
          if (!state.cache.contentLookup[contentId]) {
            state.cache.contentLookup[contentId] = []
          }
          if (!state.cache.contentLookup[contentId].includes(sectionId)) {
            state.cache.contentLookup[contentId].push(sectionId)
          }
        })
      }
    },

    setSectionOrder: (state, action: PayloadAction<string[]>) => {
      state.sectionOrder = action.payload
    },

    toggleSectionVisibility: (state, action: PayloadAction<{ sectionId: string; visible: boolean }>) => {
      const { sectionId, visible } = action.payload
      if (state.sections[sectionId]) {
        state.sections[sectionId].isVisible = visible
      }
    },

    // Loading States
    setSectionLoading: (state, action: PayloadAction<{ sectionId: string; loading: boolean }>) => {
      state.loadingStates[action.payload.sectionId] = action.payload.loading
    },

    setSectionError: (state, action: PayloadAction<{ sectionId: string; error: string | null }>) => {
      state.errorStates[action.payload.sectionId] = action.payload.error
    },

    // User Preferences
    hideSection: (state, action: PayloadAction<string>) => {
      if (!state.userPreferences.hiddenSections.includes(action.payload)) {
        state.userPreferences.hiddenSections.push(action.payload)
      }
    },

    showSection: (state, action: PayloadAction<string>) => {
      state.userPreferences.hiddenSections = state.userPreferences.hiddenSections.filter(id => id !== action.payload)
    },

    toggleSectionExpanded: (state, action: PayloadAction<string>) => {
      const sectionId = action.payload
      if (state.userPreferences.expandedSections.includes(sectionId)) {
        state.userPreferences.expandedSections = state.userPreferences.expandedSections.filter(id => id !== sectionId)
      } else {
        state.userPreferences.expandedSections.push(sectionId)
      }
    },

    addFavoriteSection: (state, action: PayloadAction<string>) => {
      if (!state.userPreferences.favoriteSections.includes(action.payload)) {
        state.userPreferences.favoriteSections.push(action.payload)
      }
    },

    removeFavoriteSection: (state, action: PayloadAction<string>) => {
      state.userPreferences.favoriteSections = state.userPreferences.favoriteSections.filter(id => id !== action.payload)
    },

    // Bulk Operations
    loadSections: (state, action: PayloadAction<ContentSection[]>) => {
      action.payload.forEach(section => {
        state.sections[section.id] = section
        state.lastRefresh[section.id] = Date.now()

        // Update content lookup
        section.contentIds.forEach(contentId => {
          if (!state.cache.contentLookup[contentId]) {
            state.cache.contentLookup[contentId] = []
          }
          if (!state.cache.contentLookup[contentId].includes(section.id)) {
            state.cache.contentLookup[contentId].push(section.id)
          }
        })

        // Cache section data
        state.cache.sectionData[section.id] = {
          data: section,
          timestamp: Date.now()
        }
      })
    },

    refreshSection: (state, action: PayloadAction<string>) => {
      state.lastRefresh[action.payload] = Date.now()
    },

    refreshAllSections: (state) => {
      const now = Date.now()
      Object.keys(state.sections).forEach(sectionId => {
        state.lastRefresh[sectionId] = now
      })
    },

    // AI-Powered Section Generation
    generatePersonalizedSections: (state, action: PayloadAction<{
      userId: string
      watchHistory: string[]
      preferences: any
      currentTime: number
      weather?: string
      occasion?: string
    }>) => {
      // This would trigger AI generation of personalized sections
      // For now, it's a placeholder for future AI integration
    },

    generateMoodBasedSections: (state, action: PayloadAction<{
      mood: string
      context: any
    }>) => {
      // Generate sections based on detected mood
    },

    generateContextualSections: (state, action: PayloadAction<{
      timeOfDay: string
      dayOfWeek: string
      season: string
      location?: string
    }>) => {
      // Generate sections based on time/context
    },

    // Analytics and Tracking
    trackSectionInteraction: (state, action: PayloadAction<{
      sectionId: string
      interactionType: 'view' | 'click' | 'scroll' | 'expand' | 'collapse'
      contentId?: string
      position?: number
    }>) => {
      // Track user interactions with sections for analytics
    },

    // Cache Management
    clearSectionCache: (state, action: PayloadAction<{ sectionId?: string }>) => {
      if (action.payload.sectionId) {
        delete state.cache.sectionData[action.payload.sectionId]
      } else {
        state.cache.sectionData = {}
        state.cache.contentLookup = {}
      }
    },

    invalidateStaleSections: (state) => {
      const now = Date.now()
      const staleThreshold = 30 * 60 * 1000 // 30 minutes

      Object.keys(state.cache.sectionData).forEach(sectionId => {
        if (now - state.cache.sectionData[sectionId].timestamp > staleThreshold) {
          delete state.cache.sectionData[sectionId]
        }
      })
    },

    // Section Customization
    reorderSections: (state, action: PayloadAction<{ sectionId: string; newPosition: number }>) => {
      const { sectionId, newPosition } = action.payload
      const currentIndex = state.sectionOrder.indexOf(sectionId)

      if (currentIndex !== -1) {
        state.sectionOrder.splice(currentIndex, 1)
        state.sectionOrder.splice(newPosition, 0, sectionId)
      }
    },

    customizeSection: (state, action: PayloadAction<{
      sectionId: string
      updates: Partial<ContentSection>
    }>) => {
      const { sectionId, updates } = action.payload
      if (state.sections[sectionId]) {
        Object.assign(state.sections[sectionId], updates)
      }
    },

    // Reset and Cleanup
    resetSections: (state) => {
      state.sections = {}
      state.loadingStates = {}
      state.errorStates = {}
      state.lastRefresh = {}
      state.cache.sectionData = {}
      state.cache.contentLookup = {}
    },

    resetUserPreferences: (state) => {
      state.userPreferences = {
        hiddenSections: [],
        expandedSections: [],
        favoriteSections: []
      }
    },
  },
})

export const {
  setSection,
  updateSectionContent,
  setSectionOrder,
  toggleSectionVisibility,
  setSectionLoading,
  setSectionError,
  hideSection,
  showSection,
  toggleSectionExpanded,
  addFavoriteSection,
  removeFavoriteSection,
  loadSections,
  refreshSection,
  refreshAllSections,
  generatePersonalizedSections,
  generateMoodBasedSections,
  generateContextualSections,
  trackSectionInteraction,
  clearSectionCache,
  invalidateStaleSections,
  reorderSections,
  customizeSection,
  resetSections,
  resetUserPreferences,
} = contentSectionsSlice.actions

export default contentSectionsSlice.reducer