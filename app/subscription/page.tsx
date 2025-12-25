'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../hooks'
import {
  setSelectedPlan,
  selectCurrentPlan,
  selectCanAccessContent
} from '../features/subscription/subscriptionSlice'
import { FiCheck, FiStar, FiZap, FiShield, FiDownload, FiMonitor, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function SubscriptionPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { subscription, plans, selectedPlan, loading } = useAppSelector((state) => state.subscription)
  const currentPlan = useAppSelector(selectCurrentPlan)
  const { isAuthenticated } = useAppSelector((state) => state.user)

  const handleSelectPlan = (planId: string) => {
    dispatch(setSelectedPlan(planId as any))
    if (planId === 'free') {
      // Free plan doesn't need payment
      router.push('/subscription/confirm?plan=free')
    } else {
      // Premium plans go to payment
      router.push(`/subscription/payment?plan=${planId}`)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <FiShield className="w-6 h-6" />
      case 'basic':
        return <FiZap className="w-6 h-6" />
      case 'standard':
        return <FiStar className="w-6 h-6" />
      case 'premium':
        return <FiMonitor className="w-6 h-6" />
      default:
        return <FiCheck className="w-6 h-6" />
    }
  }

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-gray-600 to-gray-800'
      case 'basic':
        return 'from-blue-600 to-blue-800'
      case 'standard':
        return 'from-purple-600 to-purple-800'
      case 'premium':
        return 'from-yellow-500 to-orange-600'
      default:
        return 'from-gray-600 to-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Unlock unlimited entertainment with StreamVault. Choose the perfect plan for you and your family.
              </p>

              {subscription && (
                <div className="inline-flex items-center gap-2 bg-dark-100 px-4 py-2 rounded-full">
                  <span className="text-gray-300">Current Plan:</span>
                  <span className="text-white font-semibold capitalize">{subscription.planId}</span>
                  <span className="text-green-400">Active</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-dark-100 rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'border-purple-500 shadow-lg shadow-purple-500/25' : 'border-dark-200'
                } ${
                  subscription?.planId === plan.id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {subscription?.planId === plan.id && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanGradient(plan.id)} mb-4`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-gray-400">/{plan.interval}</span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <FiCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 gap-4 mb-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{plan.maxScreens}</div>
                    <div className="text-xs text-gray-400">Screens</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{plan.maxDownloads}</div>
                    <div className="text-xs text-gray-400">Downloads</div>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  {plan.has4K && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCheck className="w-4 h-4 text-green-400" />
                      <span>4K Ultra HD</span>
                    </div>
                  )}
                  {plan.hasHDR && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCheck className="w-4 h-4 text-green-400" />
                      <span>HDR</span>
                    </div>
                  )}
                  {!plan.hasAds && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCheck className="w-4 h-4 text-green-400" />
                      <span>Ad-free</span>
                    </div>
                  )}
                  {plan.hasExclusiveContent && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      <span>Exclusive Content</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={subscription?.planId === plan.id || loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                      : subscription?.planId === plan.id
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {subscription?.planId === plan.id ? 'Current Plan' :
                   plan.id === 'free' ? 'Get Started' : 'Choose Plan'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-100 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Can I change my plan anytime?</h3>
                <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">How many devices can I use?</h3>
                <p className="text-gray-300">Device limits vary by plan. You can manage your devices in your account settings.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Can I download content?</h3>
                <p className="text-gray-300">Download availability depends on your plan. Premium plans allow downloads on multiple devices.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Is there a free trial?</h3>
                <p className="text-gray-300">New users get a 7-day free trial of our Premium plan. No credit card required.</p>
              </div>
            </div>
          </motion.div>

          {/* Current Plan Management */}
          {subscription && subscription.planId !== 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 bg-dark-100 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Manage Your Subscription</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/subscription/manage"
                  className="bg-dark-200 hover:bg-dark-300 p-6 rounded-xl transition-colors"
                >
                  <FiMonitor className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Manage Plan</h3>
                  <p className="text-gray-300">Change plans, update payment method</p>
                </Link>
                <Link
                  href="/subscription/billing"
                  className="bg-dark-200 hover:bg-dark-300 p-6 rounded-xl transition-colors"
                >
                  <FiShield className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Billing History</h3>
                  <p className="text-gray-300">View invoices and payment history</p>
                </Link>
                <Link
                  href="/subscription/cancel"
                  className="bg-dark-200 hover:bg-dark-300 p-6 rounded-xl transition-colors"
                >
                  <FiX className="w-8 h-8 text-red-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Cancel Subscription</h3>
                  <p className="text-gray-300">Pause or cancel your subscription</p>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

