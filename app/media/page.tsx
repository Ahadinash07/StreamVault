'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiDownload, FiImage, FiVideo, FiFileText, FiExternalLink } from 'react-icons/fi'

export default function MediaPage() {
  const pressReleases = [
    {
      title: 'StreamVault Launches Revolutionary Watch Party Feature',
      date: 'December 15, 2024',
      summary: 'New synchronized viewing experience allows friends to watch together remotely with real-time controls.',
      link: '#'
    },
    {
      title: 'StreamVault Reaches 50 Million Users Worldwide',
      date: 'November 28, 2024',
      summary: 'Major milestone achieved as platform continues global expansion with localized content.',
      link: '#'
    },
    {
      title: 'AI-Powered Recommendations Transform User Experience',
      date: 'October 10, 2024',
      summary: 'Advanced machine learning algorithms deliver personalized content suggestions with 95% accuracy.',
      link: '#'
    },
    {
      title: 'StreamVault Partners with Major Studios for Exclusive Content',
      date: 'September 5, 2024',
      summary: 'New partnership agreements bring premium movies and series exclusively to StreamVault platform.',
      link: '#'
    }
  ]

  const mediaAssets = [
    {
      category: 'Logos',
      items: [
        { name: 'StreamVault Primary Logo (PNG)', format: 'PNG', size: '2.3 MB', download: '#' },
        { name: 'StreamVault Logo (SVG)', format: 'SVG', size: '45 KB', download: '#' },
        { name: 'StreamVault Icon (PNG)', format: 'PNG', size: '156 KB', download: '#' },
        { name: 'StreamVault Wordmark', format: 'PNG', size: '890 KB', download: '#' }
      ]
    },
    {
      category: 'Brand Guidelines',
      items: [
        { name: 'Brand Style Guide 2024', format: 'PDF', size: '12.4 MB', download: '#' },
        { name: 'Color Palette Guide', format: 'PDF', size: '2.1 MB', download: '#' },
        { name: 'Typography Guidelines', format: 'PDF', size: '8.7 MB', download: '#' }
      ]
    },
    {
      category: 'Product Images',
      items: [
        { name: 'Watch Party Feature Screenshots', format: 'ZIP', size: '45.2 MB', download: '#' },
        { name: 'Mobile App Screenshots', format: 'ZIP', size: '23.8 MB', download: '#' },
        { name: 'Platform Interface Gallery', format: 'ZIP', size: '67.1 MB', download: '#' }
      ]
    }
  ]

  const contactInfo = [
    {
      type: 'Press Inquiries',
      email: 'press@streamvault.com',
      phone: '+1 (555) 123-4567'
    },
    {
      type: 'Media Assets',
      email: 'assets@streamvault.com',
      phone: '+1 (555) 123-4568'
    },
    {
      type: 'Partnerships',
      email: 'partners@streamvault.com',
      phone: '+1 (555) 123-4569'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Media Center</h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Access press releases, brand assets, and media resources. For press inquiries,
                please contact our media relations team.
              </p>
            </div>

            {/* Press Releases */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Latest Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{release.title}</h3>
                        <p className="text-gray-300 mb-3">{release.summary}</p>
                        <p className="text-gray-400 text-sm">{release.date}</p>
                      </div>
                      <a
                        href={release.link}
                        className="ml-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        Read More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Assets */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Media Assets</h2>
              <div className="space-y-8">
                {mediaAssets.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-xl font-semibold text-white mb-4">{category.category}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="bg-dark-100 border border-dark-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{item.name}</h4>
                              <p className="text-gray-400 text-sm">{item.format} • {item.size}</p>
                            </div>
                          </div>
                          <a
                            href={item.download}
                            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <FiDownload className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Guidelines */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Brand Guidelines</h2>
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Logo Usage</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Maintain minimum clear space around logo</li>
                      <li>• Use approved color variations only</li>
                      <li>• Do not modify, stretch, or distort the logo</li>
                      <li>• Ensure adequate contrast with background</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Color Palette</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <span className="text-gray-300">Primary Blue (#2563eb)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded"></div>
                        <span className="text-gray-300">Accent Purple (#9333ea)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-800 rounded"></div>
                        <span className="text-gray-300">Dark Gray (#1f2937)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-white mb-3">{contact.type}</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>
                        <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300">
                          {contact.email}
                        </a>
                      </p>
                      <p className="text-sm">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Usage Guidelines</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Permitted Use</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Editorial coverage and news reporting</li>
                    <li>• Fair use in reviews and commentary</li>
                    <li>• Social media sharing with attribution</li>
                    <li>• Academic and research purposes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Prohibited Use</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Commercial use without permission</li>
                    <li>• Misrepresentation of StreamVault</li>
                    <li>• Use in competitive products/services</li>
                    <li>• Modification without approval</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Note:</strong> All media assets are provided for editorial use only.
                  Commercial use requires written permission from StreamVault's marketing team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}