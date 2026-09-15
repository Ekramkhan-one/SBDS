// src/pages/CommunicationPage.jsx
// WhatsApp Quick Contact: browse available donors and message them directly.
// "Recent Contacts" is included as a tab per the mockup, but since contact
// history isn't tracked anywhere in the system yet, it honestly shows an
// empty state rather than fabricating fake recent-contact data.

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, ShieldCheck, Clock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchDonors } from '../api/donorApi';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'recent'
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonors() {
      try {
        const data = await fetchDonors();
        setDonors(data.donors);
      } catch (err) {
        console.error('Failed to load donors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDonors();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-brand-dark">Communication</h1>
        <p className="text-sm text-gray-500">Quickly connect with donors.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'quick'
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            WhatsApp Quick Contact
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'recent'
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Recent Contacts
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'quick' ? (
            loading ? (
              <p className="text-sm text-gray-400 text-center py-10">Loading donors...</p>
            ) : donors.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No available donors yet.</p>
            ) : (
              <div className="space-y-2">
                {donors.map((donor) => (
                  <div
                    key={donor._id}
                    className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-maroon text-white flex items-center justify-center font-semibold text-sm">
                        {donor.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-dark flex items-center gap-1.5">
                          {donor.fullName}
                          {donor.isVerified && (
                            <ShieldCheck size={13} className="text-status-available" />
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          <span className="text-brand-red font-semibold">{donor.bloodGroup}</span> |{' '}
                          {donor.area}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
                        <Phone size={11} /> {donor.phoneNumber}
                      </span>
                      <a
                        href={buildWhatsAppLink(donor.phoneNumber, donor.fullName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-status-available hover:opacity-90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity whitespace-nowrap"
                      >
                        <MessageCircle size={13} /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-14 text-gray-400">
              <Clock size={28} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Recent contact history isn't tracked yet.</p>
              <p className="text-xs mt-1">
                Once you message a donor, they'll show up here in a future update.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 text-xs text-blue-700 px-4 py-2.5 rounded-lg mt-4 text-center">
        Click on the WhatsApp button to start a conversation instantly.
      </div>
    </DashboardLayout>
  );
}
