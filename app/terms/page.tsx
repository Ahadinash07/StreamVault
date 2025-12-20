'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Terms of Use</h1>
            <p className="text-gray-400 mb-8">Last updated: December 20, 2024</p>

            <div className="prose prose-lg prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300">
                  By accessing and using StreamVault, you accept and agree to be bound by the terms and provision
                  of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
                <p className="text-gray-300 mb-4">
                  Permission is granted to temporarily download one copy of the materials on StreamVault's website
                  for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
                  of title, and under this license you may not:
                </p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• modify or copy the materials</li>
                  <li>• use the materials for any commercial purpose or for any public display</li>
                  <li>• attempt to reverse engineer any software contained on the website</li>
                  <li>• remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Service Description</h2>
                <p className="text-gray-300">
                  StreamVault provides streaming services for movies, TV series, and other entertainment content.
                  Our platform includes unique features such as watch parties, AI-powered recommendations,
                  achievements, and social interactions. Service availability may vary by region and device.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. User Accounts</h2>
                <p className="text-gray-300 mb-4">
                  When you create an account with us, you must provide information that is accurate, complete,
                  and current at all times. You are responsible for safeguarding the password and for all
                  activities that occur under your account.
                </p>
                <p className="text-gray-300">
                  You agree not to disclose your password to any third party. You must notify us immediately
                  upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Subscription and Billing</h2>
                <p className="text-gray-300 mb-4">
                  Some parts of the Service are billed on a subscription basis. You will be billed in advance
                  on a recurring and periodic basis. Billing cycles are set on a monthly or annual basis,
                  depending on the type of subscription plan you select.
                </p>
                <p className="text-gray-300">
                  At the end of each billing cycle, your subscription will automatically renew under the
                  exact same conditions unless you cancel it or StreamVault cancels it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Content and Intellectual Property</h2>
                <p className="text-gray-300 mb-4">
                  The Service and its original content, features, and functionality are and will remain the
                  exclusive property of StreamVault and its licensors. The Service is protected by copyright,
                  trademark, and other laws.
                </p>
                <p className="text-gray-300">
                  You may not duplicate, copy, or reuse any portion of the HTML/CSS, JavaScript, or visual
                  design elements or concepts without express written permission from StreamVault.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Uses</h2>
                <p className="text-gray-300 mb-4">You may not use our Service:</p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>• To submit false or misleading information</li>
                  <li>• To upload or transmit viruses or any other type of malicious code</li>
                  <li>• To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>• For any obscene or immoral purpose</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
                <p className="text-gray-300">
                  We may terminate or suspend your account immediately, without prior notice or liability,
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="text-gray-300">
                  Upon termination, your right to use the Service will cease immediately. If you wish to
                  terminate your account, you may simply discontinue using the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-300">
                  In no event shall StreamVault, nor its directors, employees, partners, agents, suppliers,
                  or affiliates, be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other
                  intangible losses, resulting from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
                <p className="text-gray-300">
                  These Terms shall be interpreted and governed by the laws of the State of California,
                  United States, without regard to its conflict of law provisions. Our failure to enforce
                  any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
                <p className="text-gray-300">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                  If a revision is material, we will try to provide at least 30 days notice prior to any new
                  terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
                <p className="text-gray-300">
                  If you have any questions about these Terms of Use, please contact us at{' '}
                  <a href="mailto:legal@streamvault.com" className="text-blue-400 hover:text-blue-300">
                    legal@streamvault.com
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