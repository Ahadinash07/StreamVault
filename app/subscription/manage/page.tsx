'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../../hooks'
import {
  cancelSubscription,
  reactivateSubscription,
  updateSubscriptionPlan,
  removePaymentMethod,
  setDefaultPaymentMethod,
  selectCurrentPlan
} from '../../features/subscription/subscriptionSlice'
import {
  FiSettings,
  FiCreditCard,
  FiCalendar,
  FiX,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiDownload,
  FiMonitor,
  FiStar
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ManageSubscriptionPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { subscription, plans, paymentMethods, transactions } = useAppSelector((state) => state.subscription)
  const currentPlan = useAppSelector(selectCurrentPlan)

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null)

  if (!subscription || !currentPlan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const handleCancelSubscription = () => {
    dispatch(cancelSubscription())
    setShowCancelConfirm(false)
  }

  const handleReactivateSubscription = () => {
    dispatch(reactivateSubscription())
  }

  const handleChangePlan = (newPlanId: string) => {
    if (newPlanId === 'free') {
      // Downgrade to free
      dispatch(updateSubscriptionPlan('free'))
      router.push('/subscription/success')
    } else {
      // Upgrade to paid plan
      setSelectedNewPlan(newPlanId)
      router.push(`/subscription/payment?plan=${newPlanId}`)
    }
  }

  const handleRemovePaymentMethod = (methodId: string) => {
    dispatch(removePaymentMethod(methodId))
  }

  const handleSetDefaultPaymentMethod = (methodId: string) => {
    dispatch(setDefaultPaymentMethod(methodId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <FiShield className="w-6 h-6" />
      case 'basic':
        return <FiMonitor className="w-6 h-6" />
      case 'standard':
        return <FiStar className="w-6 h-6" />
      case 'premium':
        return <FiDownload className="w-6 h-6" />
      default:
        return <FiCheck className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Manage Subscription</h1>
              <p className="text-gray-300">Control your Aurora Play subscription and billing</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 space-y-6"
              >
                <div className="bg-dark-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Current Plan</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subscription.status === 'active'
                        ? 'bg-green-900/50 text-green-300'
                        : subscription.cancelAtPeriodEnd
                        ? 'bg-yellow-900/50 text-yellow-300'
                        : 'bg-red-900/50 text-red-300'
                    }`}>
                      {subscription.status === 'active'
                        ? 'Active'
                        : subscription.cancelAtPeriodEnd
                        ? 'Cancelling'
                        : 'Inactive'
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r flex items-center justify-center ${
                      currentPlan.id === 'free' ? 'from-gray-600 to-gray-800' :
                      currentPlan.id === 'basic' ? 'from-blue-600 to-blue-800' :
                      currentPlan.id === 'standard' ? 'from-purple-600 to-purple-800' :
                      'from-yellow-500 to-orange-600'
                    }`}>
                      {getPlanIcon(currentPlan.id)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentPlan.name}</h3>
                      <p className="text-gray-300">{currentPlan.description}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        ${currentPlan.price}/{currentPlan.interval} • {currentPlan.maxScreens} screens
                      </p>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Billing Info */}
                  <div className="border-t border-dark-200 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Next billing date</p>
                        <p className="text-white font-semibold">
                          {subscription.currentPeriodEnd
                            ? formatDate(subscription.currentPeriodEnd)
                            : 'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Payment method</p>
                        <p className="text-white font-semibold">
                          {subscription.paymentMethod
                            ? subscription.paymentMethod.type === 'card'
                              ? `${subscription.paymentMethod.cardBrand} ****${subscription.paymentMethod.last4}`
                              : subscription.paymentMethod.type
                            : 'None'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change Plan */}
                <div className="bg-dark-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Change Plan</h3>
                  <div className="space-y-4">
                    {plans.filter(plan => plan.id !== subscription.planId).map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-4 border border-dark-200 rounded-lg hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center ${
                            plan.id === 'free' ? 'from-gray-600 to-gray-800' :
                            plan.id === 'basic' ? 'from-blue-600 to-blue-800' :
                            plan.id === 'standard' ? 'from-purple-600 to-purple-800' :
                            'from-yellow-500 to-orange-600'
                          }`}>
                            {getPlanIcon(plan.id)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{plan.name}</h4>
                            <p className="text-gray-400 text-sm">
                              ${plan.price}/{plan.interval} • {plan.maxScreens} screens
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleChangePlan(plan.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            plan.price > currentPlan.price
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : plan.price < currentPlan.price
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-600 hover:bg-gray-700 text-white'
                          }`}
                        >
                          {plan.price > currentPlan.price ? 'Upgrade' :
                           plan.price < currentPlan.price ? 'Downgrade' : 'Switch'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Payment Methods */}
                <div className="bg-dark-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Payment Methods</h3>
                    <Link
                      href="/subscription/payment/add"
                      className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                    >
                      Add New
                    </Link>
                  </div>

                  {paymentMethods.length > 0 ? (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-3 bg-dark-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FiCreditCard className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-white text-sm">
                                {method.type === 'card'
                                  ? `${method.cardBrand} ****${method.last4}`
                                  : method.type
                                }
                              </p>
                              {method.isDefault && (
                                <span className="text-green-400 text-xs">Default</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!method.isDefault && (
                              <button
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                className="text-gray-400 hover:text-green-400 text-sm"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiCreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No payment methods saved</p>
                      <Link
                        href="/subscription/payment/add"
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Add Payment Method
                      </Link>
                    </div>
                  )}
                </div>

                {/* Subscription Actions */}
                <div className="bg-dark-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Subscription Actions</h3>

                  {subscription.cancelAtPeriodEnd ? (
                    <div className="space-y-4">
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                        <p className="text-yellow-300 text-sm">
                          Your subscription will end on {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={handleReactivateSubscription}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Reactivate Subscription
                      </button>
                    </div>
                  ) : subscription.planId !== 'free' ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Cancel Subscription
                      </button>
                      <Link
                        href="/subscription/billing"
                        className="block w-full bg-dark-200 hover:bg-dark-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                      >
                        View Billing History
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm mb-4">Upgrade to unlock premium features</p>
                      <Link
                        href="/subscription"
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        View Plans
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-dark-100 rounded-2xl p-6 max-w-md w-full"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Cancel Subscription?</h3>
                  <p className="text-gray-300 mb-6">
                    Your subscription will remain active until {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'the end of your billing period'}.
                    You'll still have access to all features until then.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 bg-dark-200 hover:bg-dark-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Keep Subscription
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}