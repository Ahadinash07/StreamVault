'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppDispatch } from '../hooks'
import { login } from '../features/user/userSlice'
import { saveToLocalStorage } from '@/utils/localStorage'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login (in real app, this would be an API call)
    setTimeout(() => {
      const user = {
        id: '1',
        name: email.split('@')[0],
        email,
        watchHistory: [],
        favorites: [],
        watchlist: [],
        profiles: [
          {
            id: '1',
            name: email.split('@')[0],
            avatar: '',
            isKid: false,
          },
        ],
        currentProfile: '1',
      }

      dispatch(login(user))
      saveToLocalStorage('user', user)
      toast.success('Welcome back!')
      router.push('/')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md px-4">
          <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="mt-6 text-center text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
            <p className="mt-4 text-center text-sm text-gray-500">
              For demo purposes, any email/password combination will work
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

