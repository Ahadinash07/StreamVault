'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">About StreamVault</h1>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 text-lg mb-6">
                StreamVault is a premium streaming platform that goes beyond traditional entertainment services.
                We're committed to delivering exceptional viewing experiences with cutting-edge features and
                unparalleled content quality.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                To revolutionize the way people consume entertainment by combining world-class content with
                innovative social features, AI-powered recommendations, and immersive viewing experiences.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">What Makes Us Different</h2>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• <strong>Watch Parties:</strong> Synchronized viewing with friends in real-time</li>
                <li>• <strong>AI Recommendations:</strong> Personalized content suggestions</li>
                <li>• <strong>Gamification:</strong> Achievement system and progress tracking</li>
                <li>• <strong>Mood Playlists:</strong> Curated collections for different moods</li>
                <li>• <strong>Social Features:</strong> Reviews, ratings, and community interaction</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Story</h2>
              <p className="text-gray-300 mb-6">
                Founded in 2024, StreamVault emerged from a simple idea: entertainment should be more than
                just watching—it should be an experience shared with others. Our team of passionate developers,
                designers, and entertainment experts came together to create a platform that combines the best
                of streaming technology with social connectivity.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
              <p className="text-gray-300">
                Have questions or feedback? We'd love to hear from you. Reach out to our team at{' '}
                <a href="mailto:hello@streamvault.com" className="text-blue-400 hover:text-blue-300">
                  hello@streamvault.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}