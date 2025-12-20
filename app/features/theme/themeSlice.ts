import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Theme } from '@/types/content'

interface ThemeState extends Theme {
  systemPreference: 'light' | 'dark'
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark' // default fallback
}

const getInitialTheme = (): ThemeState => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
  const systemPreference = getSystemTheme()

  if (saved === 'light' || saved === 'dark') {
    return { mode: saved, systemPreference }
  }

  return { mode: 'system', systemPreference }
}

const initialState: ThemeState = getInitialTheme()

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme['mode']>) => {
      state.mode = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
    },
    updateSystemPreference: (state) => {
      state.systemPreference = getSystemTheme()
    },
  },
})

export const { setTheme, updateSystemPreference } = themeSlice.actions

export const selectCurrentTheme = (state: { theme: ThemeState }) => {
  const { mode, systemPreference } = state.theme
  return mode === 'system' ? systemPreference : mode
}

export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode

export default themeSlice.reducer