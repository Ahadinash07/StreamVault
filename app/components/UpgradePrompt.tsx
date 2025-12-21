'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiStar, FiPlay, FiLock } from 'react-icons/fi'
import Link from 'next/link'
import { useAppDispatch } from '../hooks'
import { showUpgradePrompt } from '../features/subscription/subscriptionSlice'

interface UpgradePromptProps {
  isVisible: boolean
  onClose: () => void
  contentTitle?: string
  contentType?: 'movie' | 'series' | 'gaming'
}

export default function UpgradePrompt({
  isVisible,
  onClose,
  contentTitle = 'this content',
  contentType = 'movie'
}: UpgradePromptProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      dispatch(showUpgradePrompt(false))
      setIsClosing(false)
    }, 300)
  }

  const handleUpgrade = () => {
    handleClose()
    router.push('/subscription')
  }

  const getContentIcon = () => {
    switch (contentType) {
      case 'movie':
        return <FiPlay className="w-6 h-6" />
      case 'series':
        return <FiStar className="w-6 h-6" />
      case 'gaming':
        return <FiStar className="w-6 h-6" />
      default:
        return <FiLock className="w-6 h-6" />
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="bg-dark-100 rounded-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 pb-4">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    {getContentIcon()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Premium Content</h3>
                    <p className="text-gray-300 text-sm">Upgrade to unlock</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <div className="bg-dark-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FiLock className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">{contentTitle}</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    This {contentType} is only available to Premium subscribers.
                    Upgrade your plan to watch unlimited content in stunning quality.
                  </p>
                </div>

                {/* Plan Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-dark-200 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Free Plan</div>
                    <div className="text-2xl font-bold text-gray-500 line-through">$0</div>
                    <div className="text-xs text-gray-500">Limited content</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <div className="text-white text-sm mb-1">Premium</div>
                    <div className="text-2xl font-bold text-white">$17.99</div>
                    <div className="text-xs text-white/80">Unlimited access</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <FiStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">4K Ultra HD & HDR</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPlay className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Watch on 5 devices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiLock className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">No ads</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiStar className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Exclusive content</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FiStar className="w-5 h-5" />
                    Upgrade to Premium
                  </button>

                  <Link
                    href="/subscription"
                    onClick={handleClose}
                    className="block w-full text-center text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    View all plans
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}