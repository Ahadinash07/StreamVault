'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector } from '../../hooks'
import { selectCurrentPlan } from '../../features/subscription/subscriptionSlice'
import { FiCheck, FiDownload, FiPlay, FiStar, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const { subscription, transactions } = useAppSelector((state) => state.subscription)
  const currentPlan = useAppSelector(selectCurrentPlan)

  const latestTransaction = transactions[transactions.length - 1]

  useEffect(() => {
    // Redirect if no successful transaction
    if (!latestTransaction || latestTransaction.status !== 'completed') {
      router.push('/subscription')
    }
  }, [latestTransaction, router])

  if (!subscription || !currentPlan || !latestTransaction) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
                <FiCheck className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to {currentPlan.name}!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your subscription has been activated successfully. Enjoy unlimited entertainment!
              </p>
            </motion.div>

            {/* Plan Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-dark-100 rounded-2xl p-8 mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r flex items-center justify-center ${
                  currentPlan.id === 'free' ? 'from-gray-600 to-gray-800' :
                  currentPlan.id === 'basic' ? 'from-blue-600 to-blue-800' :
                  currentPlan.id === 'standard' ? 'from-purple-600 to-purple-800' :
                  'from-yellow-500 to-orange-600'
                }`}>
                  <span className="text-white font-bold text-2xl">
                    {currentPlan.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">{currentPlan.name} Plan</h3>
                  <p className="text-gray-300">{currentPlan.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{currentPlan.maxScreens}</div>
                  <div className="text-gray-400 text-sm">Screens</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{currentPlan.maxDownloads}</div>
                  <div className="text-gray-400 text-sm">Downloads</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {currentPlan.has4K && (
                  <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm">
                    4K Ultra HD
                  </span>
                )}
                {currentPlan.hasHDR && (
                  <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm">
                    HDR
                  </span>
                )}
                {!currentPlan.hasAds && (
                  <span className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
                    Ad-free
                  </span>
                )}
                {currentPlan.hasExclusiveContent && (
                  <span className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FiStar className="w-3 h-3" />
                    Exclusive
                  </span>
                )}
              </div>
            </motion.div>

            {/* Transaction Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-dark-100 rounded-2xl p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-300">Transaction ID</span>
                  <span className="text-white font-mono text-sm">{latestTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount Paid</span>
                  <span className="text-white font-semibold">${latestTransaction.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Payment Method</span>
                  <span className="text-white">
                    {latestTransaction.paymentMethod.type === 'card'
                      ? `${latestTransaction.paymentMethod.cardBrand} ****${latestTransaction.paymentMethod.last4}`
                      : latestTransaction.paymentMethod.type
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Date</span>
                  <span className="text-white">
                    {new Date(latestTransaction.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4"
            >
              <Link
                href="/discover"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300"
              >
                <FiPlay className="w-5 h-5" />
                Start Watching
                <FiArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/my-list"
                  className="inline-flex items-center justify-center gap-2 bg-dark-100 hover:bg-dark-200 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <FiDownload className="w-5 h-5" />
                  Create Watchlist
                </Link>
                <Link
                  href="/subscription/manage"
                  className="inline-flex items-center justify-center gap-2 bg-dark-100 hover:bg-dark-200 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <FiStar className="w-5 h-5" />
                  Manage Subscription
                </Link>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 bg-dark-100 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiPlay className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">Watch Anywhere</h4>
                  <p className="text-gray-400 text-sm">Stream on any device</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiDownload className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">Download Offline</h4>
                  <p className="text-gray-400 text-sm">Watch without internet</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">Exclusive Content</h4>
                  <p className="text-gray-400 text-sm">Premium shows & movies</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}