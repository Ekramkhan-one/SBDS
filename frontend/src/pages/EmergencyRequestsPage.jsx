// src/pages/EmergencyRequestsPage.jsx
// Emergency Requests: a form to post an urgent blood request, and a live
// list of active requests on the bulletin board.

import { useState, useEffect, useCallback } from 'react';
import { Droplet, MapPin, Clock, MessageCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchEmergencyRequests, createEmergencyRequest } from '../api/emergencyApi';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { BLOOD_GROUPS, PESHAWAR_AREAS, HOSPITALS } from '../data/peshawarData';
import { useAuth } from '../context/AuthContext';

const initialFormState = {
  patientName: '',
  requiredBloodGroup: '',
  hospital: '',
  hospitalOtherText: '',
  area: '',
  requiredBy: '',
  contactInfo: '',
  urgencyLevel: 'High',
  unitsNeeded: 1,
  additionalNotes: ''
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} day(s) ago`;
};

export default function EmergencyRequestsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEmergencyRequests();
      setRequests(data.requests);
    } catch (err) {
      console.error('Failed to load emergency requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Pre-fill contact info with the logged-in user's phone number, since
  // they're already authenticated and it saves a step.
  useEffect(() => {
    if (user?.phoneNumber) {
      setFormData((prev) => ({ ...prev, contactInfo: user.phoneNumber }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await createEmergencyRequest(formData);
      setFormData({ ...initialFormState, contactInfo: user?.phoneNumber || '' });
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-brand-dark">Emergency Requests</h1>
        <p className="text-sm text-gray-500">Post or view urgent blood requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Post Emergency Request */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-brand-dark mb-4">Post Emergency Request</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                placeholder="Enter patient name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Blood Group Needed</label>
                <select
                  name="requiredBloodGroup"
                  value={formData.requiredBloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                >
                  <option value="" disabled>
                    Select Blood Group
                  </option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Units Needed</label>
                <input
                  type="number"
                  name="unitsNeeded"
                  value={formData.unitsNeeded}
                  onChange={handleChange}
                  min={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hospital</label>
              <select
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="" disabled>
                  Select hospital
                </option>
                {HOSPITALS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {formData.hospital === 'Other' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hospital Name</label>
                <input
                  type="text"
                  name="hospitalOtherText"
                  value={formData.hospitalOtherText}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  placeholder="Enter hospital name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Area in Peshawar</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="">Select Area (optional)</option>
                {PESHAWAR_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Urgency Level</label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Required By</label>
                <input
                  type="date"
                  name="requiredBy"
                  value={formData.requiredBy}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact Number</label>
              <input
                type="tel"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                pattern="03\d{9}"
                title="Format: 03XXXXXXXXX"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                placeholder="03XXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Message <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red resize-none"
                placeholder="Enter additional message..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Request'}
            </button>
          </form>
        </div>

        {/* Active Emergency Requests */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-brand-dark mb-4">Active Emergency Requests</h2>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-10">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              No active emergency requests right now.
            </p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req._id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Droplet size={16} className="text-brand-red" fill="currentColor" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark text-sm">{req.requiredBloodGroup}</p>
                        <p className="text-xs text-gray-500">
                          {req.unitsNeeded} unit{req.unitsNeeded > 1 ? 's' : ''} needed
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        req.urgencyLevel === 'Critical'
                          ? 'bg-red-100 text-brand-red'
                          : req.urgencyLevel === 'High'
                          ? 'bg-orange-50 text-status-unavailable'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {req.urgencyLevel}
                    </span>
                  </div>

                  <div className="mt-2 pl-11 space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <MapPin size={11} /> {req.hospital === 'Other' ? req.hospitalOtherText : req.hospital}
                      {req.area && `, ${req.area}`}
                    </p>
                    {req.requiredBy && (
                      <p className="text-xs text-gray-500">
                        Required by: {new Date(req.requiredBy).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Clock size={11} /> {timeAgo(req.createdAt)}
                    </p>
                  </div>

                  <a
                    href={buildWhatsAppLink(req.contactInfo, req.patientName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 ml-11 inline-flex items-center gap-1.5 bg-status-available text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle size={13} /> Contact via WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
