'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  FiUser,
  FiBell,
  FiShield,
  FiPlay,
  FiEye,
  FiDownload,
  FiGlobe,
  FiSave,
  FiRotateCcw,
  FiChevronRight,
  FiCheck,
  FiX,
  FiSettings,
  FiMonitor,
  FiVolume2,
  FiLock,
  FiWifi,
  FiHardDrive,
  FiStar,
  FiMoon,
  FiSun,
  FiSmartphone,
  FiGlobe as FiLanguage,
  FiMapPin
} from 'react-icons/fi'
import {
  setTheme,
  updateNotifications,
  updatePrivacy,
  updatePlayback,
  updateAccessibility,
  updateParentalControls,
  updateDownloads,
  setLanguage,
  setRegion,
  resetSettings,
  loadSettings
} from '../features/settings/settingsSlice'
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage'

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const settingsState = useAppSelector((state) => state.settings)
  const settings = settingsState?.settings || {
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
      storageLimit: 50,
    },
  }
  const [activeTab, setActiveTab] = useState('general')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Use window.location for immediate redirect
      window.location.href = '/login'
      return
    }

    // Load user settings from localStorage
    const savedSettings = loadFromLocalStorage(`settings_${user?.id}`, null)
    if (savedSettings) {
      dispatch(loadSettings(savedSettings))
    }
  }, [isAuthenticated, user?.id, dispatch])

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [settings])

  const saveSettings = () => {
    if (user?.id) {
      saveToLocalStorage(`settings_${user.id}`, settings)
      setHasUnsavedChanges(false)
    }
  }

  const handleResetSettings = () => {
    dispatch(resetSettings())
    setShowResetConfirm(false)
    setHasUnsavedChanges(true)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: FiUser, description: 'Profile & appearance settings', color: 'from-blue-500 to-purple-600' },
    { id: 'playback', label: 'Playback', icon: FiPlay, description: 'Video & audio preferences', color: 'from-green-500 to-teal-600' },
    { id: 'notifications', label: 'Notifications', icon: FiBell, description: 'Alerts & updates', color: 'from-yellow-500 to-orange-600' },
    { id: 'privacy', label: 'Privacy', icon: FiShield, description: 'Security & data protection', color: 'from-red-500 to-pink-600' },
    { id: 'accessibility', label: 'Accessibility', icon: FiEye, description: 'Inclusive features', color: 'from-indigo-500 to-blue-600' },
    { id: 'downloads', label: 'Downloads', icon: FiDownload, description: 'Offline content management', color: 'from-cyan-500 to-blue-600' },
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' },
  ]

  const regions = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative pt-20 md:pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
                <FiSettings className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                Settings
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Customize your StreamVault experience with premium controls and personalized preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 -mt-8 relative z-10">

            {/* Premium Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiSettings className="w-5 h-5 text-blue-400" />
                    Preferences
                  </h3>
                  <nav className="space-y-3">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-[1.02]'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white hover:scale-[1.01] border border-white/5'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${
                            activeTab === tab.id
                              ? 'bg-white/20'
                              : `bg-gradient-to-r ${tab.color} bg-opacity-20`
                          }`}>
                            <tab.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{tab.label}</div>
                            <div className={`text-xs mt-1 ${
                              activeTab === tab.id ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {tab.description}
                            </div>
                          </div>
                          <FiChevronRight className={`w-4 h-4 mt-1 transition-transform ${
                            activeTab === tab.id ? 'rotate-90' : 'group-hover:translate-x-1'
                          }`} />
                        </div>
                        {activeTab === tab.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={saveSettings}
                    disabled={!hasUnsavedChanges}
                    className={`w-full relative overflow-hidden rounded-2xl py-3 px-4 font-semibold transition-all duration-300 ${
                      hasUnsavedChanges
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] group'
                        : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiSave className="w-4 h-4" />
                      <span>Save Changes</span>
                      {hasUnsavedChanges && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                    {hasUnsavedChanges && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 animate-pulse"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-2xl py-3 px-4 font-semibold transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiRotateCcw className="w-4 h-4" />
                      <span>Reset to Defaults</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Content Area */}
            <div className="lg:col-span-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[600px]">

                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                        <FiUser className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">General Settings</h2>
                        <p className="text-gray-400">Manage your profile and appearance preferences</p>
                      </div>
                    </div>

                    {/* Theme Section */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                        <FiSettings className="w-5 h-5 text-purple-400" />
                        <h3 className="text-xl font-semibold text-white">Appearance</h3>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: FiSun, desc: 'Bright and clean' },
                          { value: 'dark', label: 'Dark', icon: FiMoon, desc: 'Easy on eyes' },
                          { value: 'system', label: 'System', icon: FiMonitor, desc: 'Auto-detect' }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => dispatch(setTheme(theme.value as any))}
                            className={`relative overflow-hidden rounded-2xl p-4 border-2 transition-all duration-300 ${
                              settings.theme === theme.value
                                ? 'border-blue-500 bg-blue-500/20 shadow-xl'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex flex-col items-center text-center">
                              <theme.icon className={`w-8 h-8 mb-3 ${
                                settings.theme === theme.value ? 'text-blue-400' : 'text-gray-400'
                              }`} />
                              <div className="font-semibold text-white mb-1">{theme.label}</div>
                              <div className="text-xs text-gray-400">{theme.desc}</div>
                            </div>
                            {settings.theme === theme.value && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiCheck className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language & Region */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                        <FiGlobe className="w-5 h-5 text-green-400" />
                        <h3 className="text-xl font-semibold text-white">Language & Region</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                              <FiLanguage className="w-4 h-4 text-blue-400" />
                              <span className="text-white font-medium">Language</span>
                            </div>
                            <select
                              value={settings.language}
                              onChange={(e) => dispatch(setLanguage(e.target.value))}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            >
                              {languages.map((lang) => (
                                <option key={lang.code} value={lang.code} className="bg-gray-800">
                                  {lang.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="space-y-3">
                          <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                              <FiMapPin className="w-4 h-4 text-red-400" />
                              <span className="text-white font-medium">Region</span>
                            </div>
                            <select
                              value={settings.region}
                              onChange={(e) => dispatch(setRegion(e.target.value))}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            >
                              {regions.map((region) => (
                                <option key={region.code} value={region.code} className="bg-gray-800">
                                  {region.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Playback Settings */}
                {activeTab === 'playback' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl">
                        <FiPlay className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Playback Settings</h2>
                        <p className="text-gray-400">Customize your video and audio experience</p>
                      </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                        <FiVolume2 className="w-5 h-5 text-green-400" />
                        <h3 className="text-xl font-semibold text-white">Playback Controls</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Auto Play */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-white font-medium">Auto-play Episodes</div>
                              <div className="text-gray-400 text-sm">Play next episode automatically</div>
                            </div>
                            <button
                              onClick={() => dispatch(updatePlayback({ autoPlay: !settings.playback.autoPlay }))}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                settings.playback.autoPlay ? 'bg-green-500' : 'bg-gray-600'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                settings.playback.autoPlay ? 'translate-x-6' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* Auto Play Previews */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-white font-medium">Auto-play Previews</div>
                              <div className="text-gray-400 text-sm">Show previews automatically</div>
                            </div>
                            <button
                              onClick={() => dispatch(updatePlayback({ autoPlayPreviews: !settings.playback.autoPlayPreviews }))}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                settings.playback.autoPlayPreviews ? 'bg-green-500' : 'bg-gray-600'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                settings.playback.autoPlayPreviews ? 'translate-x-6' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* Skip Intro */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-white font-medium">Skip Intros</div>
                              <div className="text-gray-400 text-sm">Automatically skip episode intros</div>
                            </div>
                            <button
                              onClick={() => dispatch(updatePlayback({ skipIntro: !settings.playback.skipIntro }))}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                settings.playback.skipIntro ? 'bg-blue-500' : 'bg-gray-600'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                settings.playback.skipIntro ? 'translate-x-6' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* Skip Credits */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-white font-medium">Skip Credits</div>
                              <div className="text-gray-400 text-sm">Automatically skip end credits</div>
                            </div>
                            <button
                              onClick={() => dispatch(updatePlayback({ skipCredits: !settings.playback.skipCredits }))}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                settings.playback.skipCredits ? 'bg-blue-500' : 'bg-gray-600'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                settings.playback.skipCredits ? 'translate-x-6' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quality & Language */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                        <FiMonitor className="w-5 h-5 text-blue-400" />
                        <h3 className="text-xl font-semibold text-white">Quality & Language</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                              <FiMonitor className="w-4 h-4 text-purple-400" />
                              <span className="text-white font-medium">Default Quality</span>
                            </div>
                            <select
                              value={settings.playback.defaultQuality}
                              onChange={(e) => dispatch(updatePlayback({ defaultQuality: e.target.value as any }))}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            >
                              <option value="low" className="bg-gray-800">Low (480p)</option>
                              <option value="medium" className="bg-gray-800">Medium (720p)</option>
                              <option value="high" className="bg-gray-800">High (1080p)</option>
                              <option value="ultra" className="bg-gray-800">Ultra (4K)</option>
                            </select>
                          </label>
                        </div>

                        <div className="space-y-3">
                          <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                              <FiGlobe className="w-4 h-4 text-green-400" />
                              <span className="text-white font-medium">Audio Language</span>
                            </div>
                            <select
                              value={settings.playback.audioLanguage}
                              onChange={(e) => dispatch(updatePlayback({ audioLanguage: e.target.value }))}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                            >
                              {languages.slice(0, 5).map((lang) => (
                                <option key={lang.code} value={lang.code} className="bg-gray-800">
                                  {lang.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>

                      {/* Subtitles */}
                      <div className="mt-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-white font-medium">Enable Subtitles</div>
                              <div className="text-gray-400 text-sm">Show subtitles by default</div>
                            </div>
                            <button
                              onClick={() => dispatch(updatePlayback({ enableSubtitles: !settings.playback.enableSubtitles }))}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                settings.playback.enableSubtitles ? 'bg-purple-500' : 'bg-gray-600'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                settings.playback.enableSubtitles ? 'translate-x-6' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>

                          {settings.playback.enableSubtitles && (
                            <div className="mt-4">
                              <label className="block">
                                <span className="text-gray-300 text-sm mb-2 block">Subtitle Language</span>
                                <select
                                  value={settings.playback.subtitleLanguage}
                                  onChange={(e) => dispatch(updatePlayback({ subtitleLanguage: e.target.value }))}
                                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                >
                                  {languages.slice(0, 5).map((lang) => (
                                    <option key={lang.code} value={lang.code} className="bg-gray-800">
                                      {lang.name}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl">
                        <FiBell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Notification Preferences</h2>
                        <p className="text-gray-400">Choose how and when you want to be notified</p>
                      </div>
                    </div>

                    {/* Notification Categories */}
                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <FiStar className="w-5 h-5 text-yellow-400" />
                          <h3 className="text-xl font-semibold text-white">Email Notifications</h3>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">New Releases</div>
                                <div className="text-gray-400 text-sm">Get notified when new content is available</div>
                              </div>
                              <button
                                onClick={() => dispatch(updateNotifications({ newReleases: !settings.notifications.newReleases }))}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  settings.notifications.newReleases ? 'bg-yellow-500' : 'bg-gray-600'
                                }`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  settings.notifications.newReleases ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                              </button>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">Personalized Recommendations</div>
                                <div className="text-gray-400 text-sm">Receive weekly recommendation emails</div>
                              </div>
                              <button
                                onClick={() => dispatch(updateNotifications({ recommendations: !settings.notifications.recommendations }))}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  settings.notifications.recommendations ? 'bg-yellow-500' : 'bg-gray-600'
                                }`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  settings.notifications.recommendations ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <FiSmartphone className="w-5 h-5 text-orange-400" />
                          <h3 className="text-xl font-semibold text-white">Push Notifications</h3>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">Watch Party Invites</div>
                                <div className="text-gray-400 text-sm">Notifications for watch party invitations</div>
                              </div>
                              <button
                                onClick={() => dispatch(updateNotifications({ watchPartyInvites: !settings.notifications.watchPartyInvites }))}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  settings.notifications.watchPartyInvites ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  settings.notifications.watchPartyInvites ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                              </button>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">Social Activity</div>
                                <div className="text-gray-400 text-sm">Updates about friends' activity</div>
                              </div>
                              <button
                                onClick={() => dispatch(updateNotifications({ socialActivity: !settings.notifications.socialActivity }))}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  settings.notifications.socialActivity ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  settings.notifications.socialActivity ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Master Switches */}
                      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
                        <h3 className="text-xl font-semibold text-white mb-4">Master Controls</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">Email Notifications</div>
                                <div className="text-gray-400 text-sm">All email notifications</div>
                              </div>
                              <button
                                onClick={() => dispatch(updateNotifications({ emailNotifications: !settings.notifications.emailNotifications }))}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  settings.notifications.emailNotifications ? 'bg-yellow-500' : 'bg-gray-600'
                                }`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                              </button>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">Push Notifications</div>
                                <div className="text-gray-400 text-sm">All push notifications</div>
                              </div>
                              <button
                                onClick={() => dispatch(updateNotifications({ pushNotifications: !settings.notifications.pushNotifications }))}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  settings.notifications.pushNotifications ? 'bg-orange-500' : 'bg-gray-600'
                                }`}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>

                    <div className="space-y-4">
                      {/* Profile Visibility */}
                      <label className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                        <div>
                          <span className="text-white font-medium">Profile Visibility</span>
                          <p className="text-gray-400 text-sm">Who can see your profile</p>
                        </div>
                        <select
                          value={settings.privacy.profileVisibility}
                          onChange={(e) => dispatch(updatePrivacy({ profileVisibility: e.target.value as any }))}
                          className="bg-dark-100 border border-dark-200 rounded px-3 py-2 text-white"
                        >
                          <option value="public">Public</option>
                          <option value="friends">Friends Only</option>
                          <option value="private">Private</option>
                        </select>
                      </label>

                      {/* Show Watch History */}
                      <label className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                        <div>
                          <span className="text-white font-medium">Show Watch History</span>
                          <p className="text-gray-400 text-sm">Allow others to see your watch history</p>
                        </div>
                        <button
                          onClick={() => dispatch(updatePrivacy({ showWatchHistory: !settings.privacy.showWatchHistory }))}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.privacy.showWatchHistory ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.privacy.showWatchHistory ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>

                      {/* Data Collection */}
                      <label className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                        <div>
                          <span className="text-white font-medium">Data Collection</span>
                          <p className="text-gray-400 text-sm">Allow collection of viewing data for better recommendations</p>
                        </div>
                        <button
                          onClick={() => dispatch(updatePrivacy({ allowDataCollection: !settings.privacy.allowDataCollection }))}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.privacy.allowDataCollection ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.privacy.allowDataCollection ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>
                    </div>
                  </div>
                )}

                {/* Accessibility Settings */}
                {activeTab === 'accessibility' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Accessibility</h2>

                    <div className="space-y-4">
                      {Object.entries(settings.accessibility).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                          <div>
                            <span className="text-white font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            <p className="text-gray-400 text-sm">
                              {key === 'highContrast' && 'Increase contrast for better visibility'}
                              {key === 'largeText' && 'Use larger text size'}
                              {key === 'reduceMotion' && 'Reduce animations and transitions'}
                              {key === 'screenReader' && 'Optimize for screen readers'}
                              {key === 'keyboardNavigation' && 'Enable full keyboard navigation'}
                            </p>
                          </div>
                          <button
                            onClick={() => dispatch(updateAccessibility({ [key]: !value }))}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Downloads Settings */}
                {activeTab === 'downloads' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Download Preferences</h2>

                    <div className="space-y-4">
                      {/* Download Quality */}
                      <label className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                        <div>
                          <span className="text-white font-medium">Download Quality</span>
                          <p className="text-gray-400 text-sm">Quality for downloaded content</p>
                        </div>
                        <select
                          value={settings.downloads.downloadQuality}
                          onChange={(e) => dispatch(updateDownloads({ downloadQuality: e.target.value as any }))}
                          className="bg-dark-100 border border-dark-200 rounded px-3 py-2 text-white"
                        >
                          <option value="low">Low (480p)</option>
                          <option value="medium">Medium (720p)</option>
                          <option value="high">High (1080p)</option>
                        </select>
                      </label>

                      {/* WiFi Only */}
                      <label className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                        <div>
                          <span className="text-white font-medium">Download over Wi-Fi only</span>
                          <p className="text-gray-400 text-sm">Only download when connected to Wi-Fi</p>
                        </div>
                        <button
                          onClick={() => dispatch(updateDownloads({ downloadOverWifi: !settings.downloads.downloadOverWifi }))}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.downloads.downloadOverWifi ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.downloads.downloadOverWifi ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>

                      {/* Storage Limit */}
                      <label className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                        <div>
                          <span className="text-white font-medium">Storage Limit</span>
                          <p className="text-gray-400 text-sm">Maximum storage for downloads (GB)</p>
                        </div>
                        <input
                          type="number"
                          value={settings.downloads.storageLimit}
                          onChange={(e) => dispatch(updateDownloads({ storageLimit: parseInt(e.target.value) }))}
                          className="bg-dark-100 border border-dark-200 rounded px-3 py-2 text-white w-20"
                          min="1"
                          max="500"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Premium Reset Confirmation Modal */}
          {showResetConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mb-4">
                    <FiX className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Reset All Settings</h3>
                  <p className="text-gray-300 leading-relaxed">
                    This will restore all your preferences to their default values.
                    This action cannot be undone.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <FiX className="w-5 h-5 text-red-400" />
                    <div className="text-red-300 text-sm">
                      All your custom settings will be permanently lost
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    Keep Settings
                  </button>
                  <button
                    onClick={handleResetSettings}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-xl"
                  >
                    Reset Everything
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}