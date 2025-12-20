'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiMapPin, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi'

export default function CorporatePage() {
  const executives = [
    {
      name: 'Sarah Johnson',
      title: 'Chief Executive Officer',
      bio: 'Sarah has over 15 years of experience in the entertainment industry, previously serving as VP of Digital Media at major studios.',
      image: 'https://picsum.photos/seed/sarah/200/200'
    },
    {
      name: 'Michael Chen',
      title: 'Chief Technology Officer',
      bio: 'Michael leads our engineering team with expertise in streaming technology and AI systems, having built platforms serving millions of users.',
      image: 'https://picsum.photos/seed/michael/200/200'
    },
    {
      name: 'Emily Rodriguez',
      title: 'Chief Content Officer',
      bio: 'Emily oversees content acquisition and original programming, bringing a wealth of experience from traditional and digital media companies.',
      image: 'https://picsum.photos/seed/emily/200/200'
    },
    {
      name: 'David Kim',
      title: 'Chief Financial Officer',
      bio: 'David manages financial operations and investor relations, with a background in financial services and entertainment finance.',
      image: 'https://picsum.photos/seed/david/200/200'
    }
  ]

  const offices = [
    {
      city: 'Los Angeles, CA',
      address: '123 Entertainment Avenue, Los Angeles, CA 90210',
      type: 'Headquarters',
      employees: '500+'
    },
    {
      city: 'New York, NY',
      address: '456 Broadway, New York, NY 10012',
      type: 'Content Hub',
      employees: '150+'
    },
    {
      city: 'San Francisco, CA',
      address: '789 Tech Boulevard, San Francisco, CA 94105',
      type: 'Engineering',
      employees: '200+'
    },
    {
      city: 'London, UK',
      address: '321 Media Street, London EC2A 4DP',
      type: 'International',
      employees: '80+'
    }
  ]

  const milestones = [
    { year: '2020', event: 'Company founded with seed funding' },
    { year: '2021', event: 'Launched beta platform with 10,000 users' },
    { year: '2022', event: 'Series A funding, expanded to 1M users' },
    { year: '2023', event: 'Global expansion, reached 25M users' },
    { year: '2024', event: 'IPO and continued growth to 50M+ users' }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Corporate Information</h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                StreamVault is a leading entertainment technology company revolutionizing how people
                consume and share digital media worldwide.
              </p>
            </div>

            {/* Company Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Company Overview</h2>
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Our Mission</h3>
                    <p className="text-gray-300 mb-6">
                      To democratize entertainment by providing unparalleled access to premium content
                      through innovative technology and social experiences.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">Our Vision</h3>
                    <p className="text-gray-300">
                      To become the world's most loved entertainment platform, connecting millions
                      through shared viewing experiences and personalized content discovery.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Key Facts</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FiUsers className="w-6 h-6 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">50M+ Active Users</p>
                          <p className="text-gray-400 text-sm">Across 180+ countries</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiAward className="w-6 h-6 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">25+ Industry Awards</p>
                          <p className="text-gray-400 text-sm">Innovation and excellence</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiTrendingUp className="w-6 h-6 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">$2.4B Market Cap</p>
                          <p className="text-gray-400 text-sm">Publicly traded company</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership Team */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Leadership Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {executives.map((exec, index) => (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <img
                        src={exec.image}
                        alt={exec.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{exec.name}</h3>
                    <p className="text-blue-400 text-sm mb-3">{exec.title}</p>
                    <p className="text-gray-300 text-sm">{exec.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Offices */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Our Offices</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {offices.map((office, index) => (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <FiMapPin className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{office.city}</h3>
                        <p className="text-gray-300 text-sm mb-2">{office.type}</p>
                        <p className="text-gray-400 text-sm mb-2">{office.address}</p>
                        <p className="text-blue-400 text-sm">{office.employees} employees</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Timeline */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Company Timeline</h2>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div className="w-20 text-right">
                      <span className="text-blue-400 font-bold">{milestone.year}</span>
                    </div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 bg-dark-100 border border-dark-200 rounded-lg p-4">
                      <p className="text-gray-300">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corporate Governance */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Corporate Governance</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Board of Directors</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Sarah Johnson - CEO & Director</li>
                    <li>• Michael Chen - CTO & Director</li>
                    <li>• Jennifer Walsh - Independent Director</li>
                    <li>• Robert Martinez - Independent Director</li>
                    <li>• Lisa Thompson - Independent Director</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Committees</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Audit Committee</li>
                    <li>• Compensation Committee</li>
                    <li>• Nominating & Governance Committee</li>
                    <li>• Technology Committee</li>
                    <li>• Content Committee</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Corporate Communications</h2>
              <p className="text-gray-300 mb-6">
                For media inquiries, partnership opportunities, or corporate information requests.
              </p>
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 inline-block">
                <div className="text-left">
                  <p className="text-white font-semibold">Corporate Communications</p>
                  <p className="text-blue-400">press@streamvault.com</p>
                  <p className="text-gray-400 text-sm mt-2">Phone: +1 (555) 123-4567</p>
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