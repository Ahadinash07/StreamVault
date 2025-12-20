'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      details: 'hello@streamvault.com',
      description: 'General inquiries and support'
    },
    {
      icon: FiPhone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM PST'
    },
    {
      icon: FiMapPin,
      title: 'Office',
      details: '123 Entertainment Ave, Los Angeles, CA 90210',
      description: 'Visit our headquarters'
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM PST',
      description: 'Weekend support available'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Have questions, feedback, or need support? We're here to help.
                Get in touch with our team and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                          <p className="text-blue-400 font-medium mb-1">{info.details}</p>
                          <p className="text-gray-400 text-sm">{info.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                  <p className="text-gray-300 mb-4">
                    Stay connected and get the latest updates about new features, content releases, and platform news.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-dark-100 hover:bg-dark-200 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-white font-bold text-sm">f</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-dark-100 hover:bg-dark-200 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-white font-bold text-sm">t</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-dark-100 hover:bg-dark-200 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-white font-bold text-sm">i</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-dark-100 hover:bg-dark-200 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-white font-bold text-sm">y</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-white font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="content">Content Related</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}