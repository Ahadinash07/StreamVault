'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../hooks'
import { updatePlan } from '../features/subscription/subscriptionSlice'
import { FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { saveToLocalStorage } from '@/utils/localStorage'

export default function SubscriptionPage() {
  const dispatch = useAppDispatch()
  const { subscription } = useAppSelector((state) => state.subscription)
  const { isAuthenticated } = useAppSelector((state) => state.user)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      features: [
        'Limited content access',
        'Standard quality',
        'Single device',
        'Ads included',
      ],
      popular: false,
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      period: 'month',
      features: [
        'Full content library',
        'HD quality',
        'Single device',
        'No ads',
        'Download for offline',
      ],
      popular: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 15.99,
      period: 'month',
      features: [
        'Full content library',
        'Full HD quality',
        '2 devices simultaneously',
        'No ads',
        'Download for offline',
        'Priority support',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      period: 'month',
      features: [
        'Full content library',
        '4K Ultra HD quality',
        '4 devices simultaneously',
        'No ads',
        'Download for offline',
        'Priority support',
        'Early access to new releases',
        'Exclusive content',
      ],
      popular: false,
    },
  ]

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe')
      return
    }
    dispatch(updatePlan(planId as any))
    const newSubscription = {
      plan: planId,
      startDate: new Date().toISOString(),
      endDate: null,
      isActive: true,
      autoRenew: true,
    }
    saveToLocalStorage('subscription', newSubscription)
    toast.success(`Successfully subscribed to ${planId} plan!`)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Select the perfect plan for your entertainment needs. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-dark-100 border-2 rounded-lg p-6 ${
                  plan.popular
                    ? 'border-blue-500 scale-105'
                    : 'border-dark-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-md font-semibold transition-colors ${
                    plan.id === subscription?.plan
                      ? 'bg-gray-600 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-dark-200 hover:bg-dark-300'
                  }`}
                  disabled={plan.id === subscription?.plan}
                >
                  {plan.id === subscription?.plan ? 'Current Plan' : 'Select Plan'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Current Plan Info */}
          {subscription && (
            <div className="mt-12 max-w-2xl mx-auto p-6 bg-dark-100 rounded-lg border border-dark-200">
              <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold capitalize">{subscription.plan} Plan</p>
                  <p className="text-gray-400 text-sm">
                    Started: {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                  {subscription.autoRenew ? (
                    <p className="text-green-400 text-sm mt-1">Auto-renewal enabled</p>
                  ) : (
                    <p className="text-yellow-400 text-sm mt-1">
                      Expires: {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  )}
                </div>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                  Cancel Subscription
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

