'use client'

import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setTheme, selectThemeMode } from '@/app/features/theme/themeSlice'
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi'

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const currentMode = useAppSelector(selectThemeMode)

  const themes = [
    { mode: 'light' as const, icon: FiSun, label: 'Light' },
    { mode: 'dark' as const, icon: FiMoon, label: 'Dark' },
    { mode: 'system' as const, icon: FiMonitor, label: 'System' },
  ]

  return (
    <div className="flex items-center space-x-1 bg-dark-100 rounded-lg p-1">
      {themes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => dispatch(setTheme(mode))}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
            currentMode === mode
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-dark-200'
          }`}
          title={`Switch to ${label} theme`}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}