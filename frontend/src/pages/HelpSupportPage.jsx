// src/pages/HelpSupportPage.jsx
// Help & Support: FAQ accordion + a fallback to real contact channels.

import { useState } from 'react';
import { ChevronDown, MessageCircle, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const FAQS = [
  {
    q: 'How do I become a verified donor?',
    a: 'Register with your real CNIC number. An admin will review and verify your account, after which a "Verified" badge appears on your profile and donor listing.'
  },
  {
    q: 'How does the BRT station meetup point work?',
    a: 'When registering or editing your profile, you can optionally select a preferred Zu Peshawar BRT station as a convenient place to meet a donor or recipient.'
  },
  {
    q: 'How do I contact a donor?',
    a: 'On the Search Donors or Communication page, click the "Chat on WhatsApp" button on any donor card. It opens WhatsApp with a pre-filled message to that donor.'
  },
  {
    q: 'How do I mark myself as unavailable?',
    a: 'Go to My Profile and click the availability toggle at the top of the page. You can switch between Available and Not Available at any time.'
  },
  {
    q: 'How do I post an emergency blood request?',
    a: 'Go to Emergency Requests, fill out the form with patient details, blood group, hospital, and your contact number, then click Post Request. It appears immediately on the public bulletin board.'
  },
  {
    q: 'Is my CNIC number shown publicly?',
    a: 'No. Your CNIC is used only for identity verification. Other users only ever see whether your account has a "Verified" badge - never the number itself.'
  }
];

export default function HelpSupportPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-bold text-brand-dark">Help &amp; Support</h1>
        <p className="text-sm text-gray-500 mb-5">
          Answers to common questions, and how to reach us if you need more help.
        </p>

        {/* FAQ */}
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 mb-5">
          {FAQS.map((faq, index) => (
            <div key={faq.q}>
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-brand-dark pr-4">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-brand-dark mb-3">Still need help?</h2>
          <div className="space-y-2.5 text-sm text-gray-600">
            <p className="flex items-center gap-2.5">
              <Phone size={15} className="text-brand-red" /> 0300-1234567
            </p>
            <p className="flex items-center gap-2.5">
              <Mail size={15} className="text-brand-red" /> support@smartbloodpk.com
            </p>
            <p className="flex items-center gap-2.5">
              <MessageCircle size={15} className="text-brand-red" /> 0300-1234567 (WhatsApp)
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-block mt-4 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
