'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setShowSuggestions, setQuery } from '@/app/features/search/searchSlice'
import { logout } from '@/app/features/user/userSlice'
import { saveToLocalStorage } from '@/utils/localStorage'
import ThemeToggle from './ThemeToggle'

// Dynamically import icons with SSR disabled to prevent hydration mismatches
const FiSearch = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiSearch })), { ssr: false })
const FiBell = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiBell })), { ssr: false })
const FiMenu = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiMenu })), { ssr: false })
const FiX = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiX })), { ssr: false })
const FiUser = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiUser })), { ssr: false })
const FiHome = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiHome })), { ssr: false })
const FiFilm = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiFilm })), { ssr: false })
const FiTv = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiTv })), { ssr: false })
const FiList = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiList })), { ssr: false })
const FiLogOut = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiLogOut })), { ssr: false })
const FiSettings = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiSettings })), { ssr: false })
const FiPlay = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiPlay })), { ssr: false })
const FiCompass = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiCompass })), { ssr: false })
const FiGamepad2 = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiPlay })), { ssr: false })
const FiClock = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiClock })), { ssr: false })
const FiUsers = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiUsers })), { ssr: false })
const FiMoreVertical = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiMoreVertical })), { ssr: false })

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  const { query } = useAppSelector((state) => state.search)
  const { unreadCount } = useAppSelector((state) => state.notifications)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMoreMenuOpen && !(event.target as Element).closest('.more-menu')) {
        setIsMoreMenuOpen(false)
      }
      if (isProfileMenuOpen && !(event.target as Element).closest('.profile-menu')) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMoreMenuOpen, isProfileMenuOpen])

  const handleLogout = () => {
    dispatch(logout())
    saveToLocalStorage('user', null)
    setIsProfileMenuOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/discover', label: 'Discover', icon: FiCompass },
    { href: '/movies', label: 'Movies', icon: FiFilm },
    { href: '/series', label: 'Series', icon: FiTv },
    { href: '/gaming', label: 'Gaming', icon: FiGamepad2 },
    { href: '/my-list', label: 'My List', icon: FiList },
  ]

  const moreLinks = [
    { href: '/reels', label: 'Reels', icon: FiPlay },
    { href: '/perfect-for-right-now', label: 'Perfect for Right Now', icon: FiClock },
    { href: '/watch-party', label: 'Watch Party', icon: FiUsers },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              StreamVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-md transition-colors text-sm ${
                    isActive
                      ? 'text-blue-400 font-semibold bg-blue-400/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
            
            {/* More Menu */}
            <div className="relative more-menu">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="flex items-center space-x-1 px-2 py-2 rounded-md transition-colors text-sm text-gray-300 hover:text-white hover:bg-white/5"
              >
                <FiMoreVertical className="w-4 h-4" />
                <span>More</span>
              </button>
              
              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-56 bg-dark-100 rounded-lg shadow-xl border border-dark-200 overflow-hidden z-50"
                  >
                    {moreLinks.map((link) => {
                      const Icon = link.icon
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMoreMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-dark-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Link
              href="/search"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => dispatch(setShowSuggestions(true))}
            >
              <FiSearch className="w-5 h-5 md:w-6 md:h-6" />
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <Link
                href="/notifications"
                className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
              >
                <FiBell className="w-5 h-5 md:w-6 md:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile Menu */}
            {isAuthenticated ? (
              <div className="relative profile-menu">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-100 rounded-lg shadow-xl border border-dark-200 overflow-hidden"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-dark-200 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-dark-200 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/subscription"
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-dark-200 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <span>Subscription</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-dark-200 transition-colors w-full text-left"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-md border-t border-dark-200"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              
              {/* More Links Section */}
              <div className="pt-2 border-t border-dark-200 mt-4">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  More
                </div>
                {moreLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

