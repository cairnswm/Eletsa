import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone } from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Getting Started',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button on the homepage and fill in your email and password. You\'ll be able to start browsing events immediately.'
        },
        {
          question: 'How do I find events near me?',
          answer: 'Use the search filters on the home page to filter by location, or use the "Near Me" quick filter to find events in your area.'
        },
        {
          question: 'Is it free to use Eletsa?',
          answer: 'Yes! Creating an account and browsing events is completely free. You only pay for the tickets you purchase.'
        }
      ]
    },
    {
      title: 'Buying Tickets',
      faqs: [
        {
          question: 'How do I purchase tickets?',
          answer: 'Browse events, click on an event you\'re interested in, select your ticket type and quantity, then proceed to checkout with secure payment.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, and bank transfers through our secure PayGate integration.'
        },
        {
          question: 'Can I get a refund for my tickets?',
          answer: 'Refund policies depend on the event organizer\'s settings. Check the ticket details for refund information before purchasing.'
        },
        {
          question: 'How do I access my tickets?',
          answer: 'Your tickets are available in the "My Tickets" section of your account. You can view QR codes and download PDF tickets.'
        }
      ]
    },
    {
      title: 'Organizing Events',
      faqs: [
        {
          question: 'How do I become an event organizer?',
          answer: 'Go to your profile page and click "Become an Organizer". Complete your profile information to start creating events.'
        },
        {
          question: 'What fees do organizers pay?',
          answer: 'Organizers pay a 5% commission on each ticket sold. There are no upfront costs or monthly fees.'
        },
        {
          question: 'How do I get paid for ticket sales?',
          answer: 'You can request payouts through your organizer dashboard. Payments are processed securely through our payout system.'
        },
        {
          question: 'Can I edit my event after publishing?',
          answer: 'Yes, you can edit most event details from your "My Events" dashboard. Some restrictions may apply for events with existing ticket sales.'
        }
      ]
    },
    {
      title: 'Technical Support',
      faqs: [
        {
          question: 'I\'m having trouble with payments',
          answer: 'If you encounter payment issues, please contact our support team with your order details. We\'ll resolve the issue quickly.'
        },
        {
          question: 'My tickets aren\'t showing up',
          answer: 'Check your email for confirmation and ensure you\'re logged into the correct account. Contact support if tickets are still missing.'
        },
        {
          question: 'How do I report a problem with an event?',
          answer: 'Use the contact organizer feature or reach out to our support team if you need to report issues with an event.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8 mb-12">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E30FF]/10 to-[#FF2D95]/10 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isExpanded = expandedFAQ === globalIndex;
                  
                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Still Need Help?</h2>
          <p className="text-gray-600 text-center mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:border-[#1E30FF] transition-colors duration-200">
              <MessageCircle className="w-8 h-8 text-[#1E30FF] mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">Get instant help from our support team</p>
              <button className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200">
                Start Chat
              </button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:border-[#489707] transition-colors duration-200">
              <Mail className="w-8 h-8 text-[#489707] mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">Send us a detailed message</p>
              <a 
                href="mailto:support@eletsa.co.za"
                className="bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 inline-block"
              >
                Send Email
              </a>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:border-[#FF2D95] transition-colors duration-200">
              <Phone className="w-8 h-8 text-[#FF2D95] mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4">Speak directly with our team</p>
              <a 
                href="tel:+27123456789"
                className="bg-gradient-to-r from-[#FF2D95] to-[#f0900a] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 inline-block"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};