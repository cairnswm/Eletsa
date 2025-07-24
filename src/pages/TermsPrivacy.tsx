import React, { useState } from 'react';
import { Shield, FileText, Eye, Lock } from 'lucide-react';

export const TermsPrivacy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
            Terms & Privacy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy and security are important to us. Read our policies below.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('terms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'terms'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Terms of Service</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'privacy'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {activeTab === 'terms' ? (
            <div className="prose prose-gray max-w-none">
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="w-6 h-6 text-[#1E30FF]" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Terms of Service</h2>
              </div>
              
              <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using Eletsa, you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Permission is granted to temporarily use Eletsa for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Event Organizers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Event organizers are responsible for the accuracy of their event information, compliance with local laws, 
                    and delivering the events as advertised. Eletsa acts as a platform facilitator and is not responsible for 
                    the quality or delivery of individual events.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Payments and Refunds</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payments are processed securely through PayGate. Refund policies are set by individual event organizers. 
                    Eletsa charges a 5% commission on ticket sales to organizers.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">5. User Conduct</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Users agree to use the platform respectfully and not engage in harassment, spam, or fraudulent activities. 
                    We reserve the right to suspend or terminate accounts that violate these terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Eletsa shall not be liable for any damages arising from the use of this platform, including but not limited to 
                    event cancellations, technical issues, or disputes between users and organizers.
                  </p>
                </section>
              </div>
            </div>
          ) : (
            <div className="prose prose-gray max-w-none">
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="w-6 h-6 text-[#1E30FF]" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">Privacy Policy</h2>
              </div>
              
              <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">We collect information you provide directly to us, such as:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Account information (email, name, profile details)</li>
                    <li>Event creation and ticket purchase data</li>
                    <li>Messages and communications on the platform</li>
                    <li>Payment information (processed securely by PayGate)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Provide and maintain our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Communicate with you about events and platform updates</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                    except as described in this policy. We may share information with trusted service providers who assist us in 
                    operating our platform, conducting business, or serving users.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience on our platform. 
                    You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at privacy@eletsa.co.za 
                    or through our contact form.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};