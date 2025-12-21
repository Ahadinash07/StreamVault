'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppSelector, useAppDispatch } from '../../hooks'
import {
  initiatePayment,
  processPayment,
  completePayment,
  failPayment,
  addPaymentMethod,
  selectCurrentPlan
} from '../../features/subscription/subscriptionSlice'
import {
  FiCreditCard,
  FiLock,
  FiShield,
  FiCheck,
  FiX,
  FiLoader,
  FiArrowLeft
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'

type PaymentMethod = 'card' | 'paypal' | 'bank'

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { plans, paymentMethods, currentPayment, loading, error } = useAppSelector((state) => state.subscription)
  const selectedPlan = useAppSelector(selectCurrentPlan)

  const planId = searchParams.get('plan') as string
  const plan = plans.find(p => p.id === planId)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  const [billingAddress, setBillingAddress] = useState({
    country: 'US',
    zipCode: ''
  })
  const [saveCard, setSaveCard] = useState(true)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    if (!plan) {
      router.push('/subscription')
    }
  }, [plan, router])

  const handleCardInput = (field: string, value: string) => {
    if (field === 'number') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      setCardDetails(prev => ({ ...prev, [field]: formatted }))
    } else if (field === 'expiry') {
      // Format expiry as MM/YY
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
      setCardDetails(prev => ({ ...prev, [field]: formatted }))
    } else {
      setCardDetails(prev => ({ ...prev, [field]: value }))
    }
  }

  const validateCardDetails = () => {
    const { number, expiry, cvc, name } = cardDetails
    const cardNumber = number.replace(/\s/g, '')

    if (!name.trim()) return false
    if (cardNumber.length < 13 || cardNumber.length > 19) return false
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false
    if (cvc.length < 3 || cvc.length > 4) return false

    return true
  }

  const handlePayment = async () => {
    if (!plan || !agreeToTerms) return

    if (paymentMethod === 'card' && !validateCardDetails()) {
      dispatch(failPayment('Please fill in all card details correctly'))
      return
    }

    // Create payment method object
    const paymentMethodData = paymentMethod === 'card' ? {
      id: `pm_${Date.now()}`,
      type: 'card' as const,
      last4: cardDetails.number.slice(-4),
      expiryMonth: parseInt(cardDetails.expiry.split('/')[0]),
      expiryYear: 2000 + parseInt(cardDetails.expiry.split('/')[1]),
      cardBrand: getCardBrand(cardDetails.number),
      isDefault: saveCard
    } : {
      id: `pm_${Date.now()}`,
      type: paymentMethod as any,
      email: 'user@example.com',
      isDefault: true
    }

    // Initiate payment
    dispatch(initiatePayment({
      planId: plan.id as any,
      paymentMethod: paymentMethodData
    }))

    // Simulate payment processing
    setTimeout(() => {
      dispatch(processPayment())

      // Simulate payment completion (90% success rate)
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // Success
          const transaction = {
            id: `txn_${Date.now()}`,
            amount: plan.price,
            currency: plan.currency,
            status: 'completed' as const,
            plan: plan.id as any,
            paymentMethod: paymentMethodData,
            timestamp: new Date().toISOString(),
            description: `${plan.name} subscription`,
            invoiceUrl: `/invoice/${Date.now()}`
          }

          dispatch(completePayment({ transaction }))

          if (saveCard && paymentMethod === 'card') {
            dispatch(addPaymentMethod(paymentMethodData))
          }

          router.push('/subscription/success')
        } else {
          // Failure
          dispatch(failPayment('Payment failed. Please try again or use a different payment method.'))
        }
      }, 2000)
    }, 1000)
  }

  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '')
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard'
    if (number.startsWith('3')) return 'American Express'
    return 'Unknown'
  }

  if (!plan) {
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to Plans
              </Link>
              <h1 className="text-4xl font-bold text-white mb-2">Complete Your Purchase</h1>
              <p className="text-gray-300">Secure payment for your Aurora Play subscription</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Payment Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Payment Method Selection */}
                <div className="bg-dark-100 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

                  <div className="space-y-4">
                    <label className="flex items-center gap-4 p-4 border border-dark-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="text-blue-500"
                      />
                      <FiCreditCard className="w-6 h-6 text-blue-400" />
                      <span className="text-white font-medium">Credit / Debit Card</span>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-dark-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors opacity-50 cursor-not-allowed">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        disabled
                        className="text-blue-500"
                      />
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <span className="text-gray-400">PayPal (Coming Soon)</span>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-dark-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors opacity-50 cursor-not-allowed">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        disabled
                        className="text-blue-500"
                      />
                      <FiShield className="w-6 h-6 text-green-400" />
                      <span className="text-gray-400">Bank Transfer (Coming Soon)</span>
                    </label>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-100 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Card Details</h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => handleCardInput('number', e.target.value)}
                          className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => handleCardInput('expiry', e.target.value)}
                            className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvc}
                            onChange={(e) => handleCardInput('cvc', e.target.value)}
                            className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => handleCardInput('name', e.target.value)}
                          className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Billing ZIP Code
                        </label>
                        <input
                          type="text"
                          placeholder="12345"
                          value={billingAddress.zipCode}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="text-blue-500"
                        />
                        <span className="text-gray-300 text-sm">Save this card for future payments</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Terms and Conditions */}
                <div className="bg-dark-100 rounded-2xl p-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 text-blue-500"
                    />
                    <span className="text-gray-300 text-sm">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FiX className="w-5 h-5 text-red-400" />
                      <span className="text-red-300">{error}</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-dark-100 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-dark-200 rounded-lg">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center ${
                        plan.id === 'free' ? 'from-gray-600 to-gray-800' :
                        plan.id === 'basic' ? 'from-blue-600 to-blue-800' :
                        plan.id === 'standard' ? 'from-purple-600 to-purple-800' :
                        'from-yellow-500 to-orange-600'
                      }`}>
                        <span className="text-white font-bold text-lg">
                          {plan.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{plan.name}</h3>
                        <p className="text-gray-400 text-sm">{plan.description}</p>
                      </div>
                    </div>

                    <div className="border-t border-dark-200 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="text-white font-semibold">${plan.price}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300">Tax</span>
                        <span className="text-white font-semibold">$0.00</span>
                      </div>
                      <div className="border-t border-dark-200 pt-4 flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total</span>
                        <span className="text-white font-bold text-2xl">${plan.price}</span>
                      </div>
                    </div>

                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <FiShield className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-green-300 font-medium">Secure Payment</p>
                          <p className="text-green-400 text-sm">SSL encrypted • PCI compliant</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={loading || !agreeToTerms || (paymentMethod === 'card' && !validateCardDetails())}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <FiLoader className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiLock className="w-5 h-5" />
                          Pay ${plan.price}
                        </>
                      )}
                    </button>

                    <p className="text-gray-400 text-sm text-center">
                      You can cancel anytime. 30-day money-back guarantee.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  )
}