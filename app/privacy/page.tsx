'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>
            <p className="text-gray-400 mb-8">Last updated: December 20, 2024</p>

            <div className="prose prose-lg prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p className="text-gray-300 mb-4">
                  We collect information you provide directly to us, information we obtain automatically when
                  you use our services, and information from third-party sources.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">Information You Provide</h3>
                <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                  <li>• Account information (name, email, password)</li>
                  <li>• Profile information and preferences</li>
                  <li>• Payment information for subscriptions</li>
                  <li>• Communications you send to us</li>
                  <li>• User-generated content and reviews</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">Information We Collect Automatically</h3>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• Viewing history and progress tracking</li>
                  <li>• Device information and browser type</li>
                  <li>• IP address and location data</li>
                  <li>• Usage patterns and feature interactions</li>
                  <li>• Cookies and similar technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-300 mb-4">We use the information we collect to:</p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• Provide, maintain, and improve our services</li>
                  <li>• Process transactions and manage subscriptions</li>
                  <li>• Personalize content and recommendations</li>
                  <li>• Track viewing progress and continue watching features</li>
                  <li>• Enable social features like watch parties and reviews</li>
                  <li>• Send you technical notices and support messages</li>
                  <li>• Communicate with you about products, services, and promotions</li>
                  <li>• Monitor and analyze usage patterns and trends</li>
                  <li>• Detect, prevent, and address technical issues and fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing and Disclosure</h2>
                <p className="text-gray-300 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties
                  without your consent, except as described in this policy.
                </p>

                <p className="text-gray-300 mb-4">We may share your information:</p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• With service providers who assist our operations</li>
                  <li>• To comply with legal obligations</li>
                  <li>• To protect our rights and prevent fraud</li>
                  <li>• In connection with a business transfer or acquisition</li>
                  <li>• With your consent or at your direction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Cookies and Tracking Technologies</h2>
                <p className="text-gray-300 mb-4">
                  We use cookies, web beacons, and similar technologies to collect information and enhance
                  your experience on our platform.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">Types of Cookies We Use:</h3>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• <strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li>• <strong>Performance Cookies:</strong> Help us understand how you use our service</li>
                  <li>• <strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li>• <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>

                <p className="text-gray-300 mt-4">
                  You can control cookies through your browser settings, but disabling certain cookies
                  may limit your ability to use some features of our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                <p className="text-gray-300">
                  We implement appropriate technical and organizational measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. However,
                  no method of transmission over the internet or electronic storage is 100% secure, and
                  we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
                <p className="text-gray-300">
                  We retain your personal information for as long as necessary to provide our services,
                  comply with legal obligations, resolve disputes, and enforce our agreements. When we
                  no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
                <p className="text-gray-300 mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• <strong>Access:</strong> Request a copy of your personal information</li>
                  <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li>• <strong>Portability:</strong> Receive your data in a structured format</li>
                  <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li>• <strong>Restriction:</strong> Limit how we process your information</li>
                </ul>

                <p className="text-gray-300 mt-4">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:privacy@streamvault.com" className="text-blue-400 hover:text-blue-300">
                    privacy@streamvault.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
                <p className="text-gray-300">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect
                  personal information from children under 13. If we become aware that we have collected
                  personal information from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
                <p className="text-gray-300">
                  Your information may be transferred to and processed in countries other than your own.
                  We ensure appropriate safeguards are in place to protect your personal information
                  when it is transferred internationally.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Third-Party Services</h2>
                <p className="text-gray-300">
                  Our service may contain links to third-party websites or services that are not owned
                  or controlled by us. We are not responsible for the privacy practices of these third
                  parties. We encourage you to read the privacy policies of any third-party services
                  you use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-300">
                  We may update this Privacy Policy from time to time. We will notify you of any changes
                  by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@streamvault.com" className="text-blue-400 hover:text-blue-300">
                    privacy@streamvault.com
                  </a>
                  {' '}or by mail at:
                </p>
                <div className="text-gray-300 mt-4">
                  <p>StreamVault Privacy Team</p>
                  <p>123 Entertainment Avenue</p>
                  <p>Los Angeles, CA 90210</p>
                  <p>United States</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}