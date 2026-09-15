// src/pages/ContactPage.jsx
// Public contact page: "Get In Touch" details on the left, a functional
// contact form on the right, and an emergency callout at the bottom.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Droplet } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { submitContactMessage } from '../api/contactApi';

const initialFormState = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      await submitContactMessage(formData);
      setStatus('success');
      setFormData(initialFormState);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-brand-dark">Contact Us</h1>
        <p className="text-xs text-gray-400 mt-1">Home &gt; Contact Us</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Get In Touch */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-brand-dark mb-1">Get In Touch</h2>
            <p className="text-sm text-gray-500 mb-6">
              We are here to help! Feel free to reach out to us for any questions, suggestions or
              support.
            </p>

            <div className="space-y-5">
              <ContactDetail
                icon={MapPin}
                label="Our Location"
                value="Peshawar, Khyber Pakhtunkhwa, Pakistan"
              />
              <ContactDetail icon={Phone} label="Phone Number" value="0300-1234567" />
              <ContactDetail icon={Mail} label="Email Address" value="support@smartbloodpk.com" />
              <ContactDetail icon={MessageCircle} label="WhatsApp" value="0300-1234567" />
              <ContactDetail icon={Clock} label="Availability" value="Mon - Sun: 24/7" />
            </div>
          </div>

          {/* Send us a message */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-brand-dark mb-4">Send Us a Message</h2>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-status-available text-sm px-4 py-3 rounded-lg">
                Thanks for reaching out — we'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Send size={15} /> {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Emergency callout */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-center gap-5 mt-8">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Droplet size={22} className="text-brand-red" fill="currentColor" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-red text-sm">For Emergency?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              If you need blood urgently, please use the Emergency Request feature for faster
              response.
            </p>
          </div>
          <Link
            to="/emergency"
            className="bg-white border border-brand-red text-brand-red text-xs font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Go to Emergency Request &rarr;
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

function ContactDetail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-brand-red" />
      </div>
      <div>
        <p className="text-xs font-semibold text-brand-dark">{label}</p>
        <p className="text-sm text-gray-500">{value}</p>
      </div>
    </div>
  );
}
