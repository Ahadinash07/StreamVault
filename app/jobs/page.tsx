'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi'

export default function JobsPage() {
  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $160k',
      description: 'Join our engineering team to build next-generation streaming experiences using React, Next.js, and TypeScript.',
      requirements: ['5+ years React experience', 'Next.js expertise', 'TypeScript proficiency', 'UI/UX knowledge']
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$140k - $180k',
      description: 'Lead product strategy and development for our streaming platform, focusing on user experience and feature innovation.',
      requirements: ['3+ years PM experience', 'Streaming/media industry knowledge', 'Data analysis skills', 'Agile methodology']
    },
    {
      id: 3,
      title: 'Content Acquisition Specialist',
      department: 'Content',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80k - $110k',
      description: 'Work with studios and content creators to acquire premium movies and series for our platform.',
      requirements: ['Entertainment industry experience', 'Negotiation skills', 'Content licensing knowledge', 'Relationship building']
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Build and maintain our cloud infrastructure, ensuring high availability and scalability for millions of users.',
      requirements: ['AWS/Azure experience', 'Docker/Kubernetes', 'CI/CD pipelines', 'Monitoring tools']
    },
    {
      id: 5,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      salary: '$100k - $140k',
      description: 'Create beautiful, intuitive interfaces for our streaming platform that enhance user engagement.',
      requirements: ['4+ years UX/UI experience', 'Figma/Sketch proficiency', 'User research skills', 'Design systems']
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Team</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Help us revolutionize entertainment streaming. We're looking for passionate individuals
                who want to shape the future of digital media.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Why Work at StreamVault?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Innovation First</h3>
                  <p className="text-gray-300">
                    Work on cutting-edge features like AI recommendations, watch parties, and gamification.
                  </p>
                </div>
                <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Global Impact</h3>
                  <p className="text-gray-300">
                    Reach millions of users worldwide and shape how people consume entertainment.
                  </p>
                </div>
                <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Great Culture</h3>
                  <p className="text-gray-300">
                    Collaborative environment with flexible work arrangements and growth opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
              <div className="space-y-6">
                {jobOpenings.map((job) => (
                  <div key={job.id} className="bg-dark-100 border border-dark-200 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                        <p className="text-gray-300 mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiDollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <button className="mt-4 lg:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium">
                        Apply Now
                      </button>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Requirements:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-4">
                Don't see a position that matches your skills? We're always looking for talented individuals.
              </p>
              <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors font-medium">
                Send Us Your Resume
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}