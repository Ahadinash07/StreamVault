'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../hooks'
import { logout } from '../features/user/userSlice'
import { saveToLocalStorage } from '@/utils/localStorage'
import Link from 'next/link'
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi'

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { subscription } = useAppSelector((state) => state.subscription)

  const handleLogout = () => {
    dispatch(logout())
    saveToLocalStorage('user', null)
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-gray-400 text-lg mb-4">Please sign in to view your profile</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Account</h1>

          {/* Profile Info */}
          <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-200 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Favorites</p>
                <p className="text-2xl font-bold">{user.favorites?.length || 0}</p>
              </div>
              <div className="bg-dark-200 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Watchlist</p>
                <p className="text-2xl font-bold">{user.watchlist?.length || 0}</p>
              </div>
              <div className="bg-dark-200 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Watch History</p>
                <p className="text-2xl font-bold">{user.watchHistory?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          {subscription && (
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Subscription</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold capitalize">{subscription.planId} Plan</p>
                  <p className="text-gray-400 text-sm">
                    Started: {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href="/subscription"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="space-y-2">
            <Link
              href="/my-list"
              className="flex items-center space-x-3 p-4 bg-dark-100 border border-dark-200 rounded-lg hover:bg-dark-200 transition-colors"
            >
              <FiUser className="w-5 h-5" />
              <span>My List</span>
            </Link>
            <Link
              href="/subscription"
              className="flex items-center space-x-3 p-4 bg-dark-100 border border-dark-200 rounded-lg hover:bg-dark-200 transition-colors"
            >
              <FiSettings className="w-5 h-5" />
              <span>Subscription Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 bg-dark-100 border border-dark-200 rounded-lg hover:bg-dark-200 transition-colors text-left"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

