'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { updateSystemPreference } from '@/app/features/theme/themeSlice'

interface ThemeProviderProps {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector((state) => state.settings.settings.theme)
  const systemPreference = useAppSelector((state) => state.theme.systemPreference)

  const currentTheme = themeMode === 'system' ? systemPreference : themeMode

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(currentTheme)

    // Update system preference when it changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => dispatch(updateSystemPreference())

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [currentTheme, dispatch])

  return <>{children}</>
}