'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiGift, FiCreditCard, FiMail, FiDownload, FiCheck } from 'react-icons/fi'

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(25)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const giftCardAmounts = [10, 25, 50, 100]

  const handlePurchase = async () => {
    if (!recipientEmail || !senderName) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    // Simulate purchase process
    setTimeout(() => {
      alert('Gift card sent successfully!')
      setRecipientEmail('')
      setSenderName('')
      setMessage('')
      setIsProcessing(false)
    }, 2000)
  }

  const features = [
    {
      icon: FiGift,
      title: 'Instant Delivery',
      description: 'Gift cards are delivered instantly via email'
    },
    {
      icon: FiCreditCard,
      title: 'Easy Redemption',
      description: 'Simple code entry to redeem your gift'
    },
    {
      icon: FiDownload,
      title: 'Digital Format',
      description: 'No physical cards needed - completely digital'
    },
    {
      icon: FiCheck,
      title: 'No Expiration',
      description: 'Gift cards never expire, use anytime'
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Choose Amount',
      description: 'Select the gift card value you want to purchase'
    },
    {
      step: 2,
      title: 'Add Details',
      description: 'Enter recipient email and your message'
    },
    {
      step: 3,
      title: 'Complete Purchase',
      description: 'Pay securely and receive confirmation'
    },
    {
      step: 4,
      title: 'Instant Delivery',
      description: 'Recipient gets the gift card immediately'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">StreamVault Gift Cards</h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Give the gift of premium entertainment. StreamVault gift cards are the perfect way
                to share movies, series, and exclusive content with friends and family.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Gift Card Purchase */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Purchase a Gift Card</h2>
                <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  {/* Amount Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Select Amount</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {giftCardAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setSelectedAmount(amount)}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            selectedAmount === amount
                              ? 'border-blue-500 bg-blue-500/20 text-white'
                              : 'border-dark-200 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="text-2xl font-bold">${amount}</div>
                          <div className="text-sm">USD</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="recipient@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Personal Message (Optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="Add a personal message..."
                      />
                    </div>
                  </div>

                  {/* Purchase Summary */}
                  <div className="bg-dark-200 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Gift Card Value</span>
                      <span className="text-white font-semibold">${selectedAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total</span>
                      <span className="text-white font-bold text-xl">${selectedAmount}</span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiGift className="w-5 h-5" />
                        Send Gift Card
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Why Choose StreamVault Gift Cards?</h2>

                <div className="space-y-6 mb-8">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                          <p className="text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Preview */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Gift Card Preview</h3>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">${selectedAmount}</div>
                      <div className="text-sm opacity-90">StreamVault Gift Card</div>
                      <div className="text-xs opacity-75 mt-2">Valid for premium subscription</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gift Card Terms */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Gift Card Terms & Conditions</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-white font-semibold mb-2">Validity</h3>
                  <p>Gift cards do not expire and can be redeemed at any time.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Redemption</h3>
                  <p>Gift cards can be redeemed for StreamVault subscription plans and premium features.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Refunds</h3>
                  <p>Gift cards are non-refundable. Lost or stolen cards cannot be replaced.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Regional Restrictions</h3>
                  <p>Some content may not be available in all regions due to licensing restrictions.</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Customer Support</h3>
                  <p>For gift card support, contact us at <a href="mailto:giftcards@streamvault.com" className="text-blue-400 hover:text-blue-300">giftcards@streamvault.com</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}