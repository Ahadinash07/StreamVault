'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiUser, FiSettings, FiCreditCard, FiShield, FiHelpCircle } from 'react-icons/fi'

export default function AccountPage() {
  const accountSections = [
    {
      icon: FiUser,
      title: 'Profile Management',
      description: 'Manage your personal information, profile picture, and account preferences.',
      features: [
        'Update personal details (name, email, phone)',
        'Change profile picture and avatar',
        'Manage multiple profiles for family members',
        'Set content preferences and ratings',
        'Configure language and region settings'
      ]
    },
    {
      icon: FiCreditCard,
      title: 'Subscription & Billing',
      description: 'View your current plan, manage payments, and handle billing information.',
      features: [
        'View current subscription plan and benefits',
        'Update payment methods and billing information',
        'View billing history and download invoices',
        'Change or cancel subscription plans',
        'Manage auto-renewal settings'
      ]
    },
    {
      icon: FiSettings,
      title: 'Playback Settings',
      description: 'Customize your viewing experience and device preferences.',
      features: [
        'Set default video quality and playback speed',
        'Configure subtitle and audio language preferences',
        'Manage parental controls and content restrictions',
        'Set up device limits and remote access',
        'Configure data usage and download settings'
      ]
    },
    {
      icon: FiShield,
      title: 'Privacy & Security',
      description: 'Control your privacy settings and account security features.',
      features: [
        'Manage privacy settings for watch history',
        'Control who can see your activity',
        'Set up two-factor authentication',
        'View and manage connected devices',
        'Download or delete your account data'
      ]
    }
  ]

  const quickActions = [
    {
      title: 'Reset Password',
      description: 'Change your account password for better security.',
      action: 'Go to Settings > Security'
    },
    {
      title: 'Download Data',
      description: 'Get a copy of all your account data and activity.',
      action: 'Settings > Privacy > Download Data'
    },
    {
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data.',
      action: 'Settings > Account > Delete Account'
    },
    {
      title: 'Link Social Accounts',
      description: 'Connect your social media accounts for easier login.',
      action: 'Settings > Connected Accounts'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Account Help</h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Manage your StreamVault account settings, preferences, and security options.
                Find everything you need to customize your viewing experience.
              </p>
            </div>

            {/* Account Sections */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {accountSections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                        <p className="text-gray-300 text-sm">{section.description}</p>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {section.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-gray-300 text-sm">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{action.description}</p>
                    <p className="text-blue-400 text-sm font-medium">{action.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Account Overview</h2>
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">127</div>
                    <div className="text-gray-300 text-sm">Movies Watched</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">45</div>
                    <div className="text-gray-300 text-sm">Series Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">23</div>
                    <div className="text-gray-300 text-sm">Hours This Month</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">89</div>
                    <div className="text-gray-300 text-sm">Achievements Unlocked</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Common Issues</h2>
              <div className="space-y-4">
                <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Can't access your account?</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    If you're having trouble logging in, try resetting your password or check if your account is locked.
                  </p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Reset Password →
                  </button>
                </div>

                <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Billing issues?</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Having problems with payments or subscriptions? Check your billing history or update payment methods.
                  </p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Billing Support →
                  </button>
                </div>

                <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy concerns?</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Worried about your data? Review your privacy settings and download your account information.
                  </p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Privacy Settings →
                  </button>
                </div>
              </div>
            </div>

            {/* Support Contact */}
            <div className="text-center">
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
                <FiHelpCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
                <p className="text-gray-300 mb-6">
                  Our support team is available 24/7 to help with any account-related questions or issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
                  >
                    Contact Support
                  </a>
                  <a
                    href="mailto:account@streamvault.com"
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
                  >
                    Email Account Team
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