'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiSettings, FiCheck, FiX } from 'react-icons/fi'

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always true, cannot be disabled
    performance: true,
    functional: true,
    marketing: false,
  })

  const handleSettingChange = (setting: keyof typeof cookieSettings, value: boolean) => {
    if (setting === 'essential') return // Essential cookies cannot be disabled
    setCookieSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const saveSettings = () => {
    // In a real app, this would save to localStorage or send to server
    localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings))
    alert('Cookie preferences saved!')
  }

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      purpose: 'Enable core functionality like security, network management, and accessibility.',
      examples: 'Authentication cookies, security tokens, load balancing',
      required: true,
    },
    {
      key: 'performance' as const,
      title: 'Performance Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      purpose: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: 'Google Analytics, page load times, error tracking',
      required: false,
    },
    {
      key: 'functional' as const,
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization.',
      purpose: 'Remember choices you make and provide enhanced features.',
      examples: 'Language preferences, theme settings, watch progress',
      required: false,
    },
    {
      key: 'marketing' as const,
      title: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display ads that are relevant and engaging for individual users.',
      purpose: 'Deliver personalized advertisements and measure campaign effectiveness.',
      examples: 'Targeted ads, retargeting, conversion tracking',
      required: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cookie Preferences</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                We use cookies to enhance your experience on StreamVault. You can manage your cookie
                preferences below. Essential cookies cannot be disabled as they are required for the
                website to function properly.
              </p>
            </div>

            {/* Cookie Settings */}
            <div className="space-y-6 mb-8">
              {cookieTypes.map((cookieType) => (
                <div key={cookieType.key} className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{cookieType.title}</h3>
                      <p className="text-gray-300 mb-3">{cookieType.description}</p>

                      <div className="space-y-2 text-sm">
                        <p className="text-gray-400">
                          <strong>Purpose:</strong> {cookieType.purpose}
                        </p>
                        <p className="text-gray-400">
                          <strong>Examples:</strong> {cookieType.examples}
                        </p>
                      </div>
                    </div>

                    <div className="ml-6">
                      {cookieType.required ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <FiCheck className="w-5 h-5" />
                          <span className="text-sm font-medium">Required</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSettingChange(cookieType.key, !cookieSettings[cookieType.key])}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            cookieSettings[cookieType.key] ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              cookieSettings[cookieType.key] ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${
                      cookieSettings[cookieType.key] ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className={cookieSettings[cookieType.key] ? 'text-green-400' : 'text-red-400'}>
                      {cookieSettings[cookieType.key] ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Settings */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Save Your Preferences</h3>
                  <p className="text-gray-300">
                    Your cookie preferences will be saved and applied across all your devices.
                  </p>
                </div>
                <button
                  onClick={saveSettings}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold flex items-center gap-2"
                >
                  <FiSettings className="w-5 h-5" />
                  Save Settings
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
                <p className="text-gray-300 mb-4">
                  Cookies are small text files that are stored on your device when you visit our website.
                  They help us provide you with a better browsing experience by remembering your preferences
                  and understanding how you use our service.
                </p>
                <p className="text-gray-300">
                  Cookies can be categorized into different types based on their purpose and functionality.
                  Some cookies are essential for our website to work properly, while others help us improve
                  your experience and show you relevant content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
                <p className="text-gray-300 mb-4">
                  We may also use third-party cookies from trusted partners to help us analyze website usage,
                  deliver personalized content, and show relevant advertisements. These partners include:
                </p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• Google Analytics (website analytics)</li>
                  <li>• Social media platforms (social sharing)</li>
                  <li>• Advertising networks (targeted advertising)</li>
                  <li>• Content delivery networks (faster loading)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies in Your Browser</h2>
                <p className="text-gray-300 mb-4">
                  You can also control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                  <li>• View what cookies are stored on your device</li>
                  <li>• Delete all cookies or specific cookies</li>
                  <li>• Block cookies from specific websites</li>
                  <li>• Block all cookies from being placed</li>
                  <li>• Clear cookies when you close your browser</li>
                </ul>
                <p className="text-gray-300">
                  Please note that disabling certain cookies may affect the functionality of our website
                  and your ability to access some features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us at{' '}
                  <a href="mailto:privacy@streamvault.com" className="text-blue-400 hover:text-blue-300">
                    privacy@streamvault.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}