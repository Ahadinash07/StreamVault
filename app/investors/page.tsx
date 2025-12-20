'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiTrendingUp, FiUsers, FiGlobe, FiAward } from 'react-icons/fi'

export default function InvestorsPage() {
  const stats = [
    {
      icon: FiUsers,
      value: '50M+',
      label: 'Active Users',
      description: 'Growing user base worldwide'
    },
    {
      icon: FiTrendingUp,
      value: '$2.4B',
      label: 'Market Cap',
      description: 'Strong financial performance'
    },
    {
      icon: FiGlobe,
      value: '180+',
      label: 'Countries',
      description: 'Global market presence'
    },
    {
      icon: FiAward,
      value: '25+',
      label: 'Awards',
      description: 'Industry recognition'
    }
  ]

  const financials = [
    {
      year: '2024',
      revenue: '$1.2B',
      growth: '+45%',
      users: '35M',
      description: 'Record-breaking year with significant user growth'
    },
    {
      year: '2023',
      revenue: '$820M',
      growth: '+38%',
      users: '24M',
      description: 'Strong performance despite market challenges'
    },
    {
      year: '2022',
      revenue: '$595M',
      growth: '+52%',
      users: '17M',
      description: 'Breakthrough year with platform expansion'
    }
  ]

  const milestones = [
    {
      date: 'Q4 2024',
      title: 'Global Expansion',
      description: 'Launched in 50 new countries, reaching 50M users'
    },
    {
      date: 'Q2 2024',
      title: 'AI Integration',
      description: 'Deployed advanced AI recommendation system'
    },
    {
      date: 'Q1 2024',
      title: 'Watch Parties Launch',
      description: 'Introduced synchronized viewing feature'
    },
    {
      date: 'Q4 2023',
      title: 'IPO Success',
      description: 'Successfully went public with $2.4B market cap'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Investor Relations</h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                StreamVault is revolutionizing the entertainment industry with innovative streaming technology
                and unique social features. Join us as we shape the future of digital media.
              </p>
            </div>

            {/* Key Statistics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-lg font-semibold text-gray-300 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-400">{stat.description}</div>
                  </div>
                )
              })}
            </div>

            {/* Company Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Company Overview</h2>
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Our Mission</h3>
                    <p className="text-gray-300 mb-6">
                      To transform entertainment consumption through innovative technology, social connectivity,
                      and personalized experiences that bring people together.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">Market Opportunity</h3>
                    <p className="text-gray-300">
                      The global streaming market is projected to reach $1.5 trillion by 2027.
                      StreamVault is uniquely positioned with its social features and AI technology.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Competitive Advantages</h3>
                    <ul className="text-gray-300 space-y-2 mb-6">
                      <li>• <strong>Watch Parties:</strong> First-to-market synchronized viewing</li>
                      <li>• <strong>AI Recommendations:</strong> Advanced personalization engine</li>
                      <li>• <strong>Gamification:</strong> Unique achievement and rewards system</li>
                      <li>• <strong>Social Integration:</strong> Community-driven features</li>
                      <li>• <strong>Global Scale:</strong> Multi-region infrastructure</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">Growth Strategy</h3>
                    <p className="text-gray-300">
                      Focus on user acquisition, content expansion, and technology innovation
                      to capture market share in the evolving streaming landscape.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Performance */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Financial Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-dark-100 border border-dark-200 rounded-lg">
                  <thead>
                    <tr className="border-b border-dark-200">
                      <th className="px-6 py-4 text-left text-white font-semibold">Year</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Revenue</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Growth</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Users</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Highlights</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financials.map((year, index) => (
                      <tr key={index} className="border-b border-dark-200 last:border-b-0">
                        <td className="px-6 py-4 text-white font-medium">{year.year}</td>
                        <td className="px-6 py-4 text-white">{year.revenue}</td>
                        <td className="px-6 py-4 text-green-400 font-medium">{year.growth}</td>
                        <td className="px-6 py-4 text-white">{year.users}</td>
                        <td className="px-6 py-4 text-gray-300">{year.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Milestones */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Milestones</h2>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{milestone.date}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                        <p className="text-gray-300">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Investor Contact</h2>
              <p className="text-gray-300 mb-6">
                For investor inquiries, please contact our investor relations team.
              </p>
              <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 inline-block">
                <div className="text-left">
                  <p className="text-white font-semibold">Investor Relations</p>
                  <p className="text-blue-400">investors@streamvault.com</p>
                  <p className="text-gray-400 text-sm mt-2">Phone: +1 (555) 987-6543</p>
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