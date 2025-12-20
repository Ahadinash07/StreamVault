'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner and fill out the registration form with your email, password, and basic information. You can also sign up using your Google or social media accounts for faster access.'
        },
        {
          question: 'Is StreamVault free to use?',
          answer: 'StreamVault offers a free tier with limited content and features. For full access to our complete library, premium features like watch parties, and ad-free viewing, you\'ll need a subscription starting at $9.99/month.'
        },
        {
          question: 'What devices can I use to watch StreamVault?',
          answer: 'You can watch on web browsers, mobile devices (iOS/Android), smart TVs, streaming devices (Roku, Fire TV, Apple TV), and gaming consoles. Our app is available on all major platforms.'
        }
      ]
    },
    {
      category: 'Subscription & Billing',
      questions: [
        {
          question: 'How do I cancel my subscription?',
          answer: 'Go to your Account settings, click on "Subscription," and select "Cancel Subscription." Your access will continue until the end of your current billing period. You can reactivate anytime.'
        },
        {
          question: 'Can I change my subscription plan?',
          answer: 'Yes! You can upgrade or downgrade your plan at any time from your Account settings. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for new subscribers. Contact our support team within 30 days of your first payment for a full refund. Refunds for other circumstances are handled on a case-by-case basis.'
        }
      ]
    },
    {
      category: 'Streaming & Content',
      questions: [
        {
          question: 'How does the "Continue Watching" feature work?',
          answer: 'We automatically save your progress every 5 seconds. When you return to a movie or episode, you can resume exactly where you left off. Your progress is synced across all your devices.'
        },
        {
          question: 'What video quality options are available?',
          answer: 'We offer streaming in SD (480p), HD (1080p), and 4K Ultra HD (2160p) depending on your subscription plan and internet connection. The app automatically adjusts quality based on your bandwidth.'
        },
        {
          question: 'Can I download content for offline viewing?',
          answer: 'Yes, Premium subscribers can download select titles for offline viewing on mobile devices. Downloads are available for up to 30 days and can be watched within 7 days of download.'
        }
      ]
    },
    {
      category: 'Watch Parties',
      questions: [
        {
          question: 'How do I start a watch party?',
          answer: 'Click the "Watch Party" button on any movie or episode page. Create a party code and share it with friends. As the host, you control playback for all participants. Everyone needs a StreamVault account to join.'
        },
        {
          question: 'Can I join a watch party from anywhere?',
          answer: 'Yes! Participants can join from any location. The video stays synchronized, and you can chat with other viewers. Make sure everyone has a stable internet connection for the best experience.'
        },
        {
          question: 'Is there a limit to how many people can join a watch party?',
          answer: 'Free users can host parties with up to 5 participants. Premium subscribers can host parties with up to 20 participants. All participants need active accounts.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      questions: [
        {
          question: 'How do I create multiple profiles?',
          answer: 'Go to your Account settings and click "Add Profile." You can create up to 5 profiles per account, each with their own watch history, recommendations, and preferences. Perfect for families!'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email. You can also reset your password from your Account settings.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, go to Account settings > Profile > Edit Email. You\'ll need to verify the new email address. Your account data and preferences will remain unchanged.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'Why is my video buffering or not loading?',
          answer: 'Check your internet connection speed (we recommend 5 Mbps for HD, 25 Mbps for 4K). Try lowering the video quality, clearing your browser cache, or restarting your device. If issues persist, contact support.'
        },
        {
          question: 'How do I clear my watch history?',
          answer: 'Go to Account settings > Privacy > Clear Watch History. This will reset your recommendations and remove items from your "Continue Watching" list. This action cannot be undone.'
        },
        {
          question: 'The app is not working on my device. What should I do?',
          answer: 'Ensure your device meets our minimum requirements and that you have the latest app version. Try uninstalling and reinstalling the app. If problems continue, check our device compatibility page or contact support.'
        }
      ]
    }
  ]

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                Find answers to common questions about StreamVault. Can't find what you're looking for?
                Contact our support team.
              </p>

              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex
                      const isOpen = openItems.has(globalIndex)

                      return (
                        <div key={faqIndex} className="bg-dark-100 border border-dark-200 rounded-lg">
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-dark-200 transition-colors"
                          >
                            <span className="text-white font-medium pr-4">{faq.question}</span>
                            {isOpen ? (
                              <FiChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-6 pb-4">
                              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="mt-12 text-center">
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
                <p className="text-gray-300 mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
                  >
                    Contact Support
                  </a>
                  <a
                    href="mailto:support@streamvault.com"
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
                  >
                    Email Us
                  </a>
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