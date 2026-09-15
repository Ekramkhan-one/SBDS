// src/pages/ProfilePage.jsx
// Logged-in user's own profile: view/edit editable fields, toggle
// availability, and see verification status. CNIC and email are shown
// read-only (see backend updateProfile for why).

import { useState } from 'react';
import { User, Mail, Phone, CreditCard, Droplet, MapPin, Bus, ShieldCheck, ShieldOff } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../api/authApi';
import { toggleMyAvailability } from '../api/donorApi';
import { BLOOD_GROUPS, PESHAWAR_AREAS, BRT_STATIONS } from '../data/peshawarData';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    bloodGroup: user?.bloodGroup || '',
    area: user?.area || '',
    preferredBrtStation: user?.preferredBrtStation || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const updated = await updateMyProfile(formData);
      updateUser(updated);
      setStatusMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    setIsTogglingAvailability(true);
    try {
      const result = await toggleMyAvailability();
      updateUser({ availabilityStatus: result.availabilityStatus });
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-xl font-bold text-brand-dark">My Profile</h1>
        <p className="text-sm text-gray-500 mb-5">
          View and update your account information.
        </p>

        {/* Identity summary card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-lg">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-brand-dark flex items-center gap-1.5">
                {user.fullName}
                {user.isVerified ? (
                  <span className="flex items-center gap-1 text-status-available text-xs font-medium">
                    <ShieldCheck size={14} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                    <ShieldOff size={14} /> Not Verified
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>

          {user.role === 'donor' && (
            <button
              onClick={handleToggleAvailability}
              disabled={isTogglingAvailability}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60 ${
                user.availabilityStatus === 'Available'
                  ? 'bg-green-50 text-status-available hover:bg-green-100'
                  : 'bg-orange-50 text-status-unavailable hover:bg-orange-100'
              }`}
            >
              {isTogglingAvailability
                ? 'Updating...'
                : `● ${user.availabilityStatus}`}
            </button>
          )}
        </div>

        {/* Editable profile form */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-brand-dark mb-4">Account Details</h2>

          {statusMsg.text && (
            <div
              className={`text-sm px-4 py-2.5 rounded-lg mb-4 ${
                statusMsg.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-status-available'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldInput
                icon={User}
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <FieldReadOnly icon={CreditCard} label="CNIC Number" value={user.cnicNumber || '—'} />
            </div>

            <FieldReadOnly icon={Mail} label="Email Address" value={user.email} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldInput
                icon={Phone}
                type="tel"
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="03\d{9}"
                title="Format: 03XXXXXXXXX"
                required
              />
              <FieldSelect
                icon={Droplet}
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </FieldSelect>
            </div>

            <FieldSelect
              icon={MapPin}
              label="Area (Peshawar)"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >
              {PESHAWAR_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </FieldSelect>

            <FieldSelect
              icon={Bus}
              label="Preferred BRT Station"
              name="preferredBrtStation"
              value={formData.preferredBrtStation}
              onChange={handleChange}
            >
              <option value="">No preference</option>
              {BRT_STATIONS.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </FieldSelect>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FieldInput({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          {...props}
          className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
        />
      </div>
    </div>
  );
}

function FieldSelect({ icon: Icon, label, children, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <select
          {...props}
          className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none bg-white"
        >
          {children}
        </select>
      </div>
    </div>
  );
}

function FieldReadOnly({ icon: Icon, label, value }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={value}
          disabled
          className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
